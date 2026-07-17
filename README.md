# Itineria

Itineria est un carnet de voyage interactif avec une carte animée. Chaque voyage se construit visuellement au fil des étapes ajoutées : la carte se dessine en direct, le carnet se remplit de photos et de notes, et le tout peut être rejoué comme une petite histoire animée.

Ce projet est développé comme projet d'apprentissage personnel avec pour objectif de progresser sur Angular (frontend) et Spring Boot (backend) tout en produisant un outil réellement utilisable.

## Table des matières
 
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Outils recommandés](#outils-recommandés)
- [Installation](#installation)
- [Configuration](#configuration)
- [Modèle de données](#modèle-de-données)
- [Endpoints API](#endpoints-api)

## Stack technique
 
> Décidée une fois pour toutes — on ne revient plus dessus en cours de route.
 
- **Frontend** : Angular (standalone components)
- **Backend** : Spring Boot 3
- **Base de données** : PostgreSQL (avec Docker Compose en local)
- **Auth** : JWT
- **Carte** : Leaflet + OpenStreetMap
- **Stockage images** : dossier local `/uploads` pour la V1
- **Migrations DB** : Hibernate en mode `update`
- **Géocodage** : Nominatim

## Prérequis
 
Pour faire tourner ce projet en local, il faut avoir installé :
 
- [JDK 17 ou 21](https://adoptium.net/)
- [Maven](https://maven.apache.org/) (ou utiliser le wrapper `./mvnw` fourni avec le backend)
- [Node.js LTS](https://nodejs.org/) + npm
- [Angular CLI](https://angular.dev/tools/cli) : `npm install -g @angular/cli`
- [Docker](https://www.docker.com/) + Docker Compose (pour lancer PostgreSQL sans l'installer en local)

Une installation locale de PostgreSQL fonctionne aussi, si Docker n'est pas utilisé.

- [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) - pour tester les endpoints de l'API pendant le développement
- [pgAdmin](https://www.pgadmin.org/) - pour visualiser la base PostgreSQL (optionnel, une extension DB dans l'IDE suffit aussi)
- [GitHub CLI](https://cli.github.com/) - pour gérer les Issues en ligne de commande

## Installation

### 1. Cloner le repo

```bash
git clone https://github.com/onybrunella/itineria.git
cd itineria
```

### 2. Lancer la base de données
 
```bash
docker compose up -d
```
 
### 3. Lancer le backend
 
```bash
cd backend
./mvnw spring-boot:run
```
Le backend démarre par défaut sur `http://localhost:8080`.
 
### 4. Lancer le frontend
 
```bash
cd frontend
npm install
ng serve
```
Le frontend démarre par défaut sur `http://localhost:4200`.
 
 
## Configuration
 
### Backend — `application.properties`
 
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/itineria_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
jwt.secret=change_moi_en_variable_environnement
```
 
### CORS
 
Le backend doit autoriser les requêtes venant de `http://localhost:4200` (origine du frontend en développement) pour que les deux applications communiquent correctement.
 
### Variables sensibles
 
Ne jamais committer de vrais secrets (mot de passe DB, clé JWT). Utiliser un fichier `.env` ou des variables d'environnement une fois le projet prêt à être partagé ou déployé.
 
 
## Modèle de données
 
**User** : id, email, password (hashé), pseudo, createdAt
 
**Trip** : id, title, description, startDate, endDate, status (DRAFT / PUBLISHED), userId
 
**Step** : id, tripId, locationName, latitude, longitude, date, note, orderIndex
 
**Photo** : id, stepId, url, uploadedAt
 
Relations : `User` 1→N `Trip` · `Trip` 1→N `Step` · `Step` 1→N `Photo`
 
 
## Endpoints API
 
```
# Auth
POST   /api/auth/register
POST   /api/auth/login
 
# Trips
GET    /api/trips
POST   /api/trips
GET    /api/trips/{id}
PUT    /api/trips/{id}
DELETE /api/trips/{id}
GET    /api/trips/{id}/itinerary
 
# Steps
POST   /api/trips/{tripId}/steps
GET    /api/trips/{tripId}/steps
PUT    /api/steps/{id}
DELETE /api/steps/{id}
 
# Photos
POST   /api/steps/{stepId}/photos
DELETE /api/photos/{id}
```
 
Chaque endpoint (sauf `register`/`login`) vérifie que l'utilisateur connecté est bien propriétaire du `Trip` concerné.


 
## Licence
 
Ce projet est distribué sous licence [MIT](./LICENSE) — libre d'utilisation, de modification et de partage, à condition de conserver la mention de copyright originale.
 

## Mainteneur
 
- **[onybrunella]** — [github.com/onybrunella](https://github.com/onybrunella)
