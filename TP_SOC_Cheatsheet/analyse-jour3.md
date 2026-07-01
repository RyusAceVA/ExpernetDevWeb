# Analyse pédagogique — Le pont vers le Jour 3

Observations faites avec l'inspecteur (F12) en mode Vue Adaptative (Ctrl+Shift+M),
en réduisant la largeur jusqu'à 768px (tablette) puis 375px (smartphone).

## 1. Que devient la colonne de filtrage de 300px sur un écran de 360px ?
La colonne `<aside>` reste figée à 300px car sa largeur est fixe dans la grille
(`grid-template-columns: 300px 1fr;`). Sur un écran de 360px, il ne reste donc
quasiment plus de place (360 - 300 - 20 de gap = 40px) pour le tableau. La mise
en page « déborde » et devient inutilisable : les deux colonnes ne tiennent plus
côte à côte confortablement.

## 2. Le tableau reste-t-il lisible ?
Non. Avec 5 colonnes de texte, le tableau est plus large que l'espace restant.
Il provoque l'apparition d'une **barre de défilement horizontale** : l'utilisateur
doit scroller latéralement pour lire l'action du pare-feu, ce qui nuit à la
lisibilité en situation d'analyse rapide.

## 3. Pourquoi Grid + Flexbox ont besoin d'instructions conditionnelles ?
Grid et Flexbox gèrent très bien la disposition, mais nos règles sont **statiques** :
la colonne de 300px et les 2 colonnes du `main` restent identiques quelle que soit
la taille de l'écran. Pour le mobile, il faut des instructions **conditionnelles**
— les **Media Queries** (`@media (max-width: 768px) { ... }`) — afin de :
- passer la grille du `main` sur une seule colonne (`grid-template-columns: 1fr;`),
- rendre l'`<aside>` en largeur 100% au lieu de 300px,
- rendre le tableau défilable ou empilable.

C'est justement le sujet du Jour 3 : le **Responsive Design**.
