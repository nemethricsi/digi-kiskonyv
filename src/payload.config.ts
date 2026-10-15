import { postgresAdapter } from '@payloadcms/db-postgres';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { en } from '@payloadcms/translations/languages/en';
import { hu } from '@payloadcms/translations/languages/hu';
import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { Appointments } from '@/collections/Appointments';
import { Citizens } from '@/collections/Citizens';
import { Media } from '@/collections/Media';
import { Registrations } from '@/collections/Registrations';
import { Users } from '@/collections/Users';
import { env } from '@/env';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Every preview branch gets its own server url.
// Vercel system env vars: production domain in prod, the deployment's own URL in preview
const vercelHost =
  env.VERCEL_ENV === 'production'
    ? env.VERCEL_PROJECT_PRODUCTION_URL
    : env.VERCEL_URL;

const serverURL =
  env.NEXT_PUBLIC_SERVER_URL ||
  (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000');

export default buildConfig({
  serverURL,
  i18n: {
    supportedLanguages: { hu, en },
    fallbackLanguage: 'hu',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Citizens, Registrations, Appointments, Media, Users],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URL,
    },
    idType: 'uuid',
  }),
  email: env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: 'noreply@example.com',
        defaultFromName: 'ÁDK (demó)',
        transportOptions: {
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: false,
        },
      })
    : undefined,
  sharp,
  plugins: [],
});
