# 🧠 Tool Management API — Scalable & Modern RESTful Service

This is a scalable and well-documented API designed to manage tools, but it can be easily adapted to handle any type of material your business requires. If you're interested in expanding the use case for your needs, feel free to schedule a conversation with the developer.

The API is built with **NestJS**, uses **Prisma ORM** for database access, and relies on **PostgreSQL** as a robust relational database system. The entire application is containerized via **Docker Compose**, and includes **Swagger** for interactive and automatic API documentation.

---

## 🚀 Tech Stack

### 🧱 NestJS — [https://nestjs.com](https://nestjs.com)
- Scalable architecture inspired by OOP, FP, and FRP.
- Modular structure supporting clear separation of concerns.
- Excellent dependency injection system and testing capabilities.
- Widely adopted by enterprises such as Adidas, Autodesk, and Decathlon.

### 🔄 Prisma ORM — [https://www.prisma.io](https://www.prisma.io)
- Strongly typed, performant, and intuitive database client.
- Built-in support for migrations and automatic schema generation.
- Excellent developer experience with autocompletion and validation.

### 🐘 PostgreSQL — [https://www.postgresql.org](https://www.postgresql.org)
- Reliable, open-source, relational database.
- Supports ACID compliance, complex queries, constraints, and transactions.
- Chosen for its stability, flexibility, and rich ecosystem.

### 🐳 Docker Compose
- Simplifies local development and deployment across environments.
- Spins up all services with one command.
- Ensures isolated and reproducible infrastructure.

### 📚 Swagger (OpenAPI)
- Auto-generated API documentation.
- Interactive interface to explore and test endpoints.
- Useful for frontend/mobile integrations and third-party consumers.

---

## ⚙️ How to Run

> ⚠️ **This project provides only the backend services.** To run the graphical interface, check the frontend repository:  
> 🔗 https://github.com/roberthcjr/rgit-frontend

### 🔁 Clone the project

```bash
git clone https://github.com/roberthcjr/rgit-backend.git
cd rgit-backend
```

### 🐳 Make sure you have Docker installed:

Install Docker following the official documentation:  
👉 https://docs.docker.com/get-started/get-docker/

---

### ▶️ Run with Docker (recommended)

Use your preferred package manager to run:

```bash
npm run service:up
# or
pnpm run service:up
# or
yarn run service:up
```

To run in **watch/debug mode** (auto-reloads on file save):

```bash
npm run service:watch
# or
pnpm run service:watch
# or
yarn run service:watch
```

To stop the service:

```bash
npm run service:stop
# or
pnpm run service:stop
# or
yarn run service:stop
```

To remove the containers:

```bash
npm run service:down
# or
pnpm run service:down
# or
yarn run service:down
```

---

### 🧪 Run Locally Without Docker

> ⚠️ For local-only environments (without Docker)

Copy the contents of `.env.test` to a new `.env` file, then run:

```bash
npm run start         # Production mode
npm run start:dev     # Development mode
```

```bash
pnpm run start
pnpm run start:dev
```

```bash
yarn run start
yarn run start:dev
```

---

## 📄 API Documentation

Once running, access Swagger at:  
📍 `http://localhost:8080/api`

The Swagger UI includes:
- Endpoint list with input/output schemas
- HTTP status codes
- Example payloads and responses

---

## 💼 Why This Project Matters

- Built with industry-standard tools and design patterns.
- Modular, testable, and production-ready architecture.
- Easy to extend and onboard new developers.
- Ideal for startups or enterprise-level applications.

---

## 📬 Contact

Developed by **Robert Heitor de Carvalho Júnior**  
📧 roberthcjr1999@gmail.com  
🔗 [LinkedIn](www.linkedin.com/in/robert-heitor-de-carvalho)

---
