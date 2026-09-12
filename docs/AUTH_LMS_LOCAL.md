# Auth + LMS local stack

This stack runs only the frontend, Auth, LMS, and infrastructure required by
those two services. AI, Chat, Lab, Personalization, Recommender, Analytics, and
Data Warehouse services remain in Git but are not started.

## Services

- Traefik: `http://localhost:3000`
- Auth API: `http://localhost:8080` by default, or `AUTH_PORT` from `.env.auth-lms.local`
- LMS API: `http://localhost:8081`
- Auth PostgreSQL: `localhost:5433`
- LMS PostgreSQL: `localhost:5434`
- Redis and Kafka are internal runtime dependencies.

LMS uploads use the local Docker volume instead of MinIO. Calls to disabled
service URLs fail locally and are not part of the Auth + LMS smoke test.

## Start

```powershell
Copy-Item .env.auth-lms.example .env.auth-lms.local
docker compose --env-file .env.auth-lms.local -f docker-compose.auth-lms.yml up --build -d
```

## Demo accounts

The local seed creates these accounts if they do not exist yet:

- Admin: `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.auth-lms.local`
- Teacher: `TEACHER_EMAIL` / `TEACHER_PASSWORD`
- Student: `STUDENT_EMAIL` / `STUDENT_PASSWORD`

By default, the example file uses `teacher@example.local` and
`student@example.local`. Change the passwords in `.env.auth-lms.local` before
using this stack outside local development.

## Verify

```powershell
docker compose --env-file .env.auth-lms.local -f docker-compose.auth-lms.yml ps
Invoke-WebRequest http://localhost:3000/api/health -UseBasicParsing
Invoke-WebRequest http://localhost:${env:AUTH_PORT}/actuator/health/liveness -UseBasicParsing
Invoke-WebRequest http://localhost:8081/health -UseBasicParsing
```

## Stop

```powershell
docker compose --env-file .env.auth-lms.local -f docker-compose.auth-lms.yml down
```

Add `--volumes` only when intentionally resetting the local databases and
uploads.
