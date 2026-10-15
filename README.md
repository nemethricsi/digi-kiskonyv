# Álláskeresők Digitális Kiskönyve (demo)

A **proof of concept** for a digital version of the Hungarian paper "job seeker's booklet" (_Álláskeresők kiskönyve_). Registered job seekers must report to the employment office on set dates, and the office's stamp in the booklet is their only proof that they showed up. The paper booklet is easy to lose, and the stamp lives on paper only.

![Álláskeresők Digitális Kiskönyve](<src/app/(frontend)/opengraph-image.png>)

> **Demo only.** All data is fictional, e-mail addresses are `@example.com`, and the "DÁP bejelentkezés" button is a mock.

> [!TIP]
> **Why did I build this?**
>
> I've received several of these booklets myself, and lost more than one. It's a small paper booklet that's easy to misplace, and losing it has no real consequence: you simply get a new one. Yet it's the only proof in your hands that you attended a mandatory appointment.
>
> That single purpose is what I wanted to preserve in digital form: proof of attendance that stays with you, can't be lost, and can be verified on your side too.

## What it shows

- **Next.js (App Router) + Payload CMS.** Payload provides the admin UI, auth, access control, hooks and the database layer; the citizen pages are plain Next.js routes using the Payload Local API and server actions.
- [**DÁP Design System**](https://services.gov.hu/design-system-dev) Used on the citizen side, with Tailwind for layout only, bound to the DÁP design tokens.
- **Postgres** Docker locally, [Neon](https://neon.com/) in production.
- **Access control in the data layer**, not in the UI: collection and field level rules, server-side checks in every server action.
- **Vitest** for the pure logic.

## How to use it

On the frontend there is only one demo `citizen` (Gipsz Jakab), that's loaded automatically.

Users for the `Payload admin`:

- Clerk:
  email: `clerk@example.com`
  pwd: `pass.pass`

- Admin:
  email: `admin@example.com`
  pwd: `pass.pass`

You can start over any time by being logged-in with the `admin` user and reset database from the Payload admin. Note that _Forgot password_ is not functional in production.

### Steps

1. Go to the [home page](https://digi-kiskonyv.vercel.app/) and login with the fake "DÁP bejelentkezés". You should see the demo citizen (Gipsz Jakab) details.
2. Start a registration with the `Jelentkezés` button.
3. Login to the [Payload backend](https://digi-kiskonyv.vercel.app/admin) with the `Clerk` user. Find the pending Registration and **Approve** it with a **start date**.
4. Go back to the [`/dap/me`](https://digi-kiskonyv.vercel.app/dap/me) page, refresh and note your registration is accepted and you have a list of appointments.
5. When "at the appointment", use the `Pecsét` button to generate a short living unique QR code and "show it" to the clerk.
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
- A stamp can only be created, never edited or deleted. Only a stamp can mark an appointment as attended, and only once.

## Decisions & Limitations

**A short code instead of a JWT in the QR code.** Clerks sit at a desktop and may not have a camera. A barcode scanner, however, behaves like a keyboard: it types the content and presses Enter. A 6-digit code works with a scanner, with a webcam, and can be read out loud and typed. A JWT cannot be typed, and it makes a dense QR code that is hard to scan from a phone screen.

**The QR code is rendered on the server.** The server action returns an SVG data URI for an `<img alt>`. The QR library stays out of the client bundle, and no `dangerouslySetInnerHTML` is needed.

**One appointment per citizen, no many-to-many.** In reality one session at the office invites many people. The realistic model would be an `events` collection with `appointments` as the join table, and the stamp would still point at the per-person record. That only makes the clerk side more realistic and would not change anything the citizen sees, so the demo keeps the simpler model.

## Running locally

Requirements: Node ≥ 20.18, pnpm 11, Docker.

```bash
cp .env.example .env            # set PAYLOAD_SECRET (openssl rand -hex 32)
docker compose up -d            # Postgres 17 + Mailpit (http://localhost:8025)
pnpm install
pnpm seed                       # admin user from SEED_ADMIN_* + the demo citizen
pnpm dev                        # http://localhost:3000
```
