# Itineria

Itineria is an interactive travel journal with a live map. Each trip is built step by step: the map draws itself as you add stops, the journal fills up with photos and notes, and you can replay the whole trip like a short animated story.

This is a personal learning project to get better at Angular and Spring Boot while building something actually usable.

## Tech stack

- **Frontend:** Angular (standalone components)
- **Backend:** Spring Boot 3
- **Database:** PostgreSQL (Docker Compose for local development)
- **Auth:** JWT
- **Map:** Leaflet + OpenStreetMap
- **Image storage:** local `/uploads` folder (V1)
- **DB migrations:** Hibernate `update` mode
- **Geocoding:** Nominatim

## Requirements

- JDK 17 or 21
- Maven (or the `./mvnw` wrapper included in the backend)
- Node.js LTS and npm
- Angular CLI: `npm install -g @angular/cli`
- Docker and Docker Compose (to run PostgreSQL)

Optional tools:

- Postman or Insomnia, to test the API
- pgAdmin, to browse the database
- GitHub CLI, to manage issues from the terminal

## Getting started

```bash
# 1. Clone the repo
git clone https://github.com/onybrunella/itineria.git
cd itineria

# 2. Start the database
docker compose up -d

# 3. Start the backend (http://localhost:8080)
cd backend
./mvnw spring-boot:run

# 4. Start the frontend (http://localhost:4200)
cd ../frontend
npm install
ng serve
```

## Configuration

Backend settings live in `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/itineria_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
jwt.secret=change_me
```

**CORS:** the backend must allow requests from `http://localhost:4200` so the frontend can talk to it.

**Secrets:** never commit real secrets (DB password, JWT key). Use environment variables or a `.env` file before sharing or deploying.

## Data model

- **User:** id, email, password (hashed), pseudo, createdAt
- **Trip:** id, title, description, startDate, endDate, status (DRAFT or PUBLISHED), userId
- **Step:** id, tripId, locationName, latitude, longitude, date, note, orderIndex
- **Photo:** id, stepId, url, uploadedAt

A User has many Trips, a Trip has many Steps, and a Step has many Photos.

## API endpoints

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

All endpoints except `register` and `login` require a JWT (`Authorization: Bearer <token>`) and check that the logged-in user owns the trip.

## License

[MIT](./LICENSE). Free to use, modify and share, as long as the original copyright notice is kept.

## Maintainer

[onybrunella](https://github.com/onybrunella)
