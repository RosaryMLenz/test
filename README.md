# Rainforest21 Automotive

Rainforest21 Automotive is a Next.js application for the public shop website and its protected administration tools. The admin area manages appointments and digital vehicle inspections, including drafts, printable PDFs, and automatically generated repair-order numbers.

## Local setup

Requirements:

- Node.js 20.19 or newer
- npm
- A PostgreSQL database

Install and configure the project:

```bash
npm install
cp .env.example .env.local
npm run db:migrate:deploy
npm run dev
```

Open `http://localhost:3000`. Environment values belong in `.env.local`; real credentials must never be committed.

## Database

The application uses PostgreSQL through Prisma. `DATABASE_URL` is used by the running application. `DATABASE_URL_UNPOOLED` is preferred for migrations when the database provider supplies it.

Both GitHub repositories contain application source only. To use the same customer records, each deployment must be configured with the same approved database URLs. Copying or cloning the repository does not copy the database.

Use `sslmode=verify-full` in PostgreSQL connection strings so the server certificate and hostname are verified. If your database provider supplies a different connection-string format, follow its current TLS guidance.

Vercel deployments run `prisma migrate deploy` before building, using `DATABASE_URL_UNPOOLED` or `POSTGRES_URL_NON_POOLING` when available. This keeps each linked Vercel project's database schema synchronized with the committed migration history.

Useful commands:

```bash
npm run db:migrate:status
npm run db:migrate:deploy
npm run db:studio
```

To create or reset an administrator, set `ADMIN_SEED_NAME`, `ADMIN_SEED_EMAIL`, and a password of at least 12 characters in `.env.local`, then run:

```bash
npm run db:seed-admin
```

## Validation

Run these checks before publishing:

```bash
npm run lint
npm audit --omit=dev
npm run build:cloudflare
```

The Cloudflare build produces the deployable OpenNext bundle used by the private Sites deployment.
