# Álláskeresők Digitális Kiskönyve (demo)

A digital version of the Hungarian paper "job seeker's booklet" (_Álláskeresők kiskönyve_). Registered job seekers must report to the employment office on set dates, and the office's stamp in the booklet is their only proof that they showed up. The paper booklet is easy to lose, and the stamp lives on paper only.

![Álláskeresők Digitális Kiskönyve](<src/app/(frontend)/opengraph-image.png>)

This app keeps both jobs of the booklet: it **reminds** the citizen of the next required appointment, and it gives them **proof** of attendance on their side.

> **Demo only.** All data is fictional, e-mail addresses are `@example.com`, and the "Sign in with DÁP" button is a mock.

## What it shows

- **Next.js (App Router) + Payload CMS 3 in one app.** Payload provides the admin UI, auth, access control, hooks and the database layer; the citizen pages are plain Next.js routes using the Payload Local API and server actions.
- **DÁP Design System** Used on the citizen side, with Tailwind for layout only, bound to the DÁP design tokens.
- **Postgres** Docker locally, Neon in production.
- **Access control in the data layer**, not in the UI: collection and field level rules, server-side checks in every server action.
- **Vitest** for the pure logic.

## How to use it

On the frontend ther is only one demo user, that's loaded automatically.

Users for the `Payload admin`:

- Clerk:
  email: `clerk@example.com`
  pwd: `pass.pass`

- Admin:
  email: `admin@example.com`
  pwd: `pass.pass`

You can start over any time by being logged-in with the `admin` user and reset database from the Payload admin.

### Steps

1. Go to the home page and login with the fake "DÁP bejelentkezés". You should see the demo citizen (Gipsz Jakab) details.
2. Start a registration with the `Jelentkezés` button.
3. Login to the Payload backend with the `Clerk` user. Find the pending Registration and **Approve** it with a **start date**.
4. Go back to the [`/dap/me`](https://digi-kiskonyv.vercel.app/dap/me) page, refresh and note your registration is accepted and you have a list of appointments.
5. When at the appointment, use the `Pecsét` button to generate a short living unique QR code and "show it" to the clerk.
6. On the Payload admin, as a clerk, go to [Megjelenés rögzítése](https://digi-kiskonyv.vercel.app/admin/check-in), type the code or read the QR code with a reader.
7. Attendance should be registered.

## Features

**Citizen (`/dap/me`, behind the mock DÁP sign-in)**

- Personal details, applying for registration as a job seeker, and the status of the application.
- The required appointments of an approved registration with their status.
- **Check-in code:** for the next appointment the citizen opens a QR code plus a 6-digit code. It is valid for 60 seconds and refreshes automatically.

**Clerk (Payload admin, `/admin`)**

- Reviewing registrations. On approval, three appointments are created automatically (first one a week after the start date, then monthly).
- **Recording attendance (the "stamp")** on `/admin/check-in`: scan the QR code or type the 6 digits. The attendance is visible to the citizen right away.
- Manual fallback: the stamp can also be recorded from the appointment page without a code (e.g. the citizen's phone is dead). The method (`code` / `manual`) is stored.
- A stamp can only be created, never edited or deleted. Only a stamp can mark an appointment as attended, and only once.

## Decisions

**A short code instead of a JWT in the QR code.** Clerks sit at a desktop and may not have a camera. A barcode scanner, however, behaves like a keyboard: it types the content and presses Enter. A 6-digit code works with a scanner, with a webcam, and can be read out loud and typed. A JWT cannot be typed, and it makes a dense QR code that is hard to scan from a phone screen. The trade-off is server state (one row per code) and a small code space. This is mitigated by a 60-second lifetime, single use (the code is deleted when redeemed), and the clerk having to be signed in.

**Codes are invisible in the admin.** The `check-in-codes` collection is closed on every API, and only server code reaches it. A clerk cannot read a code and stamp an attendance without the citizen being there.

**The QR code is rendered on the server.** The server action returns an SVG data URI for an `<img alt>`. The QR library stays out of the client bundle, and no `dangerouslySetInnerHTML` is needed.

**One appointment per citizen, no many-to-many.** In reality one session at the office invites many people. The realistic model would be an `events` collection with `appointments` as the join table, and the stamp would still point at the per-person record. That only makes the clerk side more realistic and would not change anything the citizen sees, so the demo keeps the simpler model.

**Denormalized `citizen` on appointments and attendances.** Hooks copy it from the registration, which keeps the citizen's read access a simple `citizen equals user.id`.

**Hooks over UI checks.** Approval creates appointments in the same transaction (`req` passed through), so a failure rolls back the approval too. The attendance hook marks the appointment attended through a `req.context` flag, which is the only way to reach that status.

## Limitations

- **Mock sign-in.** `/dap/me` shows the most recently created citizen, without real authentication. Everyone who opens the demo sees the same citizen. Real DÁP (eID) integration would replace this with a Payload auth strategy.
- **Registration state machine not enforced yet.** Allowed status transitions, a required start date on approval, and one active registration per citizen are not validated in the admin yet. For example, re-approving a registration creates its appointments again.
- **No time window for check-in.** The code is offered for the next scheduled appointment, regardless of its date. In production it would be limited to the day of the appointment.
- **No rate limiting** on code redemption. The short lifetime makes guessing unlikely, but production would need it.
- **Not built yet:** signed attendance certificate (Ed25519 JWS + public verification page), rejected and closed states on the citizen page, end-to-end tests (Playwright + axe).

## Running locally

Requirements: Node ≥ 20.18, pnpm 11, Docker.

```bash
cp .env.example .env            # set PAYLOAD_SECRET (openssl rand -hex 32)
docker compose up -d            # Postgres 17 + Mailpit (http://localhost:8025)
pnpm install
pnpm seed                       # admin user from SEED_ADMIN_* + the demo citizen
pnpm dev                        # http://localhost:3000
```

- Citizen side: `/login` → "DÁP mobilalkalmazás" (simulated sign-in) → `/dap/me`. Admin: `/admin` with the seeded admin user.
- Locally the database schema is applied in Payload's **push mode**. After a schema change, create a migration with `pnpm migrate:create <name>` and review it before committing.
- Reset the local database: `docker compose down -v`, then run the steps above again.
- After config changes: `pnpm generate:types` (and `pnpm generate:importmap` for admin components).
- Checks: `pnpm lint`, `pnpm fmt:check`, `npx vitest run tests/unit`.

## Deployment

Vercel + Neon. `scripts/vercel-build.mjs` runs pending migrations in production. On preview deployments it rebuilds the schema and seeds fictional data (`migrate:fresh` + seed). Production data never reaches preview.
