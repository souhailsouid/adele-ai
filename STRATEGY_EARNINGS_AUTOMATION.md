# 🎯 Stratégie d'Automatisation des Alertes Earnings

## Problème Actuel
- Parsing HTML/XBRL trop complexe
- Impossible d'automatiser les alertes
- Pas d'extraction des métriques clés

## Solution Pragmatique

### 1. DÉTECTION AUTOMATIQUE ✅ (Déjà en place)
- Le `collector-sec-company-filings` détecte déjà les nouveaux 8-K
- Déclenché automatiquement (cron quotidien ou à la demande)
- Publie un événement EventBridge pour chaque nouveau filing

### 2. EXTRACTION SIMPLIFIÉE (À améliorer)

#### Pour les 8-K Item 2.02 (Earnings):
**Option A: Parser XBRL simple**
- Chercher les tags XBRL standards dans le document
- Tags clés: `us-gaap:Revenues`, `us-gaap:NetIncomeLoss`, `us-gaap:EarningsPerShareBasic`
- Extraire les valeurs numériques directement

**Option B: Parser communiqué de presse**
- Beaucoup de 8-K Item 2.02 incluent un communiqué de presse (press release)
- Format plus lisible, souvent avec tableaux HTML structurés
- Chercher des patterns: "Revenue of $X billion", "EPS of $X", etc.

**Option C: API tierce (si disponible)**
- Utiliser une API qui fournit déjà les données structurées
- Ex: Alpha Vantage, Yahoo Finance, etc.

### 3. ANALYSE AUTOMATIQUE (À créer)

```python
def analyze_earnings(filing_data):
    """
    Analyser les résultats et générer des alertes
    """
    # 1. Extraire les métriques
    revenue = filing_data.get('revenue')
    eps = filing_data.get('eps')
    guidance = filing_data.get('guidance')
    
    # 2. Comparer avec attentes (consensus)
    # TODO: Intégrer une source de consensus (ex: Bloomberg, FactSet)
    expected_revenue = get_consensus(filing_data['ticker'], 'revenue')
    expected_eps = get_consensus(filing_data['ticker'], 'eps')
    
    # 3. Calculer les écarts
    revenue_beat = (revenue - expected_revenue) / expected_revenue * 100
    eps_beat = (eps - expected_eps) / expected_eps * 100
    
    # 4. Générer alerte si écart significatif
    if abs(revenue_beat) > 5 or abs(eps_beat) > 5:
        create_alert({
            'type': 'earnings_beat' if revenue_beat > 0 else 'earnings_miss',
            'ticker': filing_data['ticker'],
            'revenue_beat_pct': revenue_beat,
            'eps_beat_pct': eps_beat,
            'guidance': guidance
        })
```

## Implémentation Prioritaire

### Phase 1: Extraction XBRL Simple (1-2h)
- Parser les tags XBRL standards dans le document
- Extraire: Revenues, Net Income, EPS
- Stocker dans `company_events.raw_data`

### Phase 2: Parser Press Release (2-3h)
- Détecter si le 8-K contient un communiqué de presse
- Parser les tableaux HTML structurés
- Extraire les métriques avec regex simples

### Phase 3: Analyse & Alertes (2-3h)
- Créer une table `earnings_analysis`
- Comparer avec consensus (source externe ou historique)
- Générer des alertes automatiques

## Exemple pour NVIDIA

**Filing récent**: 8-K Item 2.02 (Results of Operations)
**Données à extraire**:
- Revenue: $XX.XX billion
- Net Income: $XX.XX billion  
- EPS: $X.XX
- Guidance: $XX-XX billion for next quarter

**Analyse**:
- Comparer avec consensus (ex: Revenue attendu $XX billion)
- Si beat > 5% → Alerte "Strong Beat"
- Si miss > 5% → Alerte "Miss"



