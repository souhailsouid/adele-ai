# Scripts Utilitaires

## Scripts de Maintenance

### reparse-failed-filings.sh

Re-déclencher le parsing des filings en statut `FAILED` pour un fund donné.

**Usage:**
```bash
./scripts/reparse-failed-filings.sh <fund_id>
```

### fix-holdings-cik.sh

Corriger les holdings existants qui ont un CIK `NULL` (pour les données créées avant l'ajout du champ CIK).

**Usage:**
```bash
./scripts/fix-holdings-cik.sh
```

## Scripts d'Analyse

### analyze-ark-positions.py

Analyse les positions d'ARK Investment Management.

### analyse-complete-nvda-pltr.py

Analyse complète des positions NVDA et PLTR.

### check-ark-status.py

Vérifier le statut des filings et holdings d'ARK.

## Note

Les scripts d'ajout de funds (`add-*-fund.py`) ont été supprimés car ils sont remplacés par l'API `POST /funds` qui gère automatiquement la découverte et le parsing.

