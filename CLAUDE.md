# business-trendz.com — Instructions Claude

## Contexte du projet

Site de contenu business/finance en français, construit avec **Astro**, hébergé sur **Cloudflare Pages**.
Déploiement automatique à chaque push sur `main` — pas besoin de déclencher quoi que ce soit manuellement.

Repo GitHub : `lumira-projects/business-trendz`

---

## Git workflow

Toujours exécuter le pipeline complet en une seule opération, sans demander de validation intermédiaire :

```bash
git checkout main
git checkout -b articles/[slug]
# créer ou modifier le fichier
git add [fichier]
git commit -m "feat: ..."
git checkout staging && git merge articles/[slug] --no-ff -m "Merge articles/[slug] into staging"
git checkout main && git merge staging --no-ff -m "Merge staging into main ([slug])"
git push origin main
```

Exception : si l'utilisateur dit explicitement "je veux relire avant de merger".

---

## Images hero

Dès qu'une image est mentionnée (ex : "j'ai mis l'image X dans le dossier") :

1. Localiser le fichier dans `public/uploads/`
2. Convertir en `.webp` qualité 85 via sharp :
   ```bash
   node -e "require('sharp')('[input]').webp({quality:85}).toFile('[slug].webp').then(()=>console.log('OK'))"
   ```
3. Nommer le fichier d'après le slug de l'article (ex : `tva-hotel.webp`)
4. Supprimer l'original avec `rm`
5. Mettre à jour `heroImage` dans le frontmatter de l'article
6. Commiter les 3 changements ensemble et pusher

Ne jamais commiter un `.jpg` ou `.png` sans l'avoir converti.

---

## Règles éditoriales (non négociables)

- **Jamais de tiret cadratin "—"** : remplacer par des parenthèses ou des deux-points
- **Jamais de H1 dans le corps markdown** : le layout l'injecte depuis le frontmatter `title`
- **Pas de "la maison" pour désigner un client** : utiliser le nom de l'entreprise
- **Pas d'emojis** sauf demande explicite
- **Pas de commentaires dans le code** sauf si le "pourquoi" est non évident

### Année dans les titres et le corps : règle evergreen

Ne pas mettre l'année (ex: "2026") dans le titre, H1 ou corps sauf si le contenu est intrinsèquement daté :

| Mettre l'année | Ne pas mettre l'année |
|---|---|
| Salaires (évoluent chaque année) | Définitions et guides conceptuels |
| Taux fiscaux, seuils réglementaires | Articles sur des faits historiques |
| Comparatifs de produits/services | Guides pratiques stables |
| Classements annuels | "Comment faire X" |

Pour signaler la fraîcheur à Google sans dater le titre : mettre à jour `updatedDate` dans le frontmatter. Remplacer "en 2026" dans le corps par "aujourd'hui", "actuellement", "en France".

---

## Structure d'un article

Fichier : `src/content/articles/[slug].md`

### Frontmatter obligatoire

```yaml
---
title: "Titre SEO optimisé"
description: "~155 caractères, inclure le mot-clé principal"
pubDate: "2026-06-06T00:00:00.000Z"
updatedDate: "2026-06-06T00:00:00.000Z"
author: "François Aublin"         # ou "Partenariat éditorial" pour les articles sponsorisés
categories:
  - "Catégorie1"
  - "Catégorie2"
heroImage: "/uploads/YYYY/MM/[slug].webp"
heroImageAlt: "Description visuelle de l'image"
readingTime: 6                    # estimer ~1 min / 250 mots
---
```

### Catégories valides

Business, Entreprise, Entrepreneuriat, Finance, Fiscalité, Formation, High Tech, Immobilier, Investissement, Lifestyle, Marketing, Stratégie, Services

Toute catégorie hors de cette liste générera une page sans description — l'ajouter à `categoryMap` dans `src/pages/c/[category].astro` ET à `categorySlugMap` dans `src/layouts/ArticleLayout.astro`.

### Types d'articles et process

| Type | Caractéristiques | Process |
|---|---|---|
| Informationnel | Définition, guide, fiscalité, actualité | Rédaction directe, pas de scrape Maps |
| Local | Liste d'entreprises d'une ville | Lancer `scripts/scrape-local-maps.mjs "[requête]"` |
| Sponsorisé / Partenariat | Contenu fourni par un client | `author: "Partenariat éditorial"`, liens `rel="sponsored nofollow"`, ne pas parler comme si on était le client |

---

## Checklist pré-publication

Vérifier avant chaque commit :

```bash
# 1. Zéro tiret cadratin
grep -c "—" src/content/articles/[slug].md   # doit retourner 0

# 2. L'image hero est bien un .webp qui existe
ls public/uploads/[chemin].webp

# 3. Pas de fichier image original non converti
find public/uploads -name "*.jpg" -newer public/uploads/[slug].webp
```

---

## Infographies HTML inline

Style système à respecter dans tous les articles :

| Élément | Valeur |
|---|---|
| Gradient barre top | `linear-gradient(135deg,#1E3A8A 0%,#6366F1 35%,#EC4899 70%,#FF6B6B 100%)` |
| Radius figure | `16px`, blocs internes `12px` |
| Fond neutre | `#FAFAFA` + `border:1px solid rgba(10,10,10,0.06)` |
| Fond mis en avant | `linear-gradient(135deg,rgba(30,58,138,0.05),rgba(255,107,107,0.05))` + `border:1px solid rgba(30,58,138,0.15)` |
| Chiffre principal | `font-family:'Archivo Black',sans-serif` · 22px+ · `color:#0A0A0A` |
| Chiffre gradient | ajouter `background:linear-gradient(135deg,#1E3A8A,#FF6B6B);-webkit-background-clip:text;background-clip:text;color:transparent` |
| Labels | Inter 10-11px · `letter-spacing:0.14-0.16em` · `text-transform:uppercase` · `color:#9A9A9A` |

---

## Pages légales

Les pages `mentions-legales`, `politique-confidentialite`, `politique-de-cookies`, `nous-contacter` ont `noindex: true` automatiquement via `[slug].astro` et sont exclues du sitemap. Ne pas les modifier sans raison.

---

## Création d'articles en batch (5 articles simultanés)

Utiliser l'outil **Workflow** avec des agents parallèles :

```
Phase 1 (parallèle) : 5 agents rédigent chacun un article
Phase 2 (parallèle) : vérification qualité par article
Phase 3 (séquentielle) : commits, merges, push unique
```

Les images hero peuvent être ajoutées après coup article par article.

---

## Génération automatique d'images hero

### Script
```bash
node scripts/generate-hero.mjs [slug] "[prompt]"
```
Utilise **Hugging Face Inference API** (FLUX.1-schnell, gratuit).
Token requis dans `.env.local` : `HF_TOKEN=hf_xxx`
Créer un token gratuit sur https://huggingface.co/settings/tokens

Le script : télécharge l'image, convertit en .webp qualité 85, supprime le tmp, affiche le chemin heroImage.

### Direction artistique (DA)

Toujours : **personne en action, visage visible**, cadre startup épuré, lumière naturelle, profondeur de champ.
Diversifier à chaque article : genre, âge (25-30 / 35-45 / 50-60 ans), ethnicité.

**Template de prompt :**
```
Realistic editorial photograph of a [AGE]-year-old [GENDER] [ETHNICITY] professional,
face clearly visible, [ACTION liée au sujet],
modern minimalist startup office, natural window light, glass walls,
design furniture, subtle green plants, shallow depth of field,
warm neutral tones, no text visible, 16:9
```

**Actions selon thème :**
- Fiscalité/TVA → reviewing documents on a laptop, pen in hand
- Finance → analyzing charts on dual monitors
- RH/Recrutement → conducting a video call, smiling
- Marketing → sketching ideas on a whiteboard
- Tech/IA → typing on a keyboard, focused
- Management → leading a small team meeting
- Immobilier → examining architectural plans
