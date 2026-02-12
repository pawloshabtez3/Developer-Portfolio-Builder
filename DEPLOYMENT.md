# Deployment Guide (Render + Vercel)

This guide summarizes how to deploy the backend to Render and the frontend to Vercel for this repo.

## Backend: Render (Node/Express Web Service)

**Service type**
- Use a **Web Service** (public URL).

**Repo connection**
- Render Dashboard -> New -> Web Service -> Build and deploy from a Git repository.

**Monorepo root**
- Set **Root Directory** to `backend` so Render only builds the backend folder.
- If you use a Blueprint later, set `rootDir: backend`.

**Build and start commands**
- Use the commands you run locally.
- Typical values from Render docs:
  - Build: `npm install` (or `yarn`, `pnpm install`)
  - Start: `npm start` (or `node app.js` / `node src/server.js`)

**Port binding**
- Bind your Express app to `0.0.0.0` and `process.env.PORT`.
- Render expects `PORT` (default `10000`).

**Environment variables**
- Configure in the service Environment tab.
- Set items like database URL, JWT secrets, and third-party keys.
- Render also provides default variables like `PORT`, `RENDER_EXTERNAL_URL`, `RENDER`.

**Auto-deploys**
- By default, Render redeploys on each commit to the linked branch.
- You can switch to “After CI checks pass” or “Off”.

**Zero-downtime deploys**
- Render replaces instances without downtime unless you attach a persistent disk.
- Optional health check path helps validate readiness.

**Docs**
- Deploy a Node Express App on Render: https://render.com/docs/deploy-node-express-app
- Web Services: https://render.com/docs/web-services
- Deploys: https://render.com/docs/deploys
- Blueprint spec: https://render.com/docs/blueprint-spec

## Frontend: Vercel (Next.js)

**Project type**
- Use a Vercel Project for Next.js.

**Repo connection**
- Vercel Dashboard -> New Project -> Import the repo.

**Monorepo root**
- Set **Root Directory** to `frontend`.
- Vercel supports multiple projects per repo for monorepos.

**Build/output**
- Vercel auto-detects Next.js; no custom output directory is typically required.

**Deploy method**
- **Git-based** (recommended):
  - Push to production branch (usually `main`) -> Production deployment.
  - Other branches -> Preview deployments.
- **CLI**:
  - `vercel --prod` for production deploys.

**Environment variables**
- Configure in Project Settings -> Environment Variables.
- Set per environment (Production/Preview/Development).
- Use `vercel env pull` to create `.env.local` locally.
- For API calls, set `NEXT_PUBLIC_API_BASE_URL` to the Render URL.

**Docs**
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
- Deployments overview: https://vercel.com/docs/deployments/overview
- Environments: https://vercel.com/docs/deployments/environments
- Environment variables: https://vercel.com/docs/projects/environment-variables
- Git integrations: https://vercel.com/docs/git

## Suggested Deployment Flow

1. Deploy backend on Render
   - Create Web Service -> connect repo -> Root Directory `backend`
   - Build command `npm install` (or your script)
   - Start command `npm start` (or your actual entry)
   - Add env vars
   - Confirm Express binds to `process.env.PORT`

2. Deploy frontend on Vercel
   - Import repo -> Root Directory `frontend`
   - Add env vars (e.g., `NEXT_PUBLIC_API_BASE_URL` -> Render URL)
   - Deploy

## Common Gotchas

- Render requires binding to `0.0.0.0` and using `PORT` (default `10000`).
- Render keeps the last successful deploy running if a new build fails.
- Vercel env var changes only apply to new deployments.
- Preview env vars can differ from Production, so set them explicitly.
