#!/usr/bin/env bash
set -e

gh label create "frontend"  --color "0e8a16" --description "Angular / UI" --force
gh label create "finitions" --color "cccccc" --description "Polish, UX, responsive" --force

gh issue create --title "Modifier un voyage" --body "Tâche issue de la roadmap Itineria (après MVP).
Formulaire d'édition + updateTrip (PUT déjà au backend)." --label "frontend"

gh issue create --title "Supprimer un voyage" --body "Tâche issue de la roadmap Itineria (après MVP).
Confirmation puis deleteTrip (DELETE déjà au backend)." --label "frontend"

gh issue create --title "Modifier une étape" --body "Tâche issue de la roadmap Itineria (après MVP).
Formulaire d'édition + updateStep (PUT déjà au backend)." --label "frontend"

gh issue create --title "Supprimer une étape" --body "Tâche issue de la roadmap Itineria (après MVP).
Confirmation puis deleteStep (DELETE déjà au backend)." --label "frontend"

gh issue create --title "Supprimer une photo" --body "Tâche issue de la roadmap Itineria (après MVP).
Bouton sur l'étape / le carnet + deletePhoto (DELETE déjà au backend)." --label "frontend"

gh issue create --title "Rediriger vers /trips si déjà connecté" --body "Tâche issue de la roadmap Itineria (après MVP).
Si token valide, /login et /register envoient vers la liste." --label "frontend"

gh issue create --title "Page voyage introuvable" --body "Tâche issue de la roadmap Itineria (après MVP).
Si GET trip 404, afficher un message + lien vers la liste (pas un chargement infini)." --label "frontend"

gh issue create --title "Clarifier ou cacher le champ Ordre des étapes" --body "Tâche issue de la roadmap Itineria (après MVP).
Le champ orderIndex est peu clair pour l'utilisateur." --label "frontend,finitions"

gh issue create --title "README : lancer le projet (docker, back, front)" --body "Tâche issue de la roadmap Itineria (après MVP).
Expliquer comment démarrer PostgreSQL, backend et frontend." --label "finitions"

gh issue create --title "Préparer un déploiement" --body "Tâche issue de la roadmap Itineria (après MVP).
Dockerfile ou instructions de mise en ligne." --label "finitions"

echo "Terminé : 10 issues créées."
