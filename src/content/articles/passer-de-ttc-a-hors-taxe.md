---
title: "Passer de TTC à HT : Le Guide Complet avec Formule et Exemples"
title_tag: "Calculateur TTC HT gratuit + formule 2026 | Business Trendz"
description: "Simulateur gratuit pour passer du TTC au HT en ligne + formule HT = TTC ÷ (1 + taux), tableau des taux TVA, 5 exemples concrets et cas auto-entrepreneur."
slug: passer-de-ttc-a-hors-taxe
pubDate: 2026-05-24T00:00:00.000Z
updatedDate: 2026-05-24T00:00:00.000Z
heroImage: /uploads/2026/05/passer-de-ttc-a-hors-taxe.webp
heroImageAlt: "Calculatrice posée sur une facture avec la formule TTC divisé par 1,20 pour obtenir le prix hors taxe"
categories:
  - Business
  - Finance
readingTime: 9
author: "François Aublin"
---

Vous venez de recevoir une facture à 240 € TTC et vous devez isoler le montant hors taxe pour votre comptabilité. Ou peut-être êtes-vous auto-entrepreneur et vous souhaitez comprendre comment fonctionne la TVA sur vos achats professionnels. Convertir un prix TTC en prix HT est une opération du quotidien pour tout professionnel. Pourtant, l'erreur de calcul la plus courante est étonnamment répandue, même chez des personnes expérimentées.

Ce guide vous donne la formule exacte, étape par étape, avec des exemples chiffrés et un tableau de conversion pour les principaux taux de TVA en France. Que vous soyez entrepreneur, comptable, auto-entrepreneur ou simplement curieux, ce calcul ne vous posera plus jamais de problème.

<div style="background:#0A0A0A;border-radius:20px;padding:2.5rem 2rem;margin:2rem 0;border:1px solid rgba(255,255,255,0.08);">
<div style="display:flex;align-items:center;gap:1rem;margin-bottom:2rem;">
<div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#1E3A8A 0%,#6366F1 35%,#EC4899 70%,#FF6B6B 100%);flex-shrink:0;"></div>
<div>
<p style="font-family:'Archivo Black',sans-serif;font-size:20px;color:#fff;margin:0;line-height:1.2;">Simulateur TTC vers HT gratuit</p>
<p style="font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,0.45);margin:0;">Résultat instantané · aucune inscription requise</p>
</div>
</div>
<p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin:0 0 0.75rem;">Votre taux de TVA</p>
<div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:2rem;" id="taux-btns">
<button onclick="setTaux(0.021,this)" style="padding:0.5rem 1.25rem;border-radius:999px;border:1.5px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.65);font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;">2,1 %</button>
<button onclick="setTaux(0.055,this)" style="padding:0.5rem 1.25rem;border-radius:999px;border:1.5px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.65);font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;">5,5 %</button>
<button onclick="setTaux(0.10,this)" style="padding:0.5rem 1.25rem;border-radius:999px;border:1.5px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.65);font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;">10 %</button>
<button onclick="setTaux(0.20,this)" style="padding:0.5rem 1.25rem;border-radius:999px;border:none;background:linear-gradient(135deg,#1E3A8A 0%,#6366F1 35%,#EC4899 70%,#FF6B6B 100%);color:#fff;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;">20 %</button>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;align-items:stretch;">
<div>
<label for="calc-ttc" style="display:block;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:0.6rem;">Montant TTC (€)</label>
<input type="number" id="calc-ttc" placeholder="Ex : 240" min="0" step="0.01" oninput="calcTTCtoHT()" style="width:100%;padding:1rem 1.1rem;border:1.5px solid rgba(255,255,255,0.1);border-radius:12px;font-size:22px;font-family:'Inter',sans-serif;font-weight:500;color:#fff;background:#1A1A1A;box-sizing:border-box;outline:none;" />
</div>
<div style="background:linear-gradient(135deg,#1E3A8A 0%,#6366F1 35%,#EC4899 70%,#FF6B6B 100%);border-radius:14px;padding:1.25rem 1.5rem;display:flex;flex-direction:column;justify-content:center;">
<div style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.65);margin-bottom:0.4rem;">Montant HT</div>
<div id="calc-ht-val" style="font-family:'Archivo Black',sans-serif;font-size:36px;color:#fff;line-height:1;">...</div>
<div id="calc-tva-val" style="font-size:13px;color:rgba(255,255,255,0.75);margin-top:0.5rem;">dont TVA : ...</div>
</div>
</div>
<p id="calc-formula-display" style="display:none;margin:1.25rem 0 0;font-size:12px;color:rgba(255,255,255,0.3);font-family:'Inter',sans-serif;font-style:italic;letter-spacing:0.02em;"></p>
<p style="font-size:11px;color:rgba(255,255,255,0.2);margin:1rem 0 0;font-family:'Inter',sans-serif;">Outil indicatif. Vérifiez avec votre expert-comptable pour les situations complexes.</p>
</div>

<script>
var calcTaux = 0.20;
function setTaux(t, btn) {
  calcTaux = t;
  var btns = document.getElementById('taux-btns').querySelectorAll('button');
  btns.forEach(function(b) {
    b.style.background = 'rgba(255,255,255,0.06)';
    b.style.color = 'rgba(255,255,255,0.65)';
    b.style.border = '1.5px solid rgba(255,255,255,0.12)';
  });
  btn.style.background = 'linear-gradient(135deg,#1E3A8A 0%,#6366F1 35%,#EC4899 70%,#FF6B6B 100%)';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  calcTTCtoHT();
}
function calcTTCtoHT() {
  var ttc = parseFloat(document.getElementById('calc-ttc').value);
  var htEl = document.getElementById('calc-ht-val');
  var tvaEl = document.getElementById('calc-tva-val');
  var formulaEl = document.getElementById('calc-formula-display');
  if (!ttc || isNaN(ttc) || ttc <= 0) {
    htEl.textContent = '...';
    tvaEl.textContent = 'dont TVA : ...';
    formulaEl.style.display = 'none';
    return;
  }
  var ht = ttc / (1 + calcTaux);
  var tva = ttc - ht;
  htEl.textContent = ht.toFixed(2).replace('.', ',') + ' €';
  tvaEl.textContent = 'dont TVA : ' + tva.toFixed(2).replace('.', ',') + ' €';
  var pct = calcTaux * 100;
  var pctStr = (pct % 1 === 0) ? pct.toFixed(0) : pct.toString().replace('.', ',');
  var coeffStr = (1 + calcTaux).toString().replace('.', ',');
  formulaEl.textContent = ttc.toFixed(2).replace('.', ',') + ' € ÷ ' + coeffStr + ' (TVA ' + pctStr + ' %) = ' + ht.toFixed(2).replace('.', ',') + ' € HT';
  formulaEl.style.display = 'block';
}
</script>

## La Formule Essentielle pour Passer du TTC au HT Expliquée Simplement

La formule mathématique pour convertir un montant TTC en montant HT est la suivante :

> **HT = TTC ÷ (1 + t)**

Chaque terme de cette formule a un sens précis :

- **HT** est le **montant hors taxe**. C'est le prix avant application de la TVA. C'est la valeur que vous cherchez à obtenir.
- **TTC** est le **montant toutes taxes comprises**. C'est le prix payé, TVA incluse. C'est votre point de départ.
- **t** est le **taux de TVA** exprimé en valeur décimale. Un taux de 20 % s'écrit 0,20. Un taux de 10 % s'écrit 0,10. Un taux de 5,5 % s'écrit 0,055.

En langage courant : **pour trouver le prix hors taxe, divisez le prix TTC par 1 plus le taux de TVA.**

Pour un taux de TVA à 20 %, le **coefficient de conversion** est **1,20**. C'est le diviseur à appliquer systématiquement sur vos factures et déclarations comptables.

### Définition : Qu'est-ce que la TVA (Taxe sur la Valeur Ajoutée) ?

La **TVA (Taxe sur la Valeur Ajoutée)** est un impôt indirect sur la consommation. Elle est collectée par les entreprises pour le compte de l'État. La TVA est toujours calculée sur le montant **HT**, qui constitue l'**assiette fiscale**. La relation entre les trois montants est simple : **TTC = HT + montant de TVA**. Le prix TTC est donc toujours supérieur au prix HT.

### Comment isoler et trouver le montant exact de la TVA ?

Une fois le montant HT connu, isoler la TVA est immédiat. La méthode se déroule en deux étapes :

1. **Calculer le montant HT** : appliquez la formule principale : HT = TTC ÷ (1 + t).
2. **Calculer la TVA** par soustraction : **Montant TVA = TTC − HT**.

**Exemple chiffré :** pour un achat de 120 € TTC à 20 % de TVA :
- HT = 120 ÷ 1,20 = **100 €**
- TVA = 120 − 100 = **20 €**

Vous pouvez aussi obtenir la TVA directement avec la formule : **TVA = TTC × (t ÷ (1 + t))**. Pour un taux de 20 % : TVA = 120 × (0,20 ÷ 1,20) = 120 × 0,1667 = **20 €**.

## L'Erreur Courante : Pourquoi Soustraire 20 % ne Permet pas de Passer du TTC au HT

C'est l'erreur la plus fréquente, et elle est intuitive, ce qui la rend d'autant plus dangereuse. De nombreux professionnels, y compris des comptables débutants, pensent qu'enlever 20 % au prix TTC donne le prix HT. Cette logique est fausse.

La TVA est calculée **sur le montant HT**, pas sur le montant TTC. Ces deux bases sont différentes. Lorsque vous avez un prix de 120 € TTC à 20 % de TVA, cela signifie que le vendeur a pris un prix HT de 100 €, puis a ajouté 20 % de TVA calculés sur ces 100 € (soit 20 €), pour obtenir 120 € TTC.

Si vous soustrayez 20 % au prix TTC, vous obtenez : 120 × 0,80 = **96 €**, ce qui est faux. Le prix HT réel est 100 €. L'erreur est de 4 €, soit 4 % de sous-évaluation du montant HT.

<figure style="margin:2rem 0;background:#FAFAFA;border-radius:16px;padding:2rem;font-family:'Inter',sans-serif;">
<p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6B6B6B;margin:0 0 1.5rem 0;">EXEMPLE · 120 € TTC AVEC TVA À 20 %</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
<div style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(10,10,10,0.08);">
<div style="background:#0A0A0A;padding:0.75rem 1.25rem;">
<span style="color:#fff;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;">Calcul incorrect</span>
</div>
<div style="padding:1.5rem 1.25rem;">
<div style="font-family:'Archivo Black',sans-serif;font-size:20px;color:#0A0A0A;line-height:1.3;">120 € − 20 %</div>
<div style="font-size:14px;color:#6B6B6B;margin:0.5rem 0;">= 120 × 0,80</div>
<div style="font-family:'Archivo Black',sans-serif;font-size:28px;color:#0A0A0A;">= 96 € HT</div>
<div style="font-size:12px;color:#9A9A9A;margin-top:0.75rem;line-height:1.5;">Résultat faux. Erreur de −4 € sur le montant HT réel.</div>
</div>
</div>
<div style="background:#fff;border-radius:12px;overflow:hidden;">
<div style="height:3px;background:linear-gradient(135deg,#1E3A8A 0%,#6366F1 35%,#EC4899 70%,#FF6B6B 100%);"></div>
<div style="padding:1.5rem 1.25rem;">
<div style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#6B6B6B;margin-bottom:0.75rem;">Calcul correct</div>
<div style="font-family:'Archivo Black',sans-serif;font-size:20px;color:#0A0A0A;line-height:1.3;">120 € ÷ 1,20</div>
<div style="font-size:14px;color:#6B6B6B;margin:0.5rem 0;">= 120 ÷ (1 + 0,20)</div>
<div style="font-family:'Archivo Black',sans-serif;font-size:28px;color:#0A0A0A;">= 100 € HT</div>
<div style="font-size:12px;color:#9A9A9A;margin-top:0.75rem;line-height:1.5;">Résultat exact. TVA = 120 − 100 = 20 €.</div>
</div>
</div>
</div>
<figcaption style="margin-top:1.25rem;font-size:12px;color:#9A9A9A;border-top:1px solid rgba(10,10,10,0.08);padding-top:0.75rem;">La TVA est calculée sur le montant HT et non sur le montant TTC. D'où l'écart de 4 € entre les deux méthodes.</figcaption>
</figure>

Sur une petite transaction, l'écart de 4 € peut sembler négligeable. Mais sur un chiffre d'affaires annuel de 100 000 € TTC, l'erreur représente **4 000 €**, un montant susceptible de déclencher un contrôle fiscal ou de fausser une déclaration de TVA (CA3 ou CA12).

### L'impact d'une erreur de calcul sur une facture et les risques fiscaux

Un mauvais calcul de TVA sur une facture n'est pas sans conséquences. Voici les risques concrets :

- **Invalidité de la facture** : une facture avec un montant HT erroné peut être contestée ou rejetée par le client lors de la facturation.
- **Rejet de la déduction de TVA** : le client d'une entreprise ne peut déduire la TVA que si elle est correctement calculée. Une erreur lui ferme ce droit de déduction.
- **Redressement fiscal** : lors d'un contrôle, la DGFIP recalcule les montants. Si la TVA collectée est sous-évaluée, l'entreprise doit la reverser avec des intérêts de retard.
- **Pénalités financières** : selon la nature de l'erreur (négligence ou présomption de fraude), les pénalités varient de 10 % à 80 % des droits éludés.
- **Crédibilité professionnelle** : des erreurs répétées sur les factures nuisent à l'image de sérieux de l'entreprise auprès de ses clients et partenaires.

La rigueur dans le calcul de la TVA est une obligation légale : elle protège à la fois l'entreprise émettrice et son client.

## Tableau de Conversion avec les Principaux Taux de TVA en France

La France applique quatre taux de TVA distincts selon la nature des produits et services. Chaque taux correspond à un coefficient de conversion spécifique à utiliser pour passer du TTC au HT.

<figure style="margin:2rem 0;background:#FAFAFA;border-radius:16px;padding:2rem;font-family:'Inter',sans-serif;">
<p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6B6B6B;margin:0 0 1.5rem 0;">TAUX DE TVA EN FRANCE · COEFFICIENTS DE CONVERSION TTC → HT</p>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;">
<div style="background:#fff;border-radius:12px;overflow:hidden;">
<div style="height:3px;background:linear-gradient(135deg,#1E3A8A 0%,#6366F1 100%);"></div>
<div style="padding:1.25rem;">
<div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#9A9A9A;margin-bottom:0.5rem;">Taux normal</div>
<div style="font-family:'Archivo Black',sans-serif;font-size:32px;color:#0A0A0A;line-height:1;">20 %</div>
<div style="font-size:13px;color:#6B6B6B;margin-top:0.5rem;">Diviser par <strong>1,20</strong></div>
<div style="font-size:11px;color:#9A9A9A;margin-top:0.75rem;border-top:1px solid rgba(10,10,10,0.08);padding-top:0.5rem;">Électronique, vêtements, services aux entreprises</div>
</div>
</div>
<div style="background:#fff;border-radius:12px;overflow:hidden;">
<div style="height:3px;background:linear-gradient(135deg,#1E3A8A 0%,#6366F1 50%,#EC4899 100%);"></div>
<div style="padding:1.25rem;">
<div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#9A9A9A;margin-bottom:0.5rem;">Taux intermédiaire</div>
<div style="font-family:'Archivo Black',sans-serif;font-size:32px;color:#0A0A0A;line-height:1;">10 %</div>
<div style="font-size:13px;color:#6B6B6B;margin-top:0.5rem;">Diviser par <strong>1,10</strong></div>
<div style="font-size:11px;color:#9A9A9A;margin-top:0.75rem;border-top:1px solid rgba(10,10,10,0.08);padding-top:0.5rem;">Restauration, transport, travaux de rénovation</div>
</div>
</div>
<div style="background:#fff;border-radius:12px;overflow:hidden;">
<div style="height:3px;background:linear-gradient(135deg,#6366F1 0%,#EC4899 50%,#FF6B6B 100%);"></div>
<div style="padding:1.25rem;">
<div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#9A9A9A;margin-bottom:0.5rem;">Taux réduit</div>
<div style="font-family:'Archivo Black',sans-serif;font-size:32px;color:#0A0A0A;line-height:1;">5,5 %</div>
<div style="font-size:13px;color:#6B6B6B;margin-top:0.5rem;">Diviser par <strong>1,055</strong></div>
<div style="font-size:11px;color:#9A9A9A;margin-top:0.75rem;border-top:1px solid rgba(10,10,10,0.08);padding-top:0.5rem;">Alimentation, livres, abonnements énergie</div>
</div>
</div>
<div style="background:#fff;border-radius:12px;overflow:hidden;">
<div style="height:3px;background:linear-gradient(135deg,#EC4899 0%,#FF6B6B 100%);"></div>
<div style="padding:1.25rem;">
<div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#9A9A9A;margin-bottom:0.5rem;">Taux super-réduit</div>
<div style="font-family:'Archivo Black',sans-serif;font-size:32px;color:#0A0A0A;line-height:1;">2,1 %</div>
<div style="font-size:13px;color:#6B6B6B;margin-top:0.5rem;">Diviser par <strong>1,021</strong></div>
<div style="font-size:11px;color:#9A9A9A;margin-top:0.75rem;border-top:1px solid rgba(10,10,10,0.08);padding-top:0.5rem;">Médicaments remboursés, presse papier</div>
</div>
</div>
</div>
<figcaption style="margin-top:1.25rem;font-size:12px;color:#9A9A9A;border-top:1px solid rgba(10,10,10,0.08);padding-top:0.75rem;">Source : Direction générale des Finances publiques (DGFIP) · Taux en vigueur en France métropolitaine en 2026.</figcaption>
</figure>

Le tableau ci-dessous détaille la décomposition exacte d'un prix de **100 € TTC** selon chaque taux, pour une lecture rapide du montant HT et de la TVA correspondante.

| Taux de TVA | Type | Coefficient (÷) | Montant HT | Montant TVA |
|---|---|---|---|---|
| 20 % | Taux normal | 1,20 | 83,33 € | 16,67 € |
| 10 % | Taux intermédiaire | 1,10 | 90,91 € | 9,09 € |
| 5,5 % | Taux réduit | 1,055 | 94,79 € | 5,21 € |
| 2,1 % | Taux super-réduit | 1,021 | 97,94 € | 2,06 € |

*Pour un prix TTC de 100 €. Valeurs arrondies à deux décimales. Source : DGFIP 2026.*

## 5 Exemples Concrets pour Maîtriser le Calcul TTC vers HT

La meilleure façon d'assimiler une formule est de l'appliquer sur des cas réels. Voici cinq exemples détaillés, étape par étape, couvrant les quatre taux de TVA applicables en France.

### Exemple 1 : Un produit électronique à 240 € TTC (TVA 20 %)

<div style="background:#F4F4F4;border-radius:12px;padding:1.5rem 1.75rem;margin:1rem 0;">

**Données :** prix TTC = 240 €, taux de TVA = 20 %.

**Calcul du montant HT :**
- HT = 240 ÷ (1 + 0,20) = 240 ÷ 1,20 = **200 €**

**Calcul du montant de TVA :**
- TVA = 240 − 200 = **40 €**

**Vérification :** 200 × 1,20 = 240 € TTC ✓

</div>

Le prix hors taxe est de **200 €** et la TVA s'élève à **40 €**. Le coefficient 1,20 est le plus utilisé dans la facturation courante des entreprises françaises.

### Exemple 2 : Une prestation de conseil à 550 € TTC (TVA 20 %)

<div style="background:#F4F4F4;border-radius:12px;padding:1.5rem 1.75rem;margin:1rem 0;">

**Données :** prix TTC = 550 €, taux de TVA = 20 %.

**Calcul du montant HT :**
- HT = 550 ÷ 1,20 = **458,33 €**

**Calcul du montant de TVA :**
- TVA = 550 − 458,33 = **91,67 €**

</div>

**Note sur les arrondis :** 550 ÷ 1,20 = 458,3333... En comptabilité, on arrondit systématiquement à deux décimales. L'arrondi peut générer un écart d'un centime sur certains montants : c'est toléré par l'administration fiscale à condition que le total TTC reste cohérent. En cas de doute, appliquez l'arrondi au plus proche (règle dite "arrondi au centime près").

### Exemple 3 : Un repas au restaurant à 110 € TTC (TVA 10 %)

<div style="background:#F4F4F4;border-radius:12px;padding:1.5rem 1.75rem;margin:1rem 0;">

**Données :** prix TTC = 110 €, taux de TVA = 10 %.

**Calcul du montant HT :**
- HT = 110 ÷ (1 + 0,10) = 110 ÷ 1,10 = **100 €**

**Calcul du montant de TVA :**
- TVA = 110 − 100 = **10 €**

</div>

La restauration assise est soumise au taux intermédiaire de 10 %. Les travaux de rénovation dans un logement de plus de deux ans et le transport de voyageurs relèvent également de ce taux.

### Exemple 4 : Des livres pour 58,01 € TTC (TVA 5,5 %)

<div style="background:#F4F4F4;border-radius:12px;padding:1.5rem 1.75rem;margin:1rem 0;">

**Données :** prix TTC = 58,01 €, taux de TVA = 5,5 %.

**Calcul du montant HT :**
- HT = 58,01 ÷ (1 + 0,055) = 58,01 ÷ 1,055 = **55,00 €**

**Calcul du montant de TVA :**
- TVA = 58,01 − 55,00 = **3,01 €**

</div>

Le taux réduit de 5,5 % s'applique aux livres, à la plupart des produits alimentaires et aux abonnements d'énergie. Attention : le coefficient **1,055** est moins arrondi que 1,20 ou 1,10. Ne l'arrondissez pas lors du calcul pour conserver la précision.

### Exemple 5 : Un médicament remboursé à 20,62 € TTC (TVA 2,1 %)

<div style="background:#F4F4F4;border-radius:12px;padding:1.5rem 1.75rem;margin:1rem 0;">

**Données :** prix TTC = 20,62 €, taux de TVA = 2,1 %.

**Calcul du montant HT :**
- HT = 20,62 ÷ (1 + 0,021) = 20,62 ÷ 1,021 = **20,20 €**

**Calcul du montant de TVA :**
- TVA = 20,62 − 20,20 = **0,42 €**

</div>

Le taux super-réduit de 2,1 % s'applique aux médicaments remboursés par la Sécurité sociale et à certaines publications de presse papier. Ce taux est rarement rencontré dans la facturation standard des entreprises.

## Le Calcul Inverse : Comment Passer Facilement du HT au TTC

La formule inverse est plus intuitive : vous partez du prix HT et ajoutez la TVA. La formule est :

> **TTC = HT × (1 + t)**

**Exemple :** un produit à 200 € HT avec une TVA de 20 % :
- TTC = 200 × (1 + 0,20) = 200 × 1,20 = **240 € TTC**

**Astuce mnémotechnique pour ne plus jamais confondre les deux sens :**

- Du **HT vers le TTC** : le montant *augmente*. On **multiplie** par le coefficient.
- Du **TTC vers le HT** : le montant *diminue*. On **divise** par le coefficient.

> *Règle mémo : TTC est toujours plus grand que HT. Pour aller vers le grand (HT→TTC), on multiplie. Pour revenir vers le petit (TTC→HT), on divise.*

Ce repère permet de vérifier instantanément que vous utilisez le bon opérateur, sans mémoriser deux formules distinctes. Si le résultat obtenu est plus grand que le montant de départ, c'est que vous avez multiplié alors qu'il fallait diviser (et inversement).

## Outils et Automatisation : Gagner du Temps pour Passer du TTC à l'HT

Effectuer ces calculs manuellement présente un risque d'erreur, surtout sur de nombreuses lignes de facturation. Trois catégories d'outils permettent d'automatiser la conversion TTC→HT et d'éliminer les erreurs humaines : les calculatrices en ligne gratuites, les tableurs (Excel, Google Sheets) et les logiciels de facturation et de comptabilité.

### Utiliser un tableur (Excel, Google Sheets) pour le calcul

Un tableur est l'outil le plus flexible pour calculer et vérifier des montants TTC/HT en masse. Voici comment créer une mini-calculatrice en quatre étapes :

1. **Colonne A** ("Montant TTC") : saisir le montant TTC en cellule A2.
2. **Colonne B** ("Taux de TVA") : saisir le taux en décimale en B2 (ex : 0,20 pour 20 %).
3. **Colonne C** ("Montant HT") : saisir la formule `=A2/(1+B2)`.
4. **Colonne D** ("Montant TVA") : saisir la formule `=A2-C2`.

La formule **`=A2/(1+B2)`** est prête à être copiée-collée dans Excel comme dans Google Sheets. En glissant la formule vers le bas, vous calculez automatiquement le HT pour autant de lignes que nécessaire.

**Conseil pratique :** si votre cellule B2 affiche déjà "20 %" (format pourcentage natif), la formule `=A2/(1+B2)` fonctionne sans modification : le tableur interprète automatiquement 20 % comme 0,20. Si la cellule contient le nombre entier "20", utilisez `=A2/(1+B2/100)`.

### Notre avis d'expert sur les logiciels de facturation

Les logiciels de facturation modernes gèrent nativement et automatiquement le calcul de la TVA. En sélectionnant simplement le taux applicable à chaque ligne, l'outil calcule le montant HT, la TVA et le TTC sans intervention manuelle, et génère les déclarations de TVA pré-remplies (CA3 ou CA12).

Parmi les solutions les plus utilisées par les TPE et indépendants en France, on peut citer **Pennylane** (pour les PME avec expert-comptable), **Freebe** (spécialisé freelances et auto-entrepreneurs) ou **Sellsy** (pour les entreprises en croissance). Ces outils intègrent également la gestion de la franchise en base de TVA et alertent lors de l'approche des seuils.

> *Notre retour d'expérience montre que l'adoption d'un logiciel de facturation adapté élimine quasi-totalement les erreurs de calcul de TVA. L'investissement, souvent inférieur à 30 € HT par mois pour une TPE, est amorti dès la première facture retraitée évitée.*

## Cas Pratique : Le Calcul de TVA pour l'Auto-Entrepreneur

La grande majorité des auto-entrepreneurs bénéficient du régime de la **franchise en base de TVA**. Cela signifie concrètement qu'ils ne facturent pas de TVA à leurs clients et n'en récupèrent pas sur leurs achats professionnels. Leurs factures doivent obligatoirement mentionner : *"TVA non applicable, article 293 B du CGI."*

Dans ce contexte, un auto-entrepreneur **facture directement en HT**, sans avoir à gérer de conversion TTC/HT au quotidien.

**Que se passe-t-il en cas de dépassement des seuils de franchise ?**

Lorsque le chiffre d'affaires franchit les seuils légaux (en 2026 : environ 85 800 € pour les activités commerciales et 34 400 € pour les prestations de service), l'auto-entrepreneur bascule dans le régime réel de TVA. Vérifiez les valeurs exactes sur [service-public.fr](https://www.service-public.fr/professionnels-entreprises/vosdroits/F21746). Il doit alors :

- **Facturer la TVA** à ses clients : TTC = HT × (1 + taux)
- **Déduire la TVA** payée sur ses achats professionnels
- **Déposer une déclaration de TVA** périodique :
  - **CA12** (régime simplifié) : déclaration annuelle avec deux acomptes semestriels
  - **CA3** (régime réel normal) : déclaration mensuelle ou trimestrielle

**Exemple chiffré :** un auto-entrepreneur prestataire de services avec un CA de 40 000 € HT après dépassement du seuil doit facturer 40 000 × 1,20 = **48 000 € TTC** à ses clients. Il collectera 8 000 € de TVA à reverser à l'État, déduction faite de la TVA récupérée sur ses achats.

La maîtrise du calcul TTC/HT devient alors une nécessité opérationnelle. Il est fortement conseillé de consulter un expert-comptable dès l'approche des seuils pour anticiper et organiser le basculement.

---

## FAQ

### Quelle est la formule pour passer du TTC au HT ?

La formule est **HT = TTC ÷ (1 + taux de TVA)**. Pour un taux de 20 %, divisez le montant TTC par 1,20. Pour un taux de 10 %, divisez par 1,10. Pour un taux de 5,5 %, divisez par 1,055. C'est la seule méthode correcte.

### Comment enlever la TVA de 20 % sur un prix ?

Il ne faut pas soustraire 20 % mais **diviser par 1,20**. Exemple : pour 120 € TTC, faites 120 ÷ 1,20 = **100 € HT**. Soustraire 20 % (120 × 0,80 = 96 €) donne un résultat faux, car la TVA est calculée sur le montant HT et non sur le montant TTC.

### Pourquoi ne faut-il pas multiplier par 0,80 pour trouver le HT ?

Multiplier par 0,80 revient à enlever 20 % du montant TTC. Or, la TVA n'est pas 20 % du TTC : elle est 20 % du montant HT. Ces deux bases sont différentes. Le résultat : 120 × 0,80 = 96 € (faux) au lieu de 120 ÷ 1,20 = 100 € (correct). L'écart représente 4 % de sous-évaluation du montant HT réel.

### Comment calculer le montant de la TVA à partir du TTC ?

Deux méthodes. **Méthode en deux temps :** (1) calculez le HT avec HT = TTC ÷ (1 + t) ; (2) soustrayez : TVA = TTC − HT. **Formule directe :** TVA = TTC × (t ÷ (1 + t)). Pour un taux de 20 % : TVA = TTC × (0,20 ÷ 1,20) = TTC × 0,1667.

### Comment calculer le HT avec une TVA à 10 % ou 5,5 % ?

Pour une TVA à **10 %** : divisez le montant TTC par **1,10**. Exemple : 110 € TTC ÷ 1,10 = 100 € HT. Pour une TVA à **5,5 %** : divisez par **1,055**. Exemple : 105,50 € TTC ÷ 1,055 = 100 € HT.

### Comment passer du HT au TTC ?

La formule inverse est **TTC = HT × (1 + taux de TVA)**. Pour un taux de 20 %, multipliez le HT par 1,20. Pour un taux de 10 %, multipliez par 1,10. Exemple : 200 € HT × 1,20 = **240 € TTC**. Astuce : on multiplie car le TTC est plus grand que le HT.

### Comment vérifier le calcul de TVA sur une facture fournisseur ?

Prenez le montant TTC et le taux de TVA indiqués sur la facture. Appliquez la formule HT = TTC ÷ (1 + t) et vérifiez que le résultat correspond au montant HT mentionné. Calculez ensuite TVA = TTC − HT et vérifiez la correspondance. Un écart d'un centime dû aux arrondis est acceptable ; un écart plus important signale une erreur à corriger.

### Existe-t-il une calculatrice en ligne pour convertir TTC en HT ?

Oui, utilisez le simulateur gratuit en haut de cet article : saisissez votre montant TTC, sélectionnez le taux de TVA, et obtenez le montant HT instantanément. Vous pouvez aussi créer votre propre outil dans Google Sheets avec la formule `=A2/(1+B2)`.

---

La méthode infaillible pour passer du TTC au HT tient en une règle : **divisez le montant TTC par (1 + le taux de TVA)**. Ne soustrayez jamais directement le pourcentage : c'est l'erreur la plus fréquente et la plus coûteuse en comptabilité. La maîtrise de ce calcul est indispensable pour toute gestion comptable saine et conforme aux obligations fiscales françaises.

Pour les professionnels qui manipulent régulièrement des factures, l'adoption d'un logiciel de facturation moderne est l'investissement le plus efficace : il élimine le risque d'erreur à la source. Pour les cas ponctuels, la formule `=A2/(1+B2)` dans un tableur suffit amplement.

---

*Données issues de la Direction générale des Finances publiques (DGFIP) et du Code général des impôts (art. 278 et suivants). Taux de TVA et seuils susceptibles d'évoluer : consultez [impots.gouv.fr](https://www.impots.gouv.fr) et [service-public.fr](https://www.service-public.fr) pour les informations les plus récentes.*

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Passer de TTC à HT : Le Guide Complet avec Formule et Exemples",
      "description": "Simulateur gratuit pour passer du TTC au HT en ligne + formule HT = TTC ÷ (1 + taux), tableau des taux TVA, 5 exemples concrets et cas auto-entrepreneur.",
      "datePublished": "2026-05-24",
      "dateModified": "2026-05-24",
      "author": {
        "@type": "Person",
        "name": "François Aublin",
        "url": "https://business-trendz.com/auteurs/francois-aublin/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Business Trendz"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Quelle est la formule pour passer du TTC au HT ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La formule est HT = TTC ÷ (1 + taux de TVA). Pour un taux de 20 %, divisez le montant TTC par 1,20. Pour 10 %, divisez par 1,10. Pour 5,5 %, divisez par 1,055."
          }
        },
        {
          "@type": "Question",
          "name": "Comment enlever la TVA de 20 % sur un prix ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Il ne faut pas soustraire 20 % mais diviser par 1,20. Exemple : pour 120 € TTC, faites 120 ÷ 1,20 = 100 € HT. Soustraire 20 % (120 × 0,80 = 96 €) donne un résultat faux, car la TVA est calculée sur le HT."
          }
        },
        {
          "@type": "Question",
          "name": "Pourquoi ne faut-il pas multiplier par 0,80 pour trouver le HT ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Multiplier par 0,80 revient à enlever 20 % du montant TTC. Or, la TVA est calculée sur le HT et non sur le TTC. 120 × 0,80 = 96 € (faux) au lieu de 120 ÷ 1,20 = 100 € (correct). L'écart représente 4 % de sous-évaluation."
          }
        },
        {
          "@type": "Question",
          "name": "Comment calculer le montant de la TVA à partir du TTC ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Méthode en deux temps : (1) calculez le HT avec HT = TTC ÷ (1 + t), puis (2) soustrayez : TVA = TTC − HT. Formule directe : TVA = TTC × (t ÷ (1 + t))."
          }
        },
        {
          "@type": "Question",
          "name": "Comment calculer le HT avec une TVA à 10 % ou 5,5 % ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pour une TVA à 10 % : divisez le montant TTC par 1,10. Pour une TVA à 5,5 % : divisez par 1,055."
          }
        },
        {
          "@type": "Question",
          "name": "Comment passer du HT au TTC ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La formule inverse est TTC = HT × (1 + taux de TVA). Pour un taux de 20 %, multipliez le HT par 1,20. Exemple : 200 € HT × 1,20 = 240 € TTC."
          }
        },
        {
          "@type": "Question",
          "name": "Comment vérifier le calcul de TVA sur une facture fournisseur ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Prenez le montant TTC et le taux de TVA de la facture. Appliquez HT = TTC ÷ (1 + t) et vérifiez que le résultat correspond au HT indiqué. Calculez TVA = TTC − HT et vérifiez la correspondance."
          }
        },
        {
          "@type": "Question",
          "name": "Existe-t-il une calculatrice en ligne pour convertir TTC en HT ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Oui, utilisez le simulateur gratuit en haut de cet article. Vous pouvez aussi créer votre outil dans Google Sheets avec la formule =A2/(1+B2)."
          }
        }
      ]
    }
  ]
}
</script>
