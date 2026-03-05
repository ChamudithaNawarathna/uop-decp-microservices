# Department Engagement & Career Platform (DECP)

A microservices-based social and career platform for students and alumni of the **Department of Computer Engineering, University of Peradeniya**.

**Course:** CO528 — Applied Software Architecture

---

## Project Overview

DECP facilitates networking, career opportunities, and academic collaboration through a modular, scalable microservices architecture. The platform enables students to connect with alumni, share posts, apply for jobs/internships, participate in department events, collaborate on research, and find mentors.

### Key Features

| Feature            | Description                                    | Status     |
| ------------------ | ---------------------------------------------- | ---------- |
| **Authentication** | JWT-based login with role-based access control | ✅ Live    |
| **User Profiles**  | Registration, profiles, alumni directory       | ✅ Live    |
| **Social Feed**    | Posts with likes, comments, media              | ✅ Live    |
| **Job Portal**     | Job/internship listings with applications      | ✅ Live    |
| **Campus Events**  | Event creation, RSVP, calendar                 | 🔨 Planned |
| **Research Hub**   | Academic papers, versioning, DOI linking       | 🔨 Planned |
| **Messaging**      | Real-time chat via WebSocket + STOMP           | 🔨 Planned |
| **Notifications**  | Batched push notifications                     | 🔨 Planned |
| **Analytics**      | Platform usage stats (admin dashboard)         | 🔨 Planned |
| **Mentorship**     | Alumni-student mentor matching                 | 🔨 Planned |

---

## Tech Stack

| Layer             | Technology                                                         |
| ----------------- | ------------------------------------------------------------------ |
| **Backend**       | Java 17, Spring Boot 3.2.3, Spring Cloud Gateway                   |
| **Frontend**      | React 19 (TypeScript), Axios, React Router 7                       |
| **Databases**     | PostgreSQL 15 (relational), MongoDB 6 (documents), Redis 7 (cache) |
| **Messaging**     | RabbitMQ 3 (async event-driven communication)                      |
| **DevOps**        | Docker, Docker Compose, GitHub Actions                             |
| **Documentation** | SpringDoc OpenAPI (Swagger UI)                                     |

---

## Architecture

```
                          ┌──────────────┐
                          │  Web Client  │
                          │  React (3000)│
                          └──────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │ API Gateway  │
                          │ (8080) JWT   │
                          └──┬───┬───┬───┘
            ┌────────────────┼───┼───┼────────────────┐
            ▼                ▼   ▼   ▼                ▼
       ┌────────┐     ┌─────┐ ┌─────┐ ┌─────┐  ┌──────────┐
       │  Auth  │     │User │ │Post │ │ Job │  │ Event +  │
       │  8081  │     │8082 │ │8083 │ │8084 │  │ more...  │
       └────────┘     └──┬──┘ └──┬──┘ └──┬──┘  └──────────┘
                         │      │      │
              ┌──────────▼──┐ ┌─▼──────▼──┐  ┌─────────┐
              │ PostgreSQL  │ │  MongoDB   │  │  Redis  │
              └─────────────┘ └────────────┘  └─────────┘
                         │      │      │
                         └──────▼──────┘
                          ┌────────────┐
                          │  RabbitMQ  │
                          │ Event Bus  │
                          └────────────┘
```

### Services

| Service                  | Port | Database        | Description                                   |
| ------------------------ | ---- | --------------- | --------------------------------------------- |
| **API Gateway**          | 8080 | —               | Routes, JWT validation, CORS                  |
| **Auth Service**         | 8081 | —               | Login, token generation/validation            |
| **User Service**         | 8082 | PostgreSQL      | User profiles, registration, alumni directory |
| **Post Service**         | 8083 | MongoDB         | Social feed, likes, comments                  |
| **Job Service**          | 8084 | PostgreSQL      | Job listings, applications                    |
| **Event Service**        | 8085 | PostgreSQL      | Campus events, RSVP                           |
| **Research Service**     | 8086 | MongoDB         | Academic research hub                         |
| **Messaging Service**    | 8087 | MongoDB         | Real-time chat (WebSocket)                    |
| **Notification Service** | 8088 | MongoDB + Redis | Push notifications, batching                  |
| **Analytics Service**    | 8089 | PostgreSQL      | Platform statistics                           |
| **Mentorship Service**   | 8090 | PostgreSQL      | Mentor-mentee matching                        |

---

## Prerequisites

- **Java 17** or higher
- **Node.js** v18+
- **Docker & Docker Desktop**
- **Maven** (optional — use the provided `./mvnw`)

---

## Getting Started

### 1. Start Infrastructure

```bash
docker-compose up -d
```

This starts PostgreSQL, MongoDB (port 27018), Redis, and RabbitMQ.

### 2. Start Backend Services

From the `backend/` directory, start each service in a separate terminal:

```bash
./mvnw -pl api-gateway spring-boot:run      # Port 8080
./mvnw -pl auth-service spring-boot:run      # Port 8081
./mvnw -pl user-service spring-boot:run      # Port 8082
./mvnw -pl post-service spring-boot:run      # Port 8083
./mvnw -pl job-service spring-boot:run       # Port 8084
```

### 3. Start Frontend

```bash
cd frontend/web-client
npm install
npm start
```

Open http://localhost:3000

### Production (Full Docker)

```bash
docker-compose -f docker-compose.prod.yml up --build
```

---

## Project Structure

```
├── backend/
│   ├── pom.xml                 # Parent POM (all modules)
│   ├── api-gateway/            # Spring Cloud Gateway
│   ├── auth-service/           # Authentication + JWT
│   ├── user-service/           # User profiles + registration
│   ├── post-service/           # Social feed + posts
│   ├── job-service/            # Job listings + applications
│   ├── event-service/          # Campus events + RSVP
│   ├── research-service/       # Academic research hub
│   ├── messaging-service/      # Real-time chat
│   ├── notification-service/   # Notification center
│   ├── analytics-service/      # Platform analytics
│   └── mentorship-service/     # Mentor matching
├── frontend/
│   └── web-client/             # React TypeScript SPA
├── designs/                    # Interactive architecture diagrams (JSX)
├── docker-compose.yml          # Dev infrastructure
├── docker-compose.prod.yml     # Full production stack
├── PROJECT_PLAN.md             # Detailed implementation plan
└── README.md
```

---

## Security & Roles

| Role        | Capabilities                                                             |
| ----------- | ------------------------------------------------------------------------ |
| **STUDENT** | View content, create posts, apply for jobs, RSVP events, request mentors |
| **ALUMNI**  | All student capabilities + post jobs, create events, mentor students     |
| **ADMIN**   | All capabilities + analytics dashboard, manage users, content moderation |

### Authentication Flow

1. Client sends credentials to Auth Service via API Gateway
2. Auth Service validates against User Service (internal call)
3. JWT token generated with `{username, role}` claims
4. Token stored client-side, sent as `Authorization: Bearer <token>` on all requests
5. API Gateway validates JWT and injects `X-User-Name` / `X-User-Role` headers for downstream services

---

## API Endpoints

### Auth Service (8081)

| Method | Path                 | Description        |
| ------ | -------------------- | ------------------ |
| POST   | `/api/auth/login`    | Authenticate user  |
| GET    | `/api/auth/validate` | Validate JWT token |

### User Service (8082)

| Method | Path                          | Description       |
| ------ | ----------------------------- | ----------------- |
| POST   | `/api/users/register`         | Register new user |
| GET    | `/api/users/{id}`             | Get user profile  |
| GET    | `/api/users/search?username=` | Search user       |
| GET    | `/api/users/alumni`           | Alumni directory  |

### Post Service (8083)

| Method | Path                      | Description       |
| ------ | ------------------------- | ----------------- |
| POST   | `/api/posts`              | Create post       |
| GET    | `/api/posts`              | Get all posts     |
| POST   | `/api/posts/{id}/like`    | Like a post       |
| POST   | `/api/posts/{id}/comment` | Comment on a post |

### Job Service (8084)

| Method | Path                          | Description               |
| ------ | ----------------------------- | ------------------------- |
| POST   | `/api/jobs`                   | Create job (ALUMNI/ADMIN) |
| GET    | `/api/jobs`                   | List all jobs             |
| GET    | `/api/jobs/{id}`              | Get job details           |
| POST   | `/api/jobs/{id}/apply`        | Apply for job (STUDENT)   |
| GET    | `/api/jobs/{id}/applications` | Get applications          |

---

## Design Diagrams

Interactive architecture diagrams built as React components (in `designs/`):

1. **SOA Diagram** — Service-Oriented Architecture with all 10 services, endpoints, and RabbitMQ events
2. **Enterprise Architecture** — Full layered architecture from client to cloud infrastructure
3. **Deployment Diagram** — AWS cloud deployment with ECS Fargate, RDS, DocumentDB
4. **Product Modularity** — Module breakdown with shared components and dependencies
5. **Platform Research** — LinkedIn vs Facebook vs DECP feature comparison

---

## Containerization

Each service has a `Dockerfile` for independent deployment.

```bash
# Build all backend services
cd backend
mvn clean package -DskipTests

# Build individual Docker images
docker build -t decp-api-gateway ./api-gateway
docker build -t decp-auth-service ./auth-service
docker build -t decp-user-service ./user-service
docker build -t decp-post-service ./post-service
docker build -t decp-job-service ./job-service

# Build frontend
docker build -t decp-web-client ./frontend/web-client
```

---

## Service URLs

| Service                  | URL                                     |
| ------------------------ | --------------------------------------- |
| Web Client               | http://localhost:3000                   |
| API Gateway              | http://localhost:8080                   |
| RabbitMQ Management      | http://localhost:15672 (guest/guest)    |
| Swagger UI (per service) | http://localhost:{port}/swagger-ui.html |

---

## Contributing

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for the detailed implementation plan, phases, and service specifications for new services.
