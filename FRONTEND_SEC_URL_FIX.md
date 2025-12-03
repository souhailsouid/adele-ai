# Correction URL SEC pour les filings 13F

## ❌ Problème identifié

L'URL utilisée ne fonctionne pas pour les 13F :
```
https://www.sec.gov/cgi-bin/viewer?action=view&cik=1697748&accession_number=0001104659-25-072098&xbrl_type=v
```

**Erreur SEC**: "No rendered XBRL documents were found"

**Raisons**:
1. Les 13F ne sont **pas en XBRL**, donc `xbrl_type=v` ne fonctionne pas
2. Le CIK doit être **sans zéros à gauche** pour l'URL (correct: `1697748`)
3. L'accession_number doit être **sans tirets** pour construire le chemin

---

## ✅ Solutions

### Option 1: URL directe vers la page d'index du filing (RECOMMANDÉ)

**Format**:
```
https://www.sec.gov/Archives/edgar/data/{CIK_SANS_ZEROS}/{ACCESSION_SANS_TIRETS}/
```

**Exemple**:
```typescript
function getSECFilingUrl(cik: string, accessionNumber: string): string {
  // Nettoyer le CIK (enlever les zéros à gauche)
  const cleanCik = cik.replace(/^0+/, '');
  
  // Nettoyer l'accession_number (enlever les tirets)
  const cleanAccession = accessionNumber.replace(/-/g, '');
  
  // Construire l'URL
  return `https://www.sec.gov/Archives/edgar/data/${cleanCik}/${cleanAccession}/`;
}

// Utilisation
const url = getSECFilingUrl('0001697748', '0001104659-25-072098');
// Résultat: https://www.sec.gov/Archives/edgar/data/1697748/000110465925072098/
```

### Option 2: URL directe vers le document XML (si connu)

**Format**:
```
https://www.sec.gov/Archives/edgar/data/{CIK_SANS_ZEROS}/{ACCESSION_SANS_TIRETS}/{FILENAME}
```

**Filenames communs pour 13F**:
- `infotable.xml` (le plus courant)
- `form13fInfoTable.xml`
- `primary_doc.xml`

**Exemple**:
```typescript
function getSECFilingDocumentUrl(
  cik: string, 
  accessionNumber: string, 
  filename: string = 'infotable.xml'
): string {
  const cleanCik = cik.replace(/^0+/, '');
  const cleanAccession = accessionNumber.replace(/-/g, '');
  
  return `https://www.sec.gov/Archives/edgar/data/${cleanCik}/${cleanAccession}/${filename}`;
}
```

### Option 3: URL vers la page de recherche SEC (fallback)

**Format**:
```
https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={CIK_SANS_ZEROS}&type=13F-HR&dateb=&owner=exclude&count=40
```

Cette URL liste tous les filings 13F du fund, pas un filing spécifique.

---

## 💻 Code TypeScript complet

```typescript
// types.ts
export interface Filing {
  id: number;
  fund_id: number;
  cik: string;
  accession_number: string;
  form_type: string;
  filing_date: string;
  status: string;
}

// utils/sec-urls.ts
export class SECUrlBuilder {
  /**
   * Construire l'URL vers la page d'index du filing 13F
   * C'est la page qui liste tous les documents du filing
   */
  static getFilingIndexUrl(cik: string, accessionNumber: string): string {
    const cleanCik = cik.replace(/^0+/, '');
    const cleanAccession = accessionNumber.replace(/-/g, '');
    return `https://www.sec.gov/Archives/edgar/data/${cleanCik}/${cleanAccession}/`;
  }

  /**
   * Construire l'URL directe vers le document XML principal
   * Tente plusieurs noms de fichiers communs
   */
  static getFilingDocumentUrl(
    cik: string, 
    accessionNumber: string, 
    filename?: string
  ): string {
    const baseUrl = this.getFilingIndexUrl(cik, accessionNumber);
    return filename 
      ? `${baseUrl}${filename}`
      : `${baseUrl}infotable.xml`; // Par défaut
  }

  /**
   * Construire l'URL vers la page de recherche SEC pour ce fund
   */
  static getFundSearchUrl(cik: string): string {
    const cleanCik = cik.replace(/^0+/, '');
    return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cleanCik}&type=13F-HR&dateb=&owner=exclude&count=40`;
  }
}

// components/FilingSECLink.tsx
import { Filing } from '../types';
import { SECUrlBuilder } from '../utils/sec-urls';

interface FilingSECLinkProps {
  filing: Filing;
  variant?: 'index' | 'document' | 'search';
  filename?: string;
}

export function FilingSECLink({ 
  filing, 
  variant = 'index',
  filename 
}: FilingSECLinkProps) {
  let url: string;
  let label: string;

  switch (variant) {
    case 'index':
      url = SECUrlBuilder.getFilingIndexUrl(filing.cik, filing.accession_number);
      label = '📄 Voir sur SEC.gov';
      break;
    case 'document':
      url = SECUrlBuilder.getFilingDocumentUrl(filing.cik, filing.accession_number, filename);
      label = '📄 Voir le document XML';
      break;
    case 'search':
      url = SECUrlBuilder.getFundSearchUrl(filing.cik);
      label = '🔍 Tous les filings 13F';
      break;
  }

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline inline-flex items-center gap-2"
    >
      {label}
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
        />
      </svg>
    </a>
  );
}

// Exemple d'utilisation dans un tableau
export function FundFilingsTable({ filings }: { filings: Filing[] }) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Date</th>
          <th>Accession Number</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filings.map(filing => (
          <tr key={filing.id}>
            <td>{new Date(filing.filing_date).toLocaleDateString()}</td>
            <td className="font-mono text-sm">{filing.accession_number}</td>
            <td>
              <span className={`px-2 py-1 rounded text-xs ${
                filing.status === 'PARSED' ? 'bg-green-100 text-green-800' :
                filing.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {filing.status}
              </span>
            </td>
            <td>
              <div className="flex gap-2">
                <FilingSECLink filing={filing} variant="index" />
                {filing.status === 'PARSED' && (
                  <FilingSECLink filing={filing} variant="document" />
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 🔍 Test des URLs

### Exemple avec vos données

**Données**:
- CIK: `0001697748`
- Accession Number: `0001104659-25-072098`

**URLs générées**:

1. **Page d'index** (RECOMMANDÉ):
   ```
   https://www.sec.gov/Archives/edgar/data/1697748/000110465925072098/
   ```

2. **Document XML**:
   ```
   https://www.sec.gov/Archives/edgar/data/1697748/000110465925072098/infotable.xml
   ```

3. **Page de recherche**:
   ```
   https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=1697748&type=13F-HR&dateb=&owner=exclude&count=40
   ```

---

## 📋 Règles importantes

1. **CIK**: Toujours enlever les zéros à gauche pour l'URL
   - `0001697748` → `1697748`

2. **Accession Number**: Toujours enlever les tirets
   - `0001104659-25-072098` → `000110465925072098`

3. **13F ≠ XBRL**: Les 13F ne sont pas en XBRL, donc ne pas utiliser `xbrl_type=v`

4. **Format du chemin**: 
   ```
   /Archives/edgar/data/{CIK}/{ACCESSION}/
   ```

---

## ✅ Solution recommandée

**Utiliser l'Option 1** (page d'index) car:
- ✅ Fonctionne toujours
- ✅ Affiche tous les documents du filing
- ✅ Permet de naviguer vers le document XML si besoin
- ✅ Plus robuste que l'URL directe vers un fichier spécifique

**Code à utiliser**:
```typescript
const url = `https://www.sec.gov/Archives/edgar/data/${cik.replace(/^0+/, '')}/${accessionNumber.replace(/-/g, '')}/`;
```



