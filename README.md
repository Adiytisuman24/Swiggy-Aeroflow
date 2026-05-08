# Aeroflow: Autonomous Consumption Intelligence for Swiggy MCP

Aeroflow transforms food delivery from a reactive marketplace into an intelligent ambient infrastructure that predicts, orchestrates, and fulfills human consumption needs before users explicitly request them.

## 🚀 Vision

Aeroflow minimizes decision fatigue and cognitive overhead by proactively orchestrating meals, groceries, and dining reservations based on routines, habits, and passive signals.

## 🏗 Architecture

- **Frontend**: Next.js (TypeScript) + TailwindCSS + Framer Motion (Premium Glassmorphic UI)
- **Orchestration Layer**: Go (Golang) for high-concurrency MCP orchestration
- **Intelligence Layer**: Python (FastAPI + gRPC) for behavioral modeling and AI multi-agent systems
- **Infrastructure**: Docker Compose, PostgreSQL, Redis, Vector DB

## 🛠 Project Structure

- `web/`: Next.js frontend
- `core/`: Go backend orchestration
- `ai/`: Python AI intelligence layer
- `proto/`: gRPC service definitions
- `docker-compose.yml`: Multi-service orchestration

## 🚦 Getting Started

1. Ensure you have Docker installed.
2. Run `docker-compose up --build`.
3. Access the dashboard at `http://localhost:3000`.

## ✨ Core Features

- **Intelligence Playground**: Interactive multi-agent orchestration console (`/intelligence`).
- **Living Dynamic Cart**: A behavioral cart that evolves based on routines (`/cart`).
- **Predictive Replenishment**: Grocery depletion forecasting with auto-order logic (`/grocery`).
- **Ecosystem Architecture**: Deep dive into the technical stack and agent negotiation flow (`/ecosystem`).
- **Autonomous Multi-Agent AI**: Specialized agents for Nutrition, Budget, Timing, and Social coordination.

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TailwindCSS 4, Framer Motion, Lucide Icons.
- **Backend**: Go (Orchestration), Python/FastAPI (Intelligence), gRPC.
- **Data**: PostgreSQL, Redis.

---
Built with ❤️ for Swiggy MCP.
