# KiwiCare – Admin Dashboard

A full-stack admin dashboard for the KiwiCare platform — a service-provider marketplace connecting customers and
providers across New Zealand. Built with the Next.js App Router.

---

## Features

- **Dashboard overview** — revenue chart, KPI cards, and latest invoices
- **Invoice management** — create, edit, delete, and search invoices with pagination
- **Order management** — searchable order list with map-based route visualisation (Mapbox)
- **User management** — search, filter by role, and update account status
- **Authentication** — admin-only credentials login via NextAuth (JWT sessions)
- **Email verification** — one-time token workflow for new user sign-ups
- **Responsive design** — mobile-first layout with Tailwind CSS
- **Type-safe** — strict TypeScript throughout; Zod validation on all form inputs

---

## Tech Stack

| Layer      | Technology                             |
|------------|----------------------------------------|
| Framework  | Next.js 15 (App Router)                |
| Language   | TypeScript (strict mode)               |
| Styling    | Tailwind CSS 3                         |
| Database   | PostgreSQL (Neon serverless)           |
| DB client  | `postgres` (raw parameterised SQL)     |
| Auth       | NextAuth 5 (credentials provider, JWT) |
| Validation | Zod                                    |
| Maps       | Mapbox GL                              |
| Testing    | Vitest + jsdom                         |
| Deployment | Vercel                                 |

---

## Project Structure

```
kiwi-care/
├── app/
│   ├── dashboard/
│   │   ├── (overview)/        # Dashboard home — cards, chart, latest invoices
│   │   ├── invoices/          # Invoice list, create, and edit pages
│   │   ├── orders/            # Order list and order detail pages
│   │   └── users/             # User management page
│   ├── db/
│   │   ├── create-database.sql
│   │   └── populate-database.sql
│   ├── lib/
│   │   ├── actions.ts         # Server actions (mutations)
│   │   ├── data.ts            # Server-side data fetching (reads)
│   │   ├── db.ts              # Shared PostgreSQL client
│   │   ├── definitions.ts     # Shared TypeScript types & enums
│   │   ├── utils.ts           # Pure helper functions
│   │   ├── validations.ts     # Zod schemas
│   │   └── __tests__/        # Unit tests (Vitest)
│   ├── login/
│   ├── ui/                    # Reusable UI components
│   └── verify-email/
├── public/
├── types/
├── auth.ts                    # NextAuth provider & JWT callbacks
├── auth.config.ts             # Edge-compatible auth config (used by middleware)
├── auth_token.ts              # getCurrentUserId() helper
├── middleware.ts              # Route protection
└── vitest.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A PostgreSQL database (e.g. [Neon](https://neon.tech))
- A [Mapbox](https://mapbox.com) account for the public access token

### 1. Clone the repository

```bash
git clone https://github.com/your-org/kiwi-care.git
cd kiwi-care
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root (never committed):

```env
# PostgreSQL connection string (Neon or any PostgreSQL provider)
DB_HOST=postgres://user:password@host/dbname

# NextAuth secret — generate with: openssl rand -base64 32
AUTH_SECRET=your-secret-here

# Mapbox public access token
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token_here
```

### 4. Set up the database

Run the SQL scripts against your database in order:

```bash
# 1. Create tables and indexes
psql $DB_HOST -f app/db/create-database.sql

# 2. (Optional) Seed with sample data
psql $DB_HOST -f app/db/populate-database.sql
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) or the live deployment
at [kiwicare-git-main-vincents-projects-8301af1f.vercel.app](https://kiwicare-git-main-vincents-projects-8301af1f.vercel.app)
and log in with one of the test accounts below.

---

## Test Accounts

All accounts share the same password: `Abc123456?`

| Role     | Email              | Password   |
|----------|--------------------|------------|
| Admin    | admin@kiwicare.com | Abc123456? |
| Admin    | lee@robinson.com   | Abc123456? |
| Customer | user@nextmail.com  | Abc123456? |
| Provider | delba@oliveira.com | Abc123456? |

> **Note:** The dashboard is admin-only. Customer and provider accounts will be redirected away on login.

---

## Running Tests

```bash
# Run all tests once
pnpm test

# Watch mode (re-runs on file changes)
pnpm test:watch

# Generate a coverage report
pnpm test:coverage
```

Tests live in `app/lib/__tests__/` and cover utility functions, Zod validation schemas, and server actions (with a
mocked database)

---

## Database Schema

The main tables and their relationships:

| Table               | Purpose                                                   |
|---------------------|-----------------------------------------------------------|
| `users`             | All platform users (customer / provider / admin)          |
| `customers`         | Customer-specific profile data                            |
| `providers`         | Provider-specific profile data                            |
| `services`          | Service catalogue                                         |
| `provider_services` | Services offered by each provider (with price & duration) |
| `orders`            | Service bookings with location, route, and payment data   |
| `invoices`          | Financial records linked to orders or created manually    |
| `reviews`           | Post-order ratings and comments                           |
| `notifications`     | Push / email / SMS notification records                   |
| `user_devices`      | Device tokens for push notifications                      |
| `pending_users`     | Email verification queue                                  |

All monetary amounts are stored as **integer cents** and converted to dollars at the application layer.

---

## Deployment

The project is deployed on [Vercel](https://kiwicare-git-main-vincents-projects-8301af1f.vercel.app/) with automatic
CI/CD on every push to `main`.

Set the environment variables (`DB_HOST`, `AUTH_SECRET`, `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`) in the Vercel project
settings — do **not** commit `.env.local` or any file containing real credentials.
