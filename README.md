# Department Engagement & Career Platform (DECP)

The Department Engagement & Career Platform (DECP) is a microservices-based social and career platform designed for current students and alumni of the Department of Computer Engineering, University of Peradeniya. It facilitates networking, career opportunities, and academic collaboration through a modular, scalable architecture.

## 🚀 Project Overview
DECP focuses on architectural modularity and integration. It allows students to connect with alumni, share posts, apply for jobs/internships, and participate in department events.

### Core Features
- **User Management:** Role-based access (Student, Alumni, Admin) with secure JWT authentication.
- **Feed & Media:** A social wall for sharing updates, images, and interacting via likes and comments.
- **Job & Internship Portal:** Alumni can post opportunities; students can view and apply for them.
- **Interactive Architecture:** Detailed system designs (SOA, Enterprise, Modularity) implemented as interactive React components.

---

## 🛠 Tech Stack
- **Backend:** Java 17, Spring Boot 3.2.3, Spring Cloud Gateway.
- **Frontend:** React (TypeScript), Axios, React Router.
- **Databases:** PostgreSQL (Relational), MongoDB (Document-store), Redis (Caching/Notifications).
- **Messaging:** RabbitMQ (Asynchronous event-driven communication).
- **DevOps:** Docker & Docker Compose for infrastructure orchestration.

---

## 🛠 Prerequisites
- **Java 17** or higher.
- **Node.js** (v18+ recommended).
- **Docker & Docker Desktop**.
- **Maven** (optional, you can use the provided `./mvnw`).

---

## 🏃 How to Run the Application

### 1. Start Infrastructure (Docker)
Ensure Docker is running, then navigate to the root folder and start the core services:
```bash
docker-compose up -d
```
*This starts PostgreSQL, MongoDB (on port 27018), Redis, and RabbitMQ.*

### 2. Start Backend Services
Navigate to `backend/` and start each service in a separate terminal (or use IntelliJ's Run Configuration):

1. **API Gateway (Port 8080):**
   ```bash
   ./mvnw -pl api-gateway spring-boot:run
   ```
2. **Auth Service (Port 8081):**
   ```bash
   ./mvnw -pl auth-service spring-boot:run
   ```
3. **User Service (Port 8082):**
   ```bash
   ./mvnw -pl user-service spring-boot:run
   ```
4. **Post Service (Port 8083):**
   ```bash
   ./mvnw -pl post-service spring-boot:run
   ```
5. **Job Service (Port 8084):**
   ```bash
   ./mvnw -pl job-service spring-boot:run
   ```

### 3. Start Frontend Client
Navigate to `frontend/web-client` and start the React app:
```bash
cd frontend/web-client
npm install
npm start
```
*The portal will be available at `http://localhost:3000`.*

---

## 🐳 Containerization & Deployment
Each service includes a `Dockerfile` for independent deployment (e.g., to AWS ECS Fargate).

To build a backend service image:
1. Build the JAR: `mvn clean package -DskipTests` (from `backend/`)
2. Build Docker: `docker build -t decp-auth-service ./auth-service` (from `backend/`)

To build the frontend image:
`docker build -t decp-web-client .` (from `frontend/web-client`)

---

## 📂 Project Structure
- **/backend:** Spring Boot microservices.
- **/frontend:** React-based web client.
- **/files:** Interactive architecture diagrams (.jsx components).
- **CO528 Mini Project.pdf:** Original project requirements and objective.

## 🛡 Security & Roles
- **STUDENT:** Can create posts, view/apply for jobs, and search the alumni directory.
- **ALUMNI:** Can create posts, **post new jobs/internships**, and browse the platform.
- **ADMIN:** Full access to all modules and analytics (planned).

Authentication is handled via **JWT (JSON Web Tokens)** passed from the API Gateway to all downstream microservices.
