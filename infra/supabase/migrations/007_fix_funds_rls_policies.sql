-- Migration: Ajouter les politiques RLS pour les tables funds et tables associées
-- Ces tables doivent être accessibles par le service_role (Lambda)

-- Activer RLS sur les tables si ce n'est pas déjà fait
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'funds') THEN
    ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fund_filings') THEN
    ALTER TABLE fund_filings ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fund_holdings') THEN
    ALTER TABLE fund_holdings ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fund_holdings_diff') THEN
    ALTER TABLE fund_holdings_diff ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fund_signals') THEN
    ALTER TABLE fund_signals ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'signals') THEN
    ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Politiques pour la table funds
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'funds') THEN
    DROP POLICY IF EXISTS "Service role can manage funds" ON funds;
    CREATE POLICY "Service role can manage funds" ON funds
        FOR ALL
        USING (true)
        WITH CHECK (true);
  END IF;
END $$;

-- Politiques pour la table fund_filings
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fund_filings') THEN
    DROP POLICY IF EXISTS "Service role can manage fund_filings" ON fund_filings;
    CREATE POLICY "Service role can manage fund_filings" ON fund_filings
        FOR ALL
        USING (true)
        WITH CHECK (true);
  END IF;
END $$;

-- Politiques pour la table fund_holdings
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fund_holdings') THEN
    DROP POLICY IF EXISTS "Service role can manage fund_holdings" ON fund_holdings;
    CREATE POLICY "Service role can manage fund_holdings" ON fund_holdings
        FOR ALL
        USING (true)
        WITH CHECK (true);
  END IF;
END $$;

-- Politiques pour la table fund_holdings_diff
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fund_holdings_diff') THEN
    DROP POLICY IF EXISTS "Service role can manage fund_holdings_diff" ON fund_holdings_diff;
    CREATE POLICY "Service role can manage fund_holdings_diff" ON fund_holdings_diff
        FOR ALL
        USING (true)
        WITH CHECK (true);
  END IF;
END $$;

-- Politiques pour la table fund_signals
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fund_signals') THEN
    DROP POLICY IF EXISTS "Service role can manage fund_signals" ON fund_signals;
    CREATE POLICY "Service role can manage fund_signals" ON fund_signals
        FOR ALL
        USING (true)
        WITH CHECK (true);
  END IF;
END $$;

-- Politiques pour la table signals (si elle n'en a pas déjà)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'signals') THEN
    DROP POLICY IF EXISTS "Service role can manage signals" ON signals;
    CREATE POLICY "Service role can manage signals" ON signals
        FOR ALL
        USING (true)
        WITH CHECK (true);
  END IF;
END $$;

