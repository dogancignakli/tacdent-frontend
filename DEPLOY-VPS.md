# TacDent Frontend — VPS deploy (Docker + Nginx)

Next.js **standalone** build behind Nginx. The .NET API stays on separate hosting (`tac-api.pablika.com`).

## Prerequisites

- VPS with Docker and Docker Compose
- DNS: `tacdent.com` (and optionally `www`) → VPS public IP
- Backend `Cors:Origins` includes `https://tacdent.com`

## 1. Clone and configure

```bash
git clone https://github.com/dogancignakli/tacdent-frontend.git
cd tacdent-frontend
cp .env.production.example .env
# Edit .env with real API URL, site URL, reCAPTCHA, INTERNAL_API_KEY
```

## 2. Build and run (HTTP first)

Docker Compose loads **`.env`** in the project root for `${...}` in `docker-compose.yml` and for the app container. Without it you get "variable is not set" warnings and an empty build.

```bash
docker compose up -d --build
```

Equivalent explicit form:

```bash
docker compose --env-file .env up -d --build
```

- App listens on internal port `3000`
- Nginx exposes `80` (and `443` reserved for SSL later)
- Test: `http://tacdent.com` (or VPS IP until DNS propagates)

### Host Nginx (panel proxies to port 3000)

If Docker only exposes `127.0.0.1:3000` and the **VPS panel / Ubuntu nginx** terminates HTTP(S), that config must proxy **all methods** (GET, POST, **PUT**, **DELETE**, **PATCH**) to Next.js. A common default blocks PUT → admin service edit returns **405**.

Use [nginx/host-proxy.conf.example](./nginx/host-proxy.conf.example). Remove any rule like:

```nginx
if ($request_method !~ ^(GET|HEAD|POST)$) { return 405; }
```

Then `nginx -t && systemctl reload nginx`.

## 3. Enable HTTPS (Let's Encrypt)

While HTTP `app.conf` is active, obtain certificates on the host:

```bash
docker run -it --rm \
  -v tacdent-frontend_certbot-www:/var/www/certbot \
  -v tacdent-frontend_certbot-certs:/etc/letsencrypt \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d tacdent.com -d www.tacdent.com \
  --email you@example.com --agree-tos --no-eff-email
```

Then switch Nginx to SSL:

1. Add certbot volumes to `docker-compose.yml` under `nginx`:

   ```yaml
   volumes:
     - ./nginx/conf.d:/etc/nginx/conf.d:ro
     - certbot-www:/var/www/certbot:ro
     - certbot-certs:/etc/letsencrypt:ro
   ```

2. Add top-level `volumes: certbot-www: certbot-certs:`

3. Replace `nginx/conf.d/app.conf` with content from `nginx/conf.d/app.ssl.conf.example` (update domain if needed)

4. `docker compose up -d nginx`

## 4. Redeploy after code changes

```bash
git pull
docker compose up -d --build
```

If only `NEXT_PUBLIC_*` env vars change, you **must** rebuild (`--build`) — they are embedded at build time.

## 5. Verify

- Home page loads over HTTPS
- `POST /tr/appointments` works (reCAPTCHA + BFF + API)
- Admin login at `/tr/admin/login`
- Browser devtools: no CORS errors to API domain

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| **405 on PUT/DELETE** (admin save) | Host nginx must allow PUT/DELETE/PATCH to `127.0.0.1:3000` — see `nginx/host-proxy.conf.example` |
| CSP blocks API | Rebuild with correct `NEXT_PUBLIC_API_URL` in `.env` |
| 403 on booking/login | `INTERNAL_API_KEY` must match backend `InternalApi:Key` |
| CORS errors | Backend `Cors:Origins` must include site URL |
| 502 Bad Gateway | `docker compose logs app` — app container not healthy |
| SSL nginx fails | Certificates missing; use HTTP `app.conf` until certbot succeeds |

## Compose from URL (hosting panel)

Point the panel at this repo. On the server, create **`.env`** from `.env.production.example` before `docker compose up --build`.
