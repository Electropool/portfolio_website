# Electropool Portfolio

Personal portfolio site maintained by Electropool. It uses Next.js, SQLite visitor analytics, and a protected admin dashboard.

## Local development

```bash
npm install
npm run dev
```

The development server uses `http://127.0.0.1:3001`.

## Production

1. Copy `.env.example` to `.env` and set unique admin credentials plus a 32+ character `ADMIN_SESSION_SECRET`.
2. Build the app: `npm run build`.
3. Start it with PM2:

   ```bash
   PM2_HOME="$PWD/.pm2" pm2 startOrReload ecosystem.config.cjs --only electropool-portfolio
   PM2_HOME="$PWD/.pm2" pm2 save
   ```

The server binds only to `127.0.0.1:3001`; it must be placed behind the included Nginx proxy. Application and PM2 logs are written to `logs/`, while SQLite data defaults to `data/`. Neither directory is tracked by Git.

## Nginx and TLS

The deployment-ready block is [deploy/nginx/electropool.online.conf](deploy/nginx/electropool.online.conf). It redirects HTTP to HTTPS, terminates the existing Let's Encrypt certificate, adds browser security headers, and proxies to port 3001.

Install it only after confirming the certificate paths:

```bash
sudo install -m 644 deploy/nginx/electropool.online.conf /etc/nginx/sites-available/electropool.online.conf
sudo ln -s /etc/nginx/sites-available/electropool.online.conf /etc/nginx/sites-enabled/electropool.online.conf
sudo nginx -t && sudo systemctl reload nginx
```

## Admin

Use `/admin` or `/login`. Successful and failed auth activity, visitor record outcomes, admin-log access, and backend failures are recorded as structured JSON lines in `logs/application.log`; credentials, session tokens, and visitor IPs are never written there.
