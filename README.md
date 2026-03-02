# WidiTutor

An AI-powered learning platform that helps students and self-learners understand educational video content faster through transcript extraction, smart summaries, adaptive quizzes, and contextual chat.

## Project Preview

![Home Screen](./frontend/src/assets/readme/home.png)
![Chat Screen](./frontend/src/assets/readme/chat.png)

## Description

WidiTutor centralizes modern learning workflows in one web application. Users can authenticate securely, explore learning content, generate concise summaries, create quizzes from transcripts, and interact with an AI assistant to reinforce understanding.

The platform is built as a full-stack architecture with a React frontend and an Express backend connected to MongoDB, plus billing and media integrations for production-ready usage.

## Features

- Secure authentication with email/password and Google OAuth
- Email verification and password reset flows
- Protected profile management with avatar upload
- AI-assisted learning workflow:
  - Video search
  - Transcript retrieval
  - Summary generation
  - Quiz generation
  - Contextual chat
- Stripe subscription and billing flows
- Plan-based feature entitlements (usage limits)
- Production-focused backend security (helmet, rate limiting, CORS, JWT)

## Tech Stack

- Frontend: React 19, Vite, React Router, Tailwind CSS
- Backend: Node.js, Express 5, Mongoose
- Database: MongoDB
- Payments: Stripe
- Media: Cloudinary
- DevOps: Docker Compose

## Project Structure

```bash
widiTutor_dev/
|-- express/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- helpers/
|   |   |-- middleware/
|   |   |-- model/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- utils/
|   |   `-- validation/
|   |-- index.js
|   |-- example.env
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- utils/
|   |-- Dockerfile
|   `-- package.json
|-- docker-compose.yml
|-- LICENSE
`-- README.md
```

## Environment Variables

Create `express/.env` from `express/example.env` and configure at least:

```env
MONGO_URI=
JWT_SECRET=
SESSION_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Common optional backend variables:

```env
PORT=5000
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_YEARLY=
```

Frontend variables (`frontend/.env`):

```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=
```

## Installation and Run

### Prerequisites

- Node.js 18+
- npm
- MongoDB (local or Atlas)
- Docker + Docker Compose (optional)

### Local development

1. Backend

```bash
cd express
npm install
npm run dev
```

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### Docker

```bash
docker compose up --build
```

## API Highlights

- Auth: `/api/auth/*`
- AI routes: `/api/generate-summary`, `/api/generate-quiz`, `/api/chat`, `/api/search-videos`, `/api/get-transcript`
- Billing: `/api/billing/*`
- Health: `/health`

## Design

![Figma Design](./frontend/src/assets/readme/figma.PNG)

## Team Contributions

![Contributors](./frontend/src/assets/readme/Contributers.png)

## Architecture Overview

![Architecture](./frontend/src/assets/readme/architecture.png)

## Notes

- `fastapi/` is intentionally not included in this repository for protection reasons.
- AI endpoints can require a private/internal FastAPI service in your deployment architecture.
- Deployment link is not available yet.
- Jira links are intentionally not included.

## Team

- Marwan Traiki: marwantraiki@gmail.com
- Anas: anas@gmail.com
- Mohamed: mohamed@gmail.com
- Hamza: hamza@gmail.com

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
