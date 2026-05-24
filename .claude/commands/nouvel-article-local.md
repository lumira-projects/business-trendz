Crée un article SEO local complet pour la requête : **$ARGUMENTS**

## Étape 1 — Scrape les résultats Google Maps

Lance le script Puppeteer :

```bash
node scripts/scrape-local-maps.mjs "$ARGUMENTS"
```

Interprète le JSON retourné. Pour chaque entrée, extrais depuis `rawLines` :
- **Note** : ligne contenant un chiffre décimal (ex: "4,5") ou un pattern "X étoiles"
- **Nombre d'avis** : ligne contenant "avis"
- **Adresse** : ligne contenant un numéro + nom de rue, ou un code postal
- **Horaires** : ligne contenant "Ouvert", "Fermé", "h", ou des plages horaires
- **Téléphone** : ligne avec 10 chiffres groupés
- **Catégorie** : courte ligne décrivant l'activité (ex: "Entreprise de peinture")

Si le script retourne moins de 5 résultats ou échoue, utilise tes connaissances générales pour compléter la liste jusqu'à 10 entreprises réelles et note-le en bas d'article.

## Étape 2 — Détermine les métadonnées de l'article

- **slug** : kebab-case de la requête (ex: `entreprise-de-peinture-paris`)
- **title** : "Les X meilleures [requête] en 2026 : notre sélection"
- **title_tag** : "[Requête capitalisé] 2026 : top X | Business Trendz" (max 60 chars)
- **description / meta_description** : ~155 chars, inclure la requête + valeur ajoutée
- **categories** : selon le secteur (Business, Services, Immobilier, Finance…)
- **heroImage** : `/uploads/2026/05/[slug].webp` (placeholder)
- **heroImageAlt** : description visuelle pertinente
- **readingTime** : estimer (environ 1 min / 250 mots)
- **pubDate / updatedDate** : date du jour en ISO 8601

## Étape 3 — Rédige l'article

**Ne jamais inclure de H1 dans le corps markdown.** Le layout l'injecte depuis le frontmatter `title`.

Structure obligatoire :

```
[Intro ~150 mots]
Accroche locale + pourquoi cette requête est utile + critères de sélection 
utilisés (régularité, avis clients, spécialités). Annonce la liste.

## 1. [Nom de l'entreprise] — ⭐ [note]/5 ([X] avis)

- **Adresse** : [adresse complète]
- **Téléphone** : [numéro] (si disponible)
- **Horaires** : [horaires ou "Non communiqués"]
- **Catégorie** : [type d'activité]

[Description 3-5 phrases : spécialités, points forts, type de clientèle, 
ce qui les distingue. Ton professionnel et factuel.]

## 2. [Nom] — ⭐ [note]/5 ...
[répéter pour les 10 entreprises]

## Comment choisir [type de prestataire] à [ville] ?

[Guide pratique en 5 critères numérotés. ~200 mots.]

## FAQ

### [Question 1 locale] ?
[Réponse ~80 mots]

### [Question 2] ?
[...]
[5 questions minimum]
```

Ajoute en bas de page (avant le JSON-LD) :
```
*Données collectées sur Google Maps en mai 2026. 
Horaires et informations susceptibles d'avoir évolué — 
vérifiez sur le site ou la fiche Google de chaque établissement.*
```

## Étape 4 — Schema.org JSON-LD

Inclure dans le fichier markdown (après la note de bas de page) :

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "[Titre de l'article]",
  "numberOfItems": [X],
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "LocalBusiness",
        "name": "[Nom]",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "[adresse]",
          "addressLocality": "[ville]",
          "addressCountry": "FR"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "[note]",
          "reviewCount": "[nb avis]"
        }
      }
    }
    ...
  ]
}
</script>
```

## Étape 5 — Workflow git (identique aux articles standards)

```bash
git checkout main
git checkout -b articles/[slug]
# Créer src/content/articles/[slug].md avec le contenu complet
git add src/content/articles/[slug].md
git commit -m "feat: publish article [slug]"
git checkout staging
git merge articles/[slug] --no-ff -m "Merge articles/[slug] into staging"
git checkout main
```

Annonce à l'utilisateur que l'article est sur staging et prêt à relire avant merge sur main.
