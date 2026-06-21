# Grabi 🐭✨

Application enfantine et magique où les enfants découvrent des histoires et comptines illustrées,
en créent leurs propres à partir d'une simple phrase, et les partagent dans une communauté
bienveillante animée par **Grabi**, la petite mascotte.

## Contenu

Prototype interactif (maquette cliquable) exporté depuis Claude Design, déployé en statique.

| Fichier | Rôle |
|---|---|
| `index.html` | Le prototype `Appli Grabi - Proto.dc.html` (12 écrans + logique d'état) |
| `support.js` | Runtime « Design Composition » qui interprète les balises `<x-dc>`, `<sc-if>`, `<dc-import>`, les bindings `{{ }}` |
| `Grabi.dc.html` | Composant mascotte importé par `<dc-import name="Grabi">` |

## Écrans

`home` · `free` · `premium` · `subscribe` · `create` · `qcm` · `generating` · `ready` · `reader` · `community` · `mine` · `published`

## Déploiement

Site 100 % statique — aucune étape de build. Déployé automatiquement sur Vercel à chaque push.
