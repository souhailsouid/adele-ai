-- Migration: Ajouter la table pour les alertes earnings
-- Phase 3: Analyse automatique des earnings

-- Table earnings_alerts (alertes automatiques pour les résultats)
CREATE TABLE IF NOT EXISTS earnings_alerts (
  id BIGSERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  filing_id INTEGER NOT NULL REFERENCES company_filings(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL, -- 'earnings_release', 'earnings_beat', 'earnings_miss', etc.
  alert_data JSONB NOT NULL DEFAULT '{}', -- Métriques extraites, comparaisons, etc.
  importance_score INTEGER DEFAULT 5 CHECK (importance_score BETWEEN 1 AND 10),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer les index (avec IF NOT EXISTS via DO block)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_earnings_alerts_company_id') THEN
    CREATE INDEX idx_earnings_alerts_company_id ON earnings_alerts(company_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_earnings_alerts_filing_id') THEN
    CREATE INDEX idx_earnings_alerts_filing_id ON earnings_alerts(filing_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_earnings_alerts_status') THEN
    CREATE INDEX idx_earnings_alerts_status ON earnings_alerts(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_earnings_alerts_created_at') THEN
    CREATE INDEX idx_earnings_alerts_created_at ON earnings_alerts(created_at DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_earnings_alerts_importance') THEN
    CREATE INDEX idx_earnings_alerts_importance ON earnings_alerts(importance_score DESC);
  END IF;
END $$;

-- Commentaire pour documentation
COMMENT ON TABLE earnings_alerts IS 'Alertes automatiques générées lors de la publication des résultats (earnings)';

-- Activer RLS (Row Level Security)
ALTER TABLE earnings_alerts ENABLE ROW LEVEL SECURITY;

-- Supprimer la politique si elle existe déjà
DROP POLICY IF EXISTS "Service role can manage earnings_alerts" ON earnings_alerts;

-- Politique pour permettre l'accès service_role (pour les Lambdas)
CREATE POLICY "Service role can manage earnings_alerts" ON earnings_alerts
    FOR ALL
    USING (true)
    WITH CHECK (true);
