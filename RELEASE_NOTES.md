# OpenWhistle v1.0.0 Release Notes

**Release Date:** January 2026

---

## Overview

OpenWhistle v1.0.0 is the first stable release of our open-source whistleblower platform. This release provides a complete, production-ready solution for companies to comply with the EU Whistleblower Directive (2019/1937) and the German Hinweisgeberschutzgesetz (HinSchG).

---

## Features

### Anonymous Reporting
- Submit reports without creating an account
- No IP address logging or tracking cookies
- File attachments with secure UUID-based storage
- Report categories (Corruption, Theft, Harassment, Data Protection, Other)

### Secure Whistleblower Portal
- Unique case ID (WH-XXX-XXX) and security PIN for each submission
- Check report status and view admin responses
- Secure two-way messaging with compliance officers
- Full message history with timestamps

### Admin Dashboard
- Overview of all cases with status indicators
- HinSchG-compliant 7-day confirmation deadline tracking
- Visual deadline warnings (amber at 5 days, red at 7+ days)
- One-click confirmation sending to whistleblowers
- PDF export for legal archiving

### Multi-User Administration
- Super admin and regular admin roles
- User management (create/delete admin users)
- Email notifications for new reports (optional)

### Whitelabel Settings
- Customizable company name
- Configurable welcome text
- Branding visible across all public pages

### Automated Backups
- Daily SQLite backups at 03:00 AM
- 30-day retention policy with automatic cleanup
- Persistent volume for backup storage

### German Localization
- Full German UI translation
- Impressum (legal notice) page
- Datenschutzerklärung (privacy policy) page
- HinSchG compliance messaging

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| Backend | Express.js, Prisma ORM |
| Database | SQLite |
| Auth | JWT with bcrypt password hashing |
| Deployment | Docker Compose, Traefik |

---

## Security Features

- Helmet.js HTTP security headers
- Content Security Policy (CSP)
- Rate limiting on all endpoints
- XSS and CSRF protection
- No-log policy (IP addresses never stored)
- bcrypt password hashing (cost factor 12)

---

## Testing

- End-to-end tests with Playwright
- Security test suite for auth bypass, session handling, and XSS

---

## Known Limitations

- SQLite database (suitable for most SMEs, consider PostgreSQL for high-volume deployments)
- Single-tenant architecture (one company per installation)
- Email notifications require SMTP configuration

---

## Upgrade Path

This is the initial release. Future versions will include:
- PostgreSQL support
- Optional external file storage (S3-compatible)
- Additional language packs
- Advanced reporting analytics

---

## Installation

See [README.md](README.md) for installation instructions.

---

## License

MIT License

---

**Thank you for using OpenWhistle!**

Report issues: https://github.com/Artaeon/openwhistle/issues
