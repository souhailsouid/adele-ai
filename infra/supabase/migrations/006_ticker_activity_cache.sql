-- Migration: Tables de cache pour Ticker Activity Service
-- Ces tables servent de cache pour les données des APIs externes (Unusual Whales, FMP)

-- Supprimer les tables existantes si elles ont une structure incorrecte
-- (cela permet de repartir de zéro si nécessaire)
-- DROP TABLE IF EXISTS ticker_quotes CASCADE;
-- DROP TABLE IF EXISTS institutional_ownership CASCADE;
-- DROP TABLE IF EXISTS institutional_activity CASCADE;
-- DROP TABLE IF EXISTS insider_trades CASCADE;
-- DROP TABLE IF EXISTS congress_trades CASCADE;
-- DROP TABLE IF EXISTS options_flow CASCADE;
-- DROP TABLE IF EXISTS dark_pool_trades CASCADE;

-- Table: ticker_quotes
CREATE TABLE IF NOT EXISTS ticker_quotes (
  id SERIAL PRIMARY KEY,
  ticker TEXT NOT NULL,
  symbol TEXT NOT NULL,
  price DECIMAL(10, 2),
  change DECIMAL(10, 2),
  change_percent DECIMAL(5, 2),
  volume BIGINT,
  market_cap BIGINT,
  data JSONB,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Créer les index uniquement si la colonne existe
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ticker_quotes' AND column_name = 'ticker') THEN
    CREATE UNIQUE INDEX IF NOT EXISTS idx_ticker_quotes_ticker_unique ON ticker_quotes(ticker);
    CREATE INDEX IF NOT EXISTS idx_ticker_quotes_ticker ON ticker_quotes(ticker);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ticker_quotes' AND column_name = 'expires_at') THEN
    CREATE INDEX IF NOT EXISTS idx_ticker_quotes_expires ON ticker_quotes(expires_at);
  END IF;
END $$;

-- Table: institutional_ownership
CREATE TABLE IF NOT EXISTS institutional_ownership (
  id SERIAL PRIMARY KEY,
  ticker TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  shares BIGINT,
  units BIGINT,
  value DECIMAL(15, 2),
  is_hedge_fund BOOLEAN DEFAULT FALSE,
  report_date DATE,
  filing_date DATE,
  percentage DECIMAL(5, 2),
  data JSONB,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Créer les index uniquement si les colonnes existent
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'institutional_ownership' AND column_name = 'ticker') 
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'institutional_ownership' AND column_name = 'institution_name')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'institutional_ownership' AND column_name = 'report_date') THEN
    CREATE UNIQUE INDEX IF NOT EXISTS idx_institutional_ownership_unique ON institutional_ownership(ticker, institution_name, report_date);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'institutional_ownership' AND column_name = 'ticker') THEN
    CREATE INDEX IF NOT EXISTS idx_ownership_ticker ON institutional_ownership(ticker);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'institutional_ownership' AND column_name = 'expires_at') THEN
    CREATE INDEX IF NOT EXISTS idx_ownership_expires ON institutional_ownership(expires_at);
  END IF;
END $$;

-- Table: institutional_activity
CREATE TABLE IF NOT EXISTS institutional_activity (
  id SERIAL PRIMARY KEY,
  ticker TEXT NOT NULL,
  institution_name TEXT,
  units_change BIGINT,
  change BIGINT,
  avg_price DECIMAL(10, 2),
  buy_price DECIMAL(10, 2),
  sell_price DECIMAL(10, 2),
  filing_date DATE,
  report_date DATE,
  price_on_filing DECIMAL(10, 2),
  price_on_report DECIMAL(10, 2),
  close DECIMAL(10, 2),
  transaction_type TEXT,
  data JSONB,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Créer les index uniquement si les colonnes existent
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'institutional_activity' AND column_name = 'ticker') THEN
    CREATE INDEX IF NOT EXISTS idx_activity_ticker ON institutional_activity(ticker);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'institutional_activity' AND column_name = 'expires_at') THEN
    CREATE INDEX IF NOT EXISTS idx_activity_expires ON institutional_activity(expires_at);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'institutional_activity' AND column_name = 'institution_name') THEN
    CREATE INDEX IF NOT EXISTS idx_activity_institution ON institutional_activity(institution_name);
  END IF;
END $$;

-- Table: insider_trades
CREATE TABLE IF NOT EXISTS insider_trades (
  id SERIAL PRIMARY KEY,
  ticker TEXT NOT NULL,
  owner_name TEXT,
  officer_title TEXT,
  transaction_code TEXT,
  acquisition_or_disposition TEXT,
  amount DECIMAL(15, 2),
  transaction_date DATE,
  shares BIGINT,
  price DECIMAL(10, 2),
  data JSONB,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Créer les index uniquement si les colonnes existent
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'insider_trades' AND column_name = 'ticker') THEN
    CREATE INDEX IF NOT EXISTS idx_insiders_ticker ON insider_trades(ticker);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'insider_trades' AND column_name = 'expires_at') THEN
    CREATE INDEX IF NOT EXISTS idx_insiders_expires ON insider_trades(expires_at);
  END IF;
END $$;

-- Table: congress_trades
CREATE TABLE IF NOT EXISTS congress_trades (
  id SERIAL PRIMARY KEY,
  ticker TEXT NOT NULL,
  name TEXT,
  member_type TEXT,
  txn_type TEXT,
  amounts TEXT,
  transaction_date DATE,
  data JSONB,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Créer les index uniquement si les colonnes existent
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'congress_trades' AND column_name = 'ticker') THEN
    CREATE INDEX IF NOT EXISTS idx_congress_ticker ON congress_trades(ticker);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'congress_trades' AND column_name = 'expires_at') THEN
    CREATE INDEX IF NOT EXISTS idx_congress_expires ON congress_trades(expires_at);
  END IF;
END $$;

-- Table: options_flow
CREATE TABLE IF NOT EXISTS options_flow (
  id SERIAL PRIMARY KEY,
  ticker TEXT NOT NULL,
  type TEXT,
  strike DECIMAL(10, 2),
  total_premium DECIMAL(15, 2),
  premium DECIMAL(15, 2),
  volume INTEGER,
  expiry DATE,
  created_at TIMESTAMPTZ,
  open_interest INTEGER,
  data JSONB,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Créer les index uniquement si les colonnes existent
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'options_flow' AND column_name = 'ticker') THEN
    CREATE INDEX IF NOT EXISTS idx_options_ticker ON options_flow(ticker);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'options_flow' AND column_name = 'expires_at') THEN
    CREATE INDEX IF NOT EXISTS idx_options_expires ON options_flow(expires_at);
  END IF;
END $$;

-- Table: dark_pool_trades
CREATE TABLE IF NOT EXISTS dark_pool_trades (
  id SERIAL PRIMARY KEY,
  ticker TEXT NOT NULL,
  date DATE,
  volume BIGINT,
  size BIGINT,
  price DECIMAL(10, 2),
  value DECIMAL(15, 2),
  data JSONB,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Créer les index uniquement si les colonnes existent
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dark_pool_trades' AND column_name = 'ticker') THEN
    CREATE INDEX IF NOT EXISTS idx_darkpool_ticker ON dark_pool_trades(ticker);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dark_pool_trades' AND column_name = 'expires_at') THEN
    CREATE INDEX IF NOT EXISTS idx_darkpool_expires ON dark_pool_trades(expires_at);
  END IF;
END $$;

-- Activer RLS (Row Level Security) sur toutes les tables
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ticker_quotes') THEN
    ALTER TABLE ticker_quotes ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'institutional_ownership') THEN
    ALTER TABLE institutional_ownership ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'institutional_activity') THEN
    ALTER TABLE institutional_activity ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'insider_trades') THEN
    ALTER TABLE insider_trades ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'congress_trades') THEN
    ALTER TABLE congress_trades ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'options_flow') THEN
    ALTER TABLE options_flow ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dark_pool_trades') THEN
    ALTER TABLE dark_pool_trades ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Politiques pour permettre l'accès service_role (pour les Lambdas)
-- Ces tables sont en cache, donc pas besoin de restrictions utilisateur
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ticker_quotes') THEN
    DROP POLICY IF EXISTS "Service role can manage ticker_quotes" ON ticker_quotes;
    CREATE POLICY "Service role can manage ticker_quotes" ON ticker_quotes
        FOR ALL
        USING (true)
        WITH CHECK (true);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'institutional_ownership') THEN
    DROP POLICY IF EXISTS "Service role can manage institutional_ownership" ON institutional_ownership;
    CREATE POLICY "Service role can manage institutional_ownership" ON institutional_ownership
        FOR ALL
        USING (true)
        WITH CHECK (true);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'institutional_activity') THEN
    DROP POLICY IF EXISTS "Service role can manage institutional_activity" ON institutional_activity;
    CREATE POLICY "Service role can manage institutional_activity" ON institutional_activity
        FOR ALL
        USING (true)
        WITH CHECK (true);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'insider_trades') THEN
    DROP POLICY IF EXISTS "Service role can manage insider_trades" ON insider_trades;
    CREATE POLICY "Service role can manage insider_trades" ON insider_trades
        FOR ALL
        USING (true)
        WITH CHECK (true);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'congress_trades') THEN
    DROP POLICY IF EXISTS "Service role can manage congress_trades" ON congress_trades;
    CREATE POLICY "Service role can manage congress_trades" ON congress_trades
        FOR ALL
        USING (true)
        WITH CHECK (true);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'options_flow') THEN
    DROP POLICY IF EXISTS "Service role can manage options_flow" ON options_flow;
    CREATE POLICY "Service role can manage options_flow" ON options_flow
        FOR ALL
        USING (true)
        WITH CHECK (true);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dark_pool_trades') THEN
    DROP POLICY IF EXISTS "Service role can manage dark_pool_trades" ON dark_pool_trades;
    CREATE POLICY "Service role can manage dark_pool_trades" ON dark_pool_trades
        FOR ALL
        USING (true)
        WITH CHECK (true);
  END IF;
END $$;

-- Fonction pour nettoyer les données expirées (optionnel, peut être appelée par un cron job)
CREATE OR REPLACE FUNCTION cleanup_expired_ticker_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM ticker_quotes WHERE expires_at < NOW();
  DELETE FROM institutional_ownership WHERE expires_at < NOW();
  DELETE FROM institutional_activity WHERE expires_at < NOW();
  DELETE FROM insider_trades WHERE expires_at < NOW();
  DELETE FROM congress_trades WHERE expires_at < NOW();
  DELETE FROM options_flow WHERE expires_at < NOW();
  DELETE FROM dark_pool_trades WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

