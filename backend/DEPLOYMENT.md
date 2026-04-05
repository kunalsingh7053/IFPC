# Backend Deployment Checklist

Use this checklist before deploying the backend.

## 1) Required environment variables

Create `.env` in `backend/` with at least:

- `NODE_ENV=production`
- `PORT=3000` (or your host-provided port)
- `MONGO_URI=...`
- `JWT_SECRET=...`
- `FRONTEND_URLS=https://ifpc.netlify.app`

Optional (needed for image upload features):

- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `IMAGEKIT_URL_ENDPOINT`

You can copy from `.env.example`.

## 2) Install dependencies

```bash
npm install
```

## 3) Start backend

```bash
npm start
```

The API health endpoint should return 200:

- `GET /api/health`

## 4) Quick local verification

In another terminal:

```bash
npm run healthcheck
```

## 5) Hosting notes

- Ensure host opens your backend port (or maps it automatically).
- Ensure MongoDB network access allows your host IP.
- Keep `FRONTEND_URLS` exactly matching frontend origins (comma-separated for multiple domains).
