"""
Lambda Python pour parser les fichiers 13F EDGAR
Déclenché par EventBridge quand un nouveau 13F est découvert
"""

import json
import os
import requests
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

# Helper pour faire des requêtes Supabase directement (évite pydantic)
def supabase_request(method, table, data=None, filters=None):
    """Faire une requête HTTP directe vers Supabase REST API"""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # Construire les query params pour les filtres (format PostgREST)
    params = []
    if filters:
        for k, v in filters.items():
            params.append(f"{k}=eq.{v}")
        if params:
            url += "?" + "&".join(params)
    
    if method == "GET":
        response = requests.get(url, headers=headers)
    elif method == "POST":
        response = requests.post(url, headers=headers, json=data)
    elif method == "PATCH":
        # Pour PATCH, les filtres doivent être dans l'URL
        response = requests.patch(url, headers=headers, json=data)
    else:
        raise ValueError(f"Unsupported method: {method}")
    
    response.raise_for_status()
    result = response.json() if response.text else None
    # Pour GET, retourner une liste même si un seul résultat
    if method == "GET" and result and not isinstance(result, list):
        return [result]
    return result

def handler(event, context):
    """
    Event structure:
    {
        "detail": {
            "fund_id": 1,
            "cik": "0001234567",
            "accession_number": "0001234567-24-000001",
            "filing_url": "https://www.sec.gov/..."
        }
    }
    """
    print(f"Parser 13F triggered: {json.dumps(event)}")
    
    detail = event.get("detail", {})
    fund_id = detail.get("fund_id")
    cik = detail.get("cik")
    accession_number = detail.get("accession_number")
    filing_url = detail.get("filing_url")
    
    if not all([fund_id, cik, accession_number, filing_url]):
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing required fields"})
        }
    
    try:
        # Vérifier les variables d'environnement
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables")
        
        # 1. Trouver dynamiquement le fichier XML depuis la page index
        # Le nom du fichier peut varier : Form13FInfoTable.xml, infotable.xml, etc.
        print(f"Finding XML file for filing: {accession_number}")
        print(f"Filing URL: {filing_url}")
        
        headers = {
            "User-Agent": "ADEL AI (contact@adel.ai)"
        }
        
        # Parser la page index pour trouver le lien vers le fichier XML
        index_response = requests.get(filing_url, headers=headers, timeout=30)
        index_response.raise_for_status()
        
        # Chercher le lien vers le fichier XML dans la page HTML
        soup = BeautifulSoup(index_response.text, "html.parser")
        
        # Chercher les liens vers les fichiers XML (peuvent avoir différents noms)
        xml_url = None
        possible_names = ["Form13FInfoTable.xml", "infotable.xml", "InfoTable.xml", "form13finfotable.xml", "form13fInfoTable.xml", "Form13fInfoTable.xml"]
        
        # PRIORITÉ 1: Essayer d'abord dans le répertoire racine (XML brut)
        accession_no_dashes = accession_number.replace("-", "")
        cik_clean = cik.lstrip("0")
        for name in possible_names:
            # Essayer d'abord dans le répertoire racine
            test_url = f"https://www.sec.gov/Archives/edgar/data/{cik_clean}/{accession_no_dashes}/{name}"
            try:
                test_resp = requests.head(test_url, headers=headers, timeout=10)
                if test_resp.status_code == 200:
                    # Vérifier si c'est du vrai XML (pas du HTML transformé)
                    content_check = requests.get(test_url, headers=headers, timeout=10)
                    if content_check.text.strip().startswith("<?xml"):
                        # Vérifier qu'il n'est pas transformé en HTML
                        if "<!DOCTYPE html" not in content_check.text[:500]:
                            xml_url = test_url
                            print(f"Found XML in root directory: {xml_url}")
                            break
            except:
                continue
        
        # PRIORITÉ 2: Si pas trouvé dans le répertoire racine, chercher dans les liens de la page
        if not xml_url:
            # Extraire le répertoire de base depuis filing_url
            base_dir = "/".join(filing_url.split("/")[:-1])  # Enlever le nom du fichier index
            
            # Chercher dans les liens de la page
            for link in soup.find_all("a", href=True):
                href = link.get("href", "")
                # Chercher un fichier XML qui correspond aux noms possibles
                for name in possible_names:
                    if name.lower() in href.lower() and href.endswith(".xml"):
                        # Construire l'URL complète
                        if href.startswith("http"):
                            candidate_url = href
                        elif href.startswith("/"):
                            candidate_url = f"https://www.sec.gov{href}"
                        else:
                            candidate_url = f"{base_dir}/{href}"
                        
                        # Vérifier que ce n'est pas du HTML transformé
                        try:
                            content_check = requests.get(candidate_url, headers=headers, timeout=10)
                            if content_check.text.strip().startswith("<?xml") and "<!DOCTYPE html" not in content_check.text[:500]:
                                xml_url = candidate_url
                                print(f"Found XML in subdirectory: {xml_url}")
                                break
                        except:
                            continue
                if xml_url:
                    break
        
        if not xml_url:
            raise ValueError(f"Could not find XML file for filing {accession_number}")
        
        print(f"Found XML file: {xml_url}")
        
        # 2. Télécharger le fichier XML (avec timeout plus long pour gros fichiers)
        response = requests.get(xml_url, headers=headers, timeout=120, stream=True)
        response.raise_for_status()
        
        # 3. Récupérer le filing_id (depuis l'event ou depuis la DB)
        filing_id = detail.get("filing_id")
        if not filing_id:
            # Fallback: récupérer depuis la DB via API REST
            filing_result = supabase_request("GET", "fund_filings", filters={"accession_number": accession_number})
            if filing_result and len(filing_result) > 0:
                filing_id = filing_result[0]["id"]
            else:
                raise ValueError(f"Filing not found for accession_number: {accession_number}")
        
        # 4. Parser le XML (utiliser response.content avec gestion d'encodage)
        # Détecter l'encodage depuis les headers ou le XML
        content = response.content
        # Essayer de décoder en UTF-8, sinon utiliser l'encodage détecté
        try:
            content_str = content.decode('utf-8', errors='replace')
        except:
            # Si UTF-8 échoue, essayer latin-1 (qui peut décoder n'importe quel byte)
            content_str = content.decode('latin-1', errors='replace')
        
        holdings = parse_13f_file(content_str, xml_url)
        
        # 5. Insérer les holdings
        for holding in holdings:
            supabase_request("POST", "fund_holdings", data={
                "fund_id": fund_id,
                "filing_id": filing_id,
                "cik": cik,
                "ticker": holding.get("ticker"),
                "cusip": holding.get("cusip"),
                "shares": holding.get("shares"),
                "market_value": holding.get("market_value"),
                "type": holding.get("type", "stock")
            })
        
        # 6. Mettre à jour le statut
        supabase_request("PATCH", "fund_filings", 
            data={"status": "PARSED", "updated_at": "now()"},
            filters={"id": filing_id}
        )
        
        print(f"Successfully parsed {len(holdings)} holdings for filing {accession_number}")
        
        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "filing_id": filing_id,
                "holdings_count": len(holdings)
            })
        }
        
    except Exception as e:
        print(f"Error parsing 13F: {str(e)}")
        # Marquer comme FAILED
        try:
            supabase_request("PATCH", "fund_filings",
                data={"status": "FAILED", "updated_at": "now()"},
                filters={"accession_number": accession_number}
            )
        except:
            pass
        
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }


def parse_13f_file(content: str, url: str) -> list:
    """
    Parse un fichier 13F XML et extrait les holdings
    Solution universelle qui détecte automatiquement le format et utilise le parser adapté
    """
    holdings = []
    
    try:
        # Vérifier si c'est du HTML transformé ou du XML brut
        is_html = "<!DOCTYPE html" in content[:500] or content.strip().startswith("<html")
        
        if is_html:
            # C'est du HTML transformé, utiliser BeautifulSoup
            print("Warning: Received HTML instead of XML, trying to parse as HTML...")
            soup = BeautifulSoup(content, "html.parser")
            info_tables = soup.find_all("table", class_=lambda x: x and "infotable" in str(x).lower())
            if not info_tables:
                all_tables = soup.find_all("table")
                info_tables = [t for t in all_tables if t.find("tr") and len(t.find_all("tr")) > 2]
            
            print(f"Found {len(info_tables)} holdings in HTML")
            return parse_holdings_from_beautifulsoup(info_tables)
        else:
            # C'est du XML brut - utiliser xml.etree.ElementTree (plus rapide) en priorité
            # Fallback sur BeautifulSoup si nécessaire
            print("Parsing XML file...")
            
            # MÉTHODE 1: xml.etree.ElementTree (rapide, gère bien les namespaces)
            try:
                # Parser avec ET (ignore les namespaces automatiquement)
                root = ET.fromstring(content)
                
                # Chercher tous les infoTable (ignore les namespaces)
                # ET utilise {namespace}localname, mais on peut chercher par localname seulement
                info_tables = []
                for elem in root.iter():
                    # Extraire le nom local (sans namespace)
                    localname = elem.tag.split('}')[-1] if '}' in elem.tag else elem.tag
                    if localname.lower() == 'infotable':
                        info_tables.append(elem)
                
                if info_tables:
                    print(f"Method 1 (xml.etree.ElementTree): Found {len(info_tables)} infoTable elements")
                    return parse_holdings_from_etree(info_tables)
            except Exception as e:
                print(f"Method 1 (ET) failed: {str(e)}, trying BeautifulSoup...")
            
            # MÉTHODE 2: BeautifulSoup (fallback, plus lent mais plus tolérant)
            try:
                soup = BeautifulSoup(content, "html.parser")
                
                # Chercher toutes les balises et filtrer par nom (ignore les namespaces)
                all_elements = soup.find_all(True, recursive=True)
                info_tables = [t for t in all_elements if t.name and t.name.lower() == "infotable"]
                
                if not info_tables:
                    info_tables = soup.find_all(["infoTable", "InfoTable", "infotable"])
                
                if not info_tables:
                    info_table_parent = soup.find("informationTable")
                    if info_table_parent:
                        info_tables = info_table_parent.find_all("infoTable", recursive=True)
                
                if info_tables:
                    print(f"Method 2 (BeautifulSoup): Found {len(info_tables)} infoTable elements")
                    return parse_holdings_from_beautifulsoup(info_tables)
            except Exception as e:
                print(f"Method 2 (BeautifulSoup) failed: {str(e)}")
                raise
        
        # Si aucune méthode n'a fonctionné
        print("No holdings found with any parsing method")
        return []
        
    except Exception as e:
        print(f"Error parsing XML: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


def parse_holdings_from_etree(info_tables) -> list:
    """
    Parse les holdings depuis des éléments xml.etree.ElementTree
    """
    holdings = []
    
    for table in info_tables:
        # Fonction helper pour extraire le texte d'un élément (ignore namespace)
        def get_text(elem, tag_name):
            for child in elem:
                localname = child.tag.split('}')[-1] if '}' in child.tag else child.tag
                if localname.lower() == tag_name.lower():
                    return child.text.strip() if child.text else ""
            return ""
        
        def get_element(elem, tag_name):
            for child in elem:
                localname = child.tag.split('}')[-1] if '}' in child.tag else child.tag
                if localname.lower() == tag_name.lower():
                    return child
            return None
        
        # Extraire les champs
        name = get_text(table, "nameOfIssuer")
        cusip = get_text(table, "cusip")
        value_text = get_text(table, "value")
        
        # Shares: <shrsOrPrnAmt><sshPrnamt>...</sshPrnamt></shrsOrPrnAmt>
        shrs_elem = get_element(table, "shrsOrPrnAmt")
        shares_text = ""
        if shrs_elem:
            shares_text = get_text(shrs_elem, "sshPrnamt")
        
        put_call = get_text(table, "putCall")
        
        # Valeurs numériques
        try:
            value = int(float(value_text.replace(",", ""))) if value_text else 0
            shares = int(float(shares_text.replace(",", ""))) if shares_text else 0
            
            # Détecter le format (dollars vs milliers)
            if value > 1_000_000 and shares > 0:
                price_if_thousands = (value * 1000) / shares
                if price_if_thousands > 1000:
                    value_usd = value // 1000
                else:
                    value_usd = value
            else:
                value_usd = value
        except:
            value_usd = 0
            shares = 0
        
        # Type
        put_call_upper = put_call.upper()
        holding_type = "put" if put_call_upper == "PUT" else ("call" if put_call_upper == "CALL" else "stock")
        
        # Ticker
        ticker = extract_ticker(name)
        
        holdings.append({
            "ticker": ticker,
            "cusip": cusip,
            "shares": shares,
            "market_value": value_usd,
            "type": holding_type
        })
    
    return holdings


def parse_holdings_from_beautifulsoup(info_tables) -> list:
    """
    Parse les holdings depuis des éléments BeautifulSoup
    """
    holdings = []
    
    for table in info_tables:
            # Extraire les champs (camelCase dans le XML) - chercher avec différentes casses
            name_elem = (table.find("nameofissuer") or table.find("nameOfIssuer") or 
                        table.find("n1:nameofissuer") or table.find("n1:nameOfIssuer"))
            cusip_elem = (table.find("cusip") or table.find("CUSIP") or 
                         table.find("n1:cusip") or table.find("n1:CUSIP"))
            value_elem = (table.find("value") or table.find("Value") or 
                         table.find("n1:value") or table.find("n1:Value"))
            
            # Shares: <shrsOrPrnAmt><sshPrnamt>...</sshPrnamt></shrsOrPrnAmt>
            shrs_elem = (table.find("shrsorprnamt") or table.find("shrsOrPrnAmt") or 
                        table.find("n1:shrsorprnamt") or table.find("n1:shrsOrPrnAmt"))
            if shrs_elem:
                ssh_prnamt_elem = (shrs_elem.find("sshprnamt") or shrs_elem.find("sshPrnamt") or 
                                  shrs_elem.find("n1:sshprnamt") or shrs_elem.find("n1:sshPrnamt"))
            else:
                ssh_prnamt_elem = None
            
            put_call_elem = (table.find("putcall") or table.find("putCall") or 
                           table.find("n1:putcall") or table.find("n1:putCall"))
            
            # Extraire les valeurs textuelles
            name = name_elem.get_text(strip=True) if name_elem else ""
            cusip = cusip_elem.get_text(strip=True) if cusip_elem else ""
            
            # Valeurs numériques
            # NOTE: Format SEC 13F - valeurs en milliers de dollars
            # Exception: ARK (CIK 0001697748) utilise parfois des valeurs en dollars
            # On détecte automatiquement: si value > 1M et prix/action > 1000, c'est en dollars
            try:
                value_text = value_elem.get_text(strip=True) if value_elem else "0"
                value = int(float(value_text.replace(",", ""))) if value_text else 0
                
                # Détecter le format (dollars vs milliers)
                # Si la valeur est très grande (> 1M) et qu'on a des shares, vérifier le prix
                shares_text = ssh_prnamt_elem.get_text(strip=True) if ssh_prnamt_elem else "0"
                shares = int(float(shares_text.replace(",", ""))) if shares_text else 0
                
                if value > 1_000_000 and shares > 0:
                    # Calculer prix par action si en milliers
                    price_if_thousands = (value * 1000) / shares
                    # Si prix > 1000, probablement en dollars (convertir en milliers)
                    if price_if_thousands > 1000:
                        value_usd = value // 1000  # Convertir dollars → milliers
                    else:
                        value_usd = value  # Déjà en milliers
                else:
                    value_usd = value  # Valeur en milliers de dollars
            except:
                value_usd = 0
            
            # Shares (déjà extrait ci-dessus pour la détection de format)
            try:
                if shares == 0:  # Si pas encore extrait
                    shares_text = ssh_prnamt_elem.get_text(strip=True) if ssh_prnamt_elem else "0"
                    shares = int(float(shares_text.replace(",", ""))) if shares_text else 0
            except:
                shares = 0
            
            # Type (stock, call, put)
            put_call = put_call_elem.get_text(strip=True).upper() if put_call_elem else ""
            holding_type = "put" if put_call == "PUT" else ("call" if put_call == "CALL" or put_call == "CALL" else "stock")
            
            # Ticker (approximation depuis le nom)
            ticker = extract_ticker(name)
            
            holdings.append({
                "ticker": ticker,
                "cusip": cusip,
                "shares": shares,
                "market_value": value_usd,
                "type": holding_type
            })
    
    return holdings


def extract_ticker(name: str) -> str:
    """
    Extraire le ticker depuis le nom (approximation)
    En production, utiliser un mapping CUSIP → Ticker
    """
    # TODO: Implémenter mapping CUSIP → Ticker
    # Pour l'instant, retourner le nom tel quel
    return name.upper()[:10] if name else ""

