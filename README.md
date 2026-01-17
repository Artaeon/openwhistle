# OpenWhistle

A self-hosted whistleblower platform built for SMEs to comply with the EU Whistleblower Directive (2019/1937) and the German Hinweisgeberschutzgesetz (HinSchG).

## Why OpenWhistle?

Companies with 50+ employees are legally required to provide an internal reporting channel. Commercial solutions charge €200-500/month. OpenWhistle gives you the same functionality for free.

- **Anonymous reporting** — No IP logging, no tracking cookies, no metadata collection
- **Secure communication** — End-to-end encrypted message exchange between whistleblowers and compliance officers
- **Legal compliance** — Built-in 7-day confirmation deadline tracking per HinSchG §17
- **Whitelabel ready** — Customize company name and branding from the admin panel

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Artaeon/openwhistle.git
cd openwhistle

# Copy environment template
cp .env.example .env

# Edit .env and set your secrets
# JWT_SECRET and ADMIN_INIT_PASSWORD are required

# Start with Docker (development)
docker compose -f docker-compose.local.yml up --build -d
```

Open `http://localhost:3001` — that's it.

Default admin login: `admin` / check your `.env` file for `ADMIN_INIT_PASSWORD`

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   React SPA     │────▶│  Express API    │
│   (Port 3001)   │     │   (Port 3000)   │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │    SQLite DB    │
                        │  (Persistent)   │
                        └─────────────────┘
```

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Express.js, Prisma ORM, JWT auth
- **Database:** SQLite (works out of the box, no setup required)
- **Deployment:** Docker Compose with Traefik reverse proxy

## Features

### For Whistleblowers
- Submit reports anonymously with file attachments
- Receive a unique case ID and security PIN
- Check status and communicate with the compliance team

### For Administrators
- Dashboard with HinSchG deadline warnings
- Secure messaging with whistleblowers
- Export case protocols as PDF for legal archiving
- Multi-user support with role-based access
- Whitelabel settings (company name, welcome text)

## Configuration

All configuration is done via environment variables:

```bash
# Required
JWT_SECRET=your-secret-key-here
ADMIN_INIT_PASSWORD=your-admin-password

# Optional: Email notifications
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-user
SMTP_PASS=your-password
SMTP_FROM=meldestelle@yourcompany.com
APP_URL=https://meldestelle.yourcompany.com
```

## Production Deployment

For production, use the main `docker-compose.yml` with Traefik:

```bash
# Set your domain
export DOMAIN_NAME=meldestelle.yourcompany.com

# Deploy
docker compose up -d
```

SSL certificates are handled automatically via Let's Encrypt.

## Testing

End-to-end tests with Playwright:

```bash
cd e2e
npm install
npx playwright install chromium
npm test
```

## Security

OpenWhistle is designed with privacy as the default:

- No IP address logging
- No analytics or tracking
- File uploads sanitized with random UUIDs
- Rate limiting on all endpoints
- Passwords hashed with bcrypt (cost factor 12)

## Contributing

PRs welcome. Please open an issue first to discuss major changes.

## License

MIT

---

Built for compliance. Designed for privacy.
