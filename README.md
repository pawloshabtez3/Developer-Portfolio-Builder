# Developer Portfolio Builder

A full-stack Developer Portfolio Builder with a private dashboard and a public portfolio page.

## Tech Stack
- Frontend: Next.js (App Router, TypeScript, Tailwind CSS)
- Backend: Node.js, Express
- Database: MongoDB + Mongoose
- Auth: JWT stored in httpOnly cookies

## Setup

### 1) Backend

Create a .env file in backend/ using backend/.env.example as a guide.

```bash
cd backend
npm install
npm run dev
```

### 2) Frontend

Create a .env.local file in frontend/ using frontend/.env.local.example as a guide.

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000 and backend on http://localhost:5000.

## Features
- Authentication (register, login, logout) with httpOnly cookies
- Dashboard CRUD for profile, skills, projects, experience
- Public portfolio page at /[username]
- Profile completion indicator
- Sorting and reordering for projects and experience
- Public/private toggle for projects
# Developer-Portfolio-Builder
