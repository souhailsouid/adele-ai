-- Migration: Corriger les permissions pour earnings_alerts
-- Cette migration est maintenant redondante car 004 inclut déjà les permissions
-- Gardée pour référence historique

-- Vérifier que la table existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'earnings_alerts') THEN
    RAISE EXCEPTION 'Table earnings_alerts does not exist. Please run migration 004 first.';
  END IF;
END $$;

-- Activer RLS (Row Level Security) si pas déjà activé
ALTER TABLE earnings_alerts ENABLE ROW LEVEL SECURITY;

-- Supprimer la politique si elle existe déjà
DROP POLICY IF EXISTS "Service role can manage earnings_alerts" ON earnings_alerts;

-- Créer une politique pour permettre l'accès service_role (pour les Lambdas)
CREATE POLICY "Service role can manage earnings_alerts" ON earnings_alerts
    FOR ALL
    USING (true)
    WITH CHECK (true);
