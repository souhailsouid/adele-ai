#!/usr/bin/env python3
"""
Script pour parser les filings 13F d'un fund spécifique
Utilise le même code que le Lambda parser-13f
"""

import os
import sys
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client

# Charger .env depuis la racine du projet si disponible
try:
    from dotenv import load_dotenv
    from pathlib import Path
    env_path = Path(__file__).parent.parent / ".env"
    if env_path.exists():
        load_dotenv(env_path)
except ImportError:
    pass

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Variables d'environnement manquantes!")
    print("Définir SUPABASE_URL et SUPABASE_SERVICE_KEY ou créer un fichier .env")
    sys.exit(1)

def parse_13f_file(content: str, url: str) -> list:
    """Parse un fichier 13F XML et extrait les holdings"""
    holdings = []
    
    try:
        soup = BeautifulSoup(content, "html.parser")
        
        # Structure 13F XML: <infoTable> contient chaque holding (avec namespace)
        info_tables = soup.find_all("infotable") or soup.find_all("n1:infotable")
        
        print(f"   Found {len(info_tables)} holdings in XML")
        
        for table in info_tables:
            # Extraire les champs (camelCase dans le XML)
            name_elem = table.find("nameofissuer") or table.find("n1:nameofissuer")
            cusip_elem = table.find("cusip") or table.find("n1:cusip")
            value_elem = table.find("value") or table.find("n1:value")
            
            # Shares: <shrsOrPrnAmt><sshPrnamt>...</sshPrnamt></shrsOrPrnAmt>
            shrs_elem = table.find("shrsorprnamt") or table.find("n1:shrsorprnamt")
            if shrs_elem:
                ssh_prnamt_elem = shrs_elem.find("sshprnamt") or shrs_elem.find("n1:sshprnamt")
            else:
                ssh_prnamt_elem = None
            
            put_call_elem = table.find("putcall") or table.find("n1:putcall")
            
            # Extraire les valeurs textuelles
            name = name_elem.get_text(strip=True) if name_elem else ""
            cusip = cusip_elem.get_text(strip=True) if cusip_elem else ""
            
            # Valeurs numériques
            try:
                value_text = value_elem.get_text(strip=True) if value_elem else "0"
                value = int(float(value_text.replace(",", ""))) if value_text else 0
                
                # Détecter le format (dollars vs milliers)
                shares_text = ssh_prnamt_elem.get_text(strip=True) if ssh_prnamt_elem else "0"
                shares = int(float(shares_text.replace(",", ""))) if shares_text else 0
                
                if value > 1_000_000 and shares > 0:
                    price_if_thousands = (value * 1000) / shares
                    if price_if_thousands > 1000:
                        value_usd = value // 1000  # Convertir dollars → milliers
                    else:
                        value_usd = value  # Déjà en milliers
                else:
                    value_usd = value  # Valeur en milliers de dollars
            except:
                value_usd = 0
            
            try:
                if shares == 0:
                    shares_text = ssh_prnamt_elem.get_text(strip=True) if ssh_prnamt_elem else "0"
                    shares = int(float(shares_text.replace(",", ""))) if shares_text else 0
            except:
                shares = 0
            
            # Type (stock, call, put)
            put_call = put_call_elem.get_text(strip=True).upper() if put_call_elem else ""
            holding_type = "put" if put_call == "PUT" else ("call" if put_call == "CALL" else "stock")
            
            # Ticker (approximation depuis le nom)
            ticker = name.upper()[:10] if name else ""
            
            holdings.append({
                "ticker": ticker,
                "cusip": cusip,
                "shares": shares,
                "market_value": value_usd,
                "type": holding_type
            })
        
        print(f"   Successfully parsed {len(holdings)} holdings")
        
    except Exception as e:
        print(f"   ❌ Error parsing XML: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
    
    return holdings

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 parse-fund-filings.py <CIK>")
        print("Example: python3 parse-fund-filings.py 0001350694")
        sys.exit(1)
    
    cik = sys.argv[1]
    
    print(f"🔍 Parsing filings for CIK: {cik}")
    print("")
    
    # Initialiser Supabase
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Récupérer le fund
    fund_result = supabase.table("funds").select("*").eq("cik", cik).single().execute()
    
    if not fund_result.data:
        print(f"❌ Fund avec CIK {cik} non trouvé!")
        sys.exit(1)
    
    fund = fund_result.data
    fund_id = fund["id"]
    fund_name = fund["name"]
    
    print(f"📋 Fund: {fund_name} (ID: {fund_id})")
    print("")
    
    # Récupérer tous les filings de ce fund
    filings_result = supabase.table("fund_filings")\
        .select("*")\
        .eq("fund_id", fund_id)\
        .order("filing_date", desc=True)\
        .execute()
    
    filings = filings_result.data
    print(f"📄 Trouvé {len(filings)} filings")
    print("")
    
    if len(filings) == 0:
        print("✅ Aucun filing à parser")
        return
    
    # Vérifier lesquels n'ont pas de holdings
    filings_to_parse = []
    for filing in filings:
        filing_id = filing["id"]
        holdings_result = supabase.table("fund_holdings")\
            .select("id")\
            .eq("filing_id", filing_id)\
            .limit(1)\
            .execute()
        
        if len(holdings_result.data) == 0:
            filings_to_parse.append(filing)
    
    print(f"📋 {len(filings_to_parse)} filings sans holdings à parser")
    print("")
    
    if len(filings_to_parse) == 0:
        print("✅ Tous les filings ont déjà des holdings!")
        return
    
    # Parser chaque filing
    success_count = 0
    error_count = 0
    
    for filing in filings_to_parse:
        filing_id = filing["id"]
        accession_number = filing["accession_number"]
        form_type = filing.get("form_type", "13F-HR")
        filing_date = filing.get("filing_date", "N/A")
        
        print(f"📄 Parsing: {accession_number} ({form_type}, {filing_date})")
        
        try:
            # Construire l'URL XML
            accession_no_dashes = accession_number.replace("-", "")
            cik_clean = cik.lstrip("0")
            base_url = f"https://www.sec.gov/Archives/edgar/data/{cik_clean}/{accession_no_dashes}"
            
            headers = {"User-Agent": "ADEL AI (contact@adel.ai)"}
            
            # Essayer d'abord infotable.xml (format standard)
            xml_url = f"{base_url}/infotable.xml"
            response = requests.get(xml_url, headers=headers, timeout=30)
            
            # Si 404, chercher le fichier XML dans le répertoire
            if response.status_code == 404:
                print(f"   infotable.xml not found, searching directory...")
                dir_response = requests.get(f"{base_url}/", headers=headers, timeout=30)
                if dir_response.status_code == 200:
                    soup_dir = BeautifulSoup(dir_response.text, "html.parser")
                    links = soup_dir.find_all("a", href=True)
                    xml_files = [l.get("href") for l in links if ".xml" in l.get("href", "").lower() and ("13f" in l.get("href", "").lower() or "table" in l.get("href", "").lower())]
                    if xml_files:
                        xml_file = xml_files[0].lstrip("/")
                        xml_url = f"https://www.sec.gov{xml_files[0]}" if xml_files[0].startswith("/") else f"{base_url}/{xml_file}"
                        print(f"   Found XML file: {xml_url}")
                        response = requests.get(xml_url, headers=headers, timeout=30)
                    else:
                        raise Exception(f"No 13F XML file found in directory {base_url}")
                else:
                    response.raise_for_status()
            else:
                response.raise_for_status()
            
            # Parser le XML
            holdings = parse_13f_file(response.text, xml_url)
            
            if len(holdings) == 0:
                print(f"   ⚠️  Aucun holding trouvé, skip")
                # Marquer comme PARSED quand même (peut être un filing vide)
                supabase.table("fund_filings").update({
                    "status": "PARSED",
                    "updated_at": "now()"
                }).eq("id", filing_id).execute()
                continue
            
            # Insérer les holdings
            print(f"   💾 Insertion de {len(holdings)} holdings...")
            for holding in holdings:
                supabase.table("fund_holdings").insert({
                    "fund_id": fund_id,
                    "filing_id": filing_id,
                    "cik": cik,
                    "ticker": holding["ticker"],
                    "cusip": holding["cusip"],
                    "shares": holding["shares"],
                    "market_value": holding["market_value"],
                    "type": holding["type"]
                }).execute()
            
            # Mettre à jour le statut
            supabase.table("fund_filings").update({
                "status": "PARSED",
                "updated_at": "now()"
            }).eq("id", filing_id).execute()
            
            print(f"   ✅ Parsing réussi! {len(holdings)} holdings insérés")
            success_count += 1
            
        except Exception as e:
            print(f"   ❌ Erreur: {str(e)}")
            # Marquer comme FAILED
            try:
                supabase.table("fund_filings").update({
                    "status": "FAILED",
                    "updated_at": "now()"
                }).eq("id", filing_id).execute()
            except:
                pass
            error_count += 1
            continue
    
    print("")
    print("═══════════════════════════════════════════════════════════")
    print(f"✅ TERMINÉ")
    print(f"   Succès: {success_count}")
    print(f"   Erreurs: {error_count}")
    print(f"   Total: {len(filings_to_parse)}")
    print("═══════════════════════════════════════════════════════════")
    
    # Vérifier le résultat
    holdings_result = supabase.table("fund_holdings")\
        .select("id", count="exact")\
        .eq("fund_id", fund_id)\
        .execute()
    
    print(f"")
    print(f"📊 Holdings totaux pour ce fund: {holdings_result.count}")

if __name__ == "__main__":
    main()

