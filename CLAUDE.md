# Álláskeresők Digitális Kiskönyve (ÁDK)

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.
Payload-kérdésekben mindig ezt a skillt nézd meg először, mielőtt emlékezetből írnál kódot.

Demóprojekt az IdomSoft Senior Frontend Developer interjúhoz: a papír „Álláskeresők kiskönyve” digitális változata.
A teljes háttér, az adatmodell és a teendők a `docs/project-summary.md` fájlban vannak, ezt olvasd el munka előtt.

A gazdám (Richárd) tapasztalt React/Next.js fejlesztő, de a Payload, a Docker és a web komponensek újak neki.
Magyarázd el a döntéseket, ne csak írd meg a kódot. Magyarul kommunikálj, a kódban angol neveket használj.

## Stack

- Next.js + Payload 3 egy appban (`app/(payload)` az admin és az API, `app/(frontend)` a saját oldalak)
- Postgres (`postgresAdapter`, `idType: 'uuid'`)
- Lokálisan Docker Compose (`digi-kiskonyv` projekt): Postgres 17 + Mailpit (`localhost:8025`); az app natívan fut (`pnpm dev`)
- Élesben Vercel + Neon
- UI: DÁP Design System (`dap-design-system`, Lit web komponensek), layouthoz Tailwind a DÁP design tokenekre kötve
- Tesztek: Vitest, Playwright + axe
- Kriptográfia: `jose` (QR-token HS256, aláírt igazolás Ed25519)

## Szabályok

- A `payload-types.ts` generált fájl. Soha ne szerkeszd kézzel; configváltozás után `pnpm payload generate:types`.
- A Local API alapból `overrideAccess: true`. Az állampolgár nevében mindig `user` + `overrideAccess: false`.
- A jogosultság az adatrétegben él (collection és mező szintű access), nem a UI-ban.
- Az `attendances` collection csak létrehozható; update és delete senkinek nincs.
- Lokálisan push mód; sémaváltozás után `payload migrate:create`, a generált migrációt át kell nézni (átnevezés = törlés + létrehozás lehet).
- `migrate:fresh` és seed csak `VERCEL_ENV === "preview"` esetén futhat. Prod adat soha nem kerül preview-ba.
- Csak kitalált adatok, csak `@example.com` címek. Állami logó nem használható, a DÁP-belépés egyértelműen demóként jelölve.
- A Payload 3 API gyorsan változik: a `login`, `auth`, az egyedi auth strategy és a migrációs parancsok pontos formáját a Payload skillben, illetve a telepített verzió dokumentációjában ellenőrizd, mielőtt használod.

## Parancsok

- `docker compose up -d` / `docker compose ps` / `docker compose down` (`-v` = adatbázis törlése)
- `docker compose exec postgres psql -U payload -d <db>` → `\dt`, `\d <tábla>`
- `pnpm dev`
