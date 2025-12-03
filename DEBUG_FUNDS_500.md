# 🔍 Diagnostic Erreur 500 sur `/funds`

## ✅ Actions Effectuées

1. ✅ **Amélioration du logging** dans `getFunds()` et `index.ts`
2. ✅ **Migration RLS créée** : `007_fix_funds_rls_policies.sql`
3. ✅ **Lambda redéployée** avec le nouveau code

## 🔍 Étapes de Diagnostic

### 1. Vérifier que la migration RLS a été appliquée

Dans Supabase SQL Editor, exécutez :

```sql
-- Vérifier si RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'funds';

-- Vérifier si une politique existe
SELECT * FROM pg_policies 
WHERE tablename = 'funds';
```

**Résultat attendu** :
- `rowsecurity` = `true` pour la table `funds`
- Au moins une politique avec `policyname` contenant "Service role"

### 2. Appliquer la migration si nécessaire

Si la migration n'a pas été appliquée, exécutez le contenu de :
`infra/supabase/migrations/007_fix_funds_rls_policies.sql`

### 3. Tester l'endpoint et vérifier les logs

1. **Tester l'endpoint** :
```bash
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/funds" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

2. **Vérifier les logs CloudWatch** :
```bash
aws logs tail /aws/lambda/adel-ai-dev-api --since 5m --format short
```

Ou via la console AWS :
- CloudWatch → Log groups → `/aws/lambda/adel-ai-dev-api`
- Chercher les logs avec `[getFunds]` ou `ERROR`

### 4. Vérifier les variables d'environnement

Dans Terraform, vérifiez que ces variables sont bien configurées :
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

```bash
cd infra/terraform
terraform output
```

### 5. Tester la connexion Supabase directement

Dans Supabase SQL Editor, testez :

```sql
-- Vérifier que la table existe et est accessible
SELECT COUNT(*) FROM funds;

-- Vérifier les permissions
SELECT * FROM funds LIMIT 1;
```

## 🔧 Erreurs Possibles et Solutions

### Erreur : "new row violates row-level security policy"

**Cause** : RLS est activé mais aucune politique n'autorise l'accès.

**Solution** : Appliquer la migration `007_fix_funds_rls_policies.sql`

### Erreur : "relation 'funds' does not exist"

**Cause** : La table n'existe pas.

**Solution** : Appliquer la migration `001_initial_schema.sql`

### Erreur : "Missing required environment variable: SUPABASE_URL"

**Cause** : Variable d'environnement manquante dans la Lambda.

**Solution** : Vérifier `terraform.tfvars` et réappliquer Terraform

### Erreur : "Invalid API key"

**Cause** : La clé Supabase est incorrecte.

**Solution** : Vérifier `SUPABASE_SERVICE_KEY` dans Supabase (Settings → API → service_role key)

## 📊 Logs à Surveiller

Après avoir testé l'endpoint, cherchez dans CloudWatch :

1. `[getFunds] Starting query to Supabase` - Confirme que la fonction est appelée
2. `[getFunds] Supabase client: initialized` - Confirme que Supabase est initialisé
3. `[getFunds] Supabase error:` - Affiche l'erreur exacte de Supabase
4. `ERROR in handler:` - Affiche l'erreur globale

## 🚀 Prochaines Étapes

1. **Appliquer la migration RLS** si ce n'est pas déjà fait
2. **Tester l'endpoint** avec un JWT valide
3. **Vérifier les logs CloudWatch** pour voir l'erreur exacte
4. **Partager les logs** si le problème persiste

## 📝 Notes

- Les logs sont maintenant beaucoup plus détaillés
- Chaque étape de `getFunds()` est loggée
- Les erreurs Supabase sont loggées avec leur code et message
- La stack trace complète est disponible dans les logs

