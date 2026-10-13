# Digitális álláskeresői kiskönyv – projektösszefoglaló

2026. október 13. · Richárd

## Háttér

A cél az IdomSoft Senior Frontend Developer pozíciója, és ehhez egy demó épül, amely a hirdetés szinte minden követelményét lefedi. Az IdomSoft állami cég, ők fejlesztik a DÁP-ot és a nyilvános DÁP Design Systemet is.

**A hirdetés kulcskövetelményei:** React és Next.js/Astro, reszponzív és akadálymentes felületek, automatizált tesztelés (Vitest, Jest, Cypress, Playwright), headless CMS (különösen Payload), design system, Docker, web performance (Core Web Vitals), technikai döntéshozatal.

**A CV állapota:** frontend-fókuszú magyar változat kész, új címmel és összefoglalóval. Küldés előtt még nyitott:

- [ ] A MOME-képzés neve legyen egységes az összefoglalóban és a Végzettségnél.
- [ ] Cypress és Playwright: ha használtad, kerüljön a Tesztelés sorba; ha nem, ki a Polygence stackből.
- [ ] Apróságok: „Vitesttel”, Prisma/Drizzle duplikáció, „Tanstack” pontosítása, Vite/Vitest bullet előrébb.
- [ ] A Payload és a performance csak a demó után kerülhet be, valós tapasztalat alapján.

## A demó: digitális álláskeresői kiskönyv

A papír „Álláskeresők kiskönyve” digitális változata, saját tapasztalatból: a füzet könnyen elvész, és a pecsét az egyetlen bizonyíték az állampolgár kezében.

**A füzet két dolgot old meg, a digitális változatnak mindkettőt kell:**

1. **Emlékeztető:** nálad van a következő előírt megjelenés.
2. **Bizonyíték a te oldaladon:** a pecsét igazolja, hogy megjelentél, függetlenül a hivatal belső rendszerétől.

**Felületek:**

- **Állampolgári felület** (DÁP Design System): mockolt „Belépés DÁP-pal”, nyilvántartásba vétel kérelmezése, előírt időpontok, megjelenések, QR-kód, letölthető aláírt igazolás.
- **Ügyintézői felület** (Payload admin): kérelmek elbírálása, időpontok felvétele, megjelenés rögzítése.
- **Nyilvános ellenőrző oldal:** bárki ellenőrizheti egy igazolás érvényességét.

**A kiskönyv oldal állapotai:** nincs kérelem → „Nem vagy nyilvántartva” + kérelmezés gomb · requested → „Elbírálás alatt” · rejected → indok + újrakérelmezés · approved → a kiskönyv · closed → korábbi időszakok.

**Szabályok:** csak kitalált adatok, `@example.com` címek, állami logók nélkül, a DÁP-belépés egyértelműen demóként jelölve. Interjún építő hangnem: „itt látok egy lehetőséget az idő visszaadására”.

## Technikai stack és döntések

Egy Next.js app, benne a Payload 3-mal: egy repo, egy deploy.

| Terület | Választás | Indoklás |
| --- | --- | --- |
| Keretrendszer | Next.js + Payload 3 | A Payload a Next.js-en belül fut (admin + API), Astróra külön éles oldal lesz |
| Adatbázis | Postgres: lokálisan Docker, élesben Neon | A Payload Postgres adaptere Drizzle-t használ |
| Azonosítók | UUID (`idType: 'uuid'`) | Kitalálhatatlan ID-k, IDOR kockázat ellen |
| UI | DÁP Design System (`dap-design-system`, Lit web komponensek) | Az IdomSoft saját design systeme |
| Layout | Tailwind v4, a DÁP design tokenekre kötve (`@theme`) | A saját részek illeszkednek a komponensekhez; Sass nem kell |
| Ügyintézői UI | Payload admin, egy egyedi QR-beolvasó nézettel | Belső eszközt nem építünk újra (mint a Stripe Customer Portalnál) |
| Tesztelés | Vitest (logika), Playwright + axe (fő folyamat, akadálymentesség) | A hirdetés név szerint kéri |
| Lokális infra | Docker Compose: Postgres + Mailpit | Docker-tapasztalat, e-mailek biztonságos tesztelése |
| E-mail | Lokálisan Mailpit, previewban konzol, élesben Resend | Környezet szerinti adapter a Payload configban |
| Hosting | Vercel | Preview deployok PR-enként |
| Kriptográfia | `jose` | QR-token (HS256) és aláírt igazolás (Ed25519) |

**Web komponensek, amire figyelni kell:** a Shadow DOM miatt a Tailwind-osztályok nem jutnak be a komponensbe (testreszabás CSS változókkal vagy `::part`-tal); stringet attribútumként, objektumot property-ként adunk át; a React 19 kezeli a custom eventeket; Next.js-ben a komponensek csak kliensen regisztrálódnak (lásd a DÁP dokumentáció Next.js és FOUC oldalát).

## Adatmodell

Hét collection; a kérelem és az álláskeresési időszak egyetlen modell státuszgéppel, a megjelenések pedig módosíthatatlanok.

| Collection | Mezők | Megjegyzés |
| --- | --- | --- |
| `users` | email, jelszó, `role` (clerk / editor) | Ügyintézők és szerkesztők, `auth: true`, `admin.user` |
| `citizens` | álnevesített azonosító, kitalált név | `auth: true` (lásd Autentikáció) |
| `registrations` | `citizen`, `status`, `requestedAt`, `documents`, `startDate`, `endDate`, `endReason`, `reviewedBy`, `reviewedAt`, `rejectionReason`, `internalNotes` | A kérelem ÉS az időszak egyben |
| `appointments` | `registration`, `citizen` (hookból), `scheduledAt`, `type`, `status`, `createdBy` | Kötelező megjelenések |
| `attendances` | `appointment` (unique), `recordedAt`, `recordedBy`, `method` (qr / manual), `tokenJti` (unique), aláírt igazolás | Csak létrehozási jog: ez a „pecsét” |
| `documents` | fájl | Upload collection a feltöltött igazolásokhoz |
| `pages` | tartalom | Tájékoztatók a szerkesztőknek |

**Státuszok:** registrations: requested → approved | rejected, approved → closed. Appointments: scheduled → attended | missed | cancelled.

**Szabályok egy `beforeChange` hookban:**

- Csak megengedett státuszváltás történhet.
- Jóváhagyáskor kötelező a `startDate`; a `reviewedBy` és a `reviewedAt` automatikusan töltődik.
- Egy állampolgárnak egyszerre csak egy aktív (requested vagy approved) kérelme lehet.
- Időpont csak approved kérelemhez, a `startDate` utánra vehető fel.
- Az appointment `citizen` mezőjét hook tölti ki a registrationből (denormalizálás az egyszerű access controlhoz).

**Mezőszintű jogosultság:** az állampolgár létrehozhat kérelmet, de a `status`, a `startDate` és az `internalNotes` mezőt nem írhatja; az `internalNotes`-t nem is látja.

## Autentikáció és jogosultságok

A sessiont és a jogosultságokat a Payload intézi; saját kód csak a mockolt DÁP-belépéshez kell.

**Mit ad az `auth: true`:** e-mail + hashelt jelszó, login/logout/me/refresh/forgot-password végpontok (REST, GraphQL, Local API), JWT HTTP-only cookie-ban (`payload-token`), `req.user` minden kérésnél, fiókzárolás túl sok hibás próbálkozás után. Finomhangolható: `tokenExpiration`, `maxLoginAttempts`, `lockTime`, `verify`, `useAPIKey`.

**Állampolgári belépés, két fázisban:**

1. **Demó-kompromisszum:** jelszavas stratégia, a seed kitalált e-mailt és véletlen jelszót ad. A „Belépés DÁP-pal” server action 2 másodpercet vár, `payload.login()`-nal belépteti a demóállampolgárt (adatai env változóban), beállítja a `payload-token` cookie-t, majd átirányít a `/kiskonyv` oldalra. A loading állapotot a `useFormStatus` adja.
2. **Valósághű változat:** `disableLocalStrategy: true` + egyedi `dap-mock` auth stratégia. Nincs e-mail és jelszó; a server action egy `jose`-val aláírt session cookie-t ad ki, a stratégia ebből tölti be a `req.user`-t. Valódi DÁP-nál itt lenne az OIDC callback.

**Jogosultságok:**

- Az appointments `read` szabálya: ügyintéző mindent lát, állampolgár csak `citizen equals user.id` rekordokat.
- `admin.user = "users"`, így állampolgár nem léphet be az `/admin`-ba.
- **Buktató:** a Local API alapból `overrideAccess: true`. Az állampolgár nevében mindig `user` + `overrideAccess: false`.

**Ügyintézői belépés:**

- Az első admin usert prodban ne a „Create first user” oldal hozza létre (azt bárki használhatja, aki először nyitja meg), hanem egy szkript vagy migráció env változókból.
- A forgot password beépített, de e-mail adapter kell hozzá, és helyes `serverURL`.

**Miért nem magic link?** Az e-mail-hozzáférést bizonyítja, nem a személyazonosságot. A hitelesítés erősségét a szolgáltatás kockázatához kell igazítani (eIDAS megbízhatósági szintek); állami nyilvántartásnál az identitás forrása az állami azonosítás.

## Megjelenés igazolása

A demó magja az, hogy a megjelenés az állampolgár oldalán is látható, elhagyhatatlan és tőle függetlenül bizonyítható legyen. Három rétegben épül, ebben a sorrendben.

**1. Alap: ügyintéző rögzít, állampolgár azonnal látja.** Attendance rekord a Payload adminból, időbélyeggel és az osztály nevével.

**2. Dinamikus QR-kód (opcionális).** Nem fix személyes kód (azt le lehet fotózni és továbbadni), hanem rövid életű, aláírt JWT:

- Payload: `sub` (álnevesített azonosító, nem TAJ), `apt` (időpont), `iat`, `exp` (+30 mp), `jti` (egyszer használható).
- HS256, közös titkos kulccsal: elég, mert csak a saját szerver ellenőriz.
- Az app kb. 25 másodpercenként új tokent kér; az ügyintéző beolvassa; a szerver ellenőrzi az aláírást, a lejáratot és a `jti`-t, majd rögzít.
- Aláírt ≠ titkosított: a tartalom kiolvasható, ezért nincs benne személyes adat.

**3. Aláírt igazolás (utolsó lépés).** A digitális pecsét, ami az állampolgárnál marad:

- Rögzítéskor egy hook Ed25519 kulccsal aláírt JWS-t állít ki (típus, citizen, appointment, időpont, osztály, rögzítő).
- A privát kulcs csak a szerveren van; a nyilvános kulcs a `/.well-known/jwks.json` végponton bárkinek elérhető.
- Az állampolgár letöltheti (pl. PDF, rajta QR-kódban az igazolás).
- Nyilvános „Igazolás ellenőrzése” oldal: érvényesség + összevetés az adatbázis jelenlegi állapotával.
- **Interjús pillanat:** az adminban átírod a megjelenést, az igazolás továbbra is érvényes, és a rendszer jelzi az eltérést.
- Bővítések: `kid` a fejlécben kulcscseréhez (a régi nyilvános kulcs publikálva marad); hash-lánc az attendances rekordokban.

**Miért kell itt kulcspár?** HS256-nál aki ellenőrizni tud, hamisítani is. Az igazolást viszont az állampolgárnak és harmadik félnek is ellenőriznie kell úgy, hogy hamisítani ne tudjon. A valós megfelelő: **elektronikus bélyegző** (eIDAS electronic seal), minősített tanúsítvánnyal.

## Környezetek, migrációk, seed

Három környezet, és prod adat soha nem kerül preview-ba.

| Környezet | Adatbázis | Séma | Adat | E-mail |
| --- | --- | --- | --- | --- |
| Lokális | Docker Postgres | push mód (automatikus) | seed | Mailpit |
| Preview | Közös Neon `preview` branch, prod adat nélkül | `migrate:fresh` minden buildnél | seed | konzol |
| Prod | Neon main | csak `payload migrate` | valós | Resend |

**Migrációk:**

- Fejlesztéskor push mód; ha kész egy sémaváltozás: `payload migrate:create <név>`, a generált fájl átnézése, commit.
- Soha ne keverd a push módot és a migrációkat ugyanazon az adatbázison.
- Átnevezés = törlés + létrehozás lehet. Biztonságos minta: expand–contract (új mező, adatmásolás a migrációban, a régi törlése később).
- Az `up` függvény megkapja a `payload` példányt is, így adat is alakítható benne.

**Build szkript, `VERCEL_ENV` védelemmel** (a projekt legveszélyesebb pontja):

```js
// scripts/vercel-build.mjs
import { execSync } from "node:child_process";
const run = (cmd) => execSync(cmd, { stdio: "inherit" });

if (process.env.VERCEL_ENV === "preview") {
  run("payload migrate:fresh");
  run("payload run src/seed.ts");
} else {
  run("payload migrate");
}
run("next build");
```

**Seed szabályok:** idempotens (stabil kulcsok alapján, csak ha még nem létezik), csak kitalált adat és `@example.com` cím, ugyanaz a fájl fut lokálisan és previewban. A seed hozza létre az első admin usert is.

**Későbbi bővítés:** PR-enként friss adatbázis GitHub Actionnel (Neon `create-branch` / `delete-branch`), adatmentes alap branchből. A Neon Vercel-integrációját nem használjuk, mert az a prod branchből másol, adatokkal együtt.

**Docker:** a `docker-compose.yml` csak a Postgrest és a Mailpitet futtatja, az app natívan (`pnpm dev`). A sablon `Dockerfile`-ja (multi-stage, standalone output, nem root user) a production konténerizáláshoz való; opcionális gyakorlófeladat a demó végén (`.dockerignore`, build argumentumok, migráció, service-név alapú hálózat).

## Következő teendők

**Állapot (2026. október 13.):** a projekt létrejött (blank sablon, Postgres adapter). A Docker Compose projekt neve `digi-kiskonyv` (Postgres 17 + Mailpit), az admin elérhető a `localhost:3000/admin` címen. Folyamatban: átállás UUID azonosítókra (`idType: 'uuid'` a Postgres adapterben, majd `docker compose down -v` és újraindítás). A munka a Claude Code-ban folytatódik.

A CV után hat fázis; minden fázis végén legyen működő, kitehető állapot.

**0. CV és jelentkezés**

- [ ] A Háttér szekció nyitott CV-pontjainak lezárása.
- [ ] Jelentkezés elküldése (nem kell megvárni a demót; a demó az interjúra kell).

**1. Alapok**

- [x] Docker Compose: Postgres + Mailpit, `docker compose up -d`.
- [x] Új projekt: `create-payload-app`, blank sablon, Postgres.
- [ ] UUID-ra váltás befejezése, a generált táblák átnézése (`\dt`, `\d users`).
- [ ] Neon projekt + Vercel deploy, első migráció, `vercel-build` szkript.
- [ ] Első admin user szkriptből (env változók), nem a „Create first user” oldalon.

**2. Adatmodell és admin**

- [ ] Collectionök: users, citizens, registrations, appointments, attendances, documents, pages.
- [ ] Státuszgép és szabályok `beforeChange` hookban; mezőszintű jogosultságok.
- [ ] Seed szkript kitalált adatokkal.
- [ ] Migráció létrehozása és élesítése.

**3. Állampolgári felület**

- [ ] DÁP Design System bekötése (Next.js és FOUC dokumentáció alapján), Tailwind a tokenekre kötve.
- [ ] Mockolt DÁP-belépés server actionnel.
- [ ] Kiskönyv oldal minden státusszal; kérelmezés (gomb, később dokumentumfeltöltés).
- [ ] Időpontok, megjelenések, .ics export.
- [ ] Reszponzivitás és billentyűzetes használat ellenőrzése.

**4. Megjelenés igazolása**

- [ ] Megjelenés rögzítése az adminban, azonnal látható az állampolgárnak.
- [ ] Opcionális: dinamikus QR-token + egyedi beolvasó nézet az adminban.

**5. Minőség**

- [ ] Vitest a logikára (státuszgép, hookok).
- [ ] Playwright + axe a fő folyamatra (belépés → kérelem → jóváhagyás → megjelenés).
- [ ] Lighthouse-mérés előtte/utána, optimalizálás, számok a README-be.
- [ ] README: döntések és indoklásuk, a mockok határai, „valódi bekötés esetén” szakasz.

**6. Extrák, ha marad idő**

- [ ] Aláírt igazolás (Ed25519 JWS, JWKS végpont, ellenőrző oldal).
- [ ] Átállás a valósághű `dap-mock` auth stratégiára.
- [ ] PR-enkénti preview adatbázis GitHub Actionnel.
- [ ] Production Docker image a sablon Dockerfile-jából, compose-ban a Postgres mellett.
- [ ] CV frissítése: Payload, Playwright, performance – most már valós tapasztalattal.

## Ellenőrizendő pontok és interjús érvek

A kódminták a mintát mutatják; a pontos API-t a Payload skillben, illetve a telepített verzió dokumentációjában kell ellenőrizni.

**Dokumentációban ellenőrizendő:**

- [ ] Payload: `payload.login()` és `payload.auth()` szignatúrája; az egyedi auth stratégia formátuma.
- [ ] Payload: `migrate:fresh` nem interaktív futtatása; létezik-e a `payload run`.
- [ ] Payload: migráció futtatása Vercelen (build parancs vagy az adapter induláskori opciója); e-mail adapter csomagnevek.
- [ ] Neon: ajánlott kapcsolódási mód serverlesshez (pooled connection string); ingyenes csomag branch-limitje.
- [ ] DÁP Design System: Next.js integráció és FOUC kezelése.
- [ ] DÁP: van-e már személyes ügyintézésben használható funkció (2025-ben későbbi fejlesztésként szerepelt).
- [ ] Felhasználói kutatás: következő alkalommal megkérdezni az ügyintézőt, mire használják a füzetet.

**Interjús érvek:**

- **Saját problémából indult:** felhasználói nézőpont, életesemény-alapú gondolkodás, építő hangnem.
- **Az ő eszközeikkel készült:** DÁP Design System, Payload.
- **Biztonsági határok:** jogosultság az adatrétegben, nem a UI-ban; `overrideAccess: false`; UUID az IDOR ellen; a hitelesítés erőssége a kockázathoz igazítva.
- **Kriptográfia, érthetően:** miért nem fix QR-kód; HS256 kontra Ed25519; az aláírt igazolás mint elektronikus bélyegző.
- **Üzemeltetés:** prod adat nem kerül preview-ba; migrációk átnézése; `VERCEL_ENV` védelem; konténerizálás nem root userrel.
- **Pragmatizmus:** a belső ügyintézői felületet nem építjük újra, az idő az állampolgári felületre megy.

## Források

- [DÁP Design System – fejlesztői dokumentáció](https://services.gov.hu/design-system-dev)
- [DÁP Design System – Frameworks (React, Next.js)](https://services.gov.hu/design-system-dev/frameworks)
- [DÁP Design System – példaprojektek](https://github.com/mohojojo/dap-ds-examples)
- [Szolgáltatástervezési sztenderdek – DÁP Szolgáltatások](https://services.gov.hu/szolgaltatastervezesi-sztenderdek)
- [SZEÜSZ – DÁP eAzonosítás csatlakozás](https://szeusz.gov.hu/szeusz/EAZONHAASZ)
- [Infostart – Új funkcióval bővült a DÁP (2026. szeptember)](https://infostart.hu/belfold/2026/09/23/uj-funkcioval-bovult-a-dap)
- [Economx – DÁP piaci szereplőknek (2025. június)](https://www.economx.hu/tech/digitalis-allampolgarsag-program-ugyintezes-szolgaltatasok-online.810706.html)
- [Kormányhivatalok – Foglalkoztatási Osztály, online nyilvántartásba vétel](https://www.kormanyhivatalok.hu/kormanyhivatalok/bacs-kiskun/megye/ugyfelszolgalat/kiskoros-6200-1)
- [Neon – Branches (schema-only branch)](https://neon.com/docs/manage/branches.md)
- [Neon – Branching workflow primer](https://neon.com/docs/get-started/workflow-primer)
- [Neon – Neon-Managed Vercel Integration](https://neon.com/docs/guides/neon-managed-vercel-integration)
