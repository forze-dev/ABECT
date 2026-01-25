// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Comments } from './collections/Comments'
import { Portfolio } from './collections/Portfolio'
import { Services } from './collections/Services'
import { ServiceTypes } from './collections/ServiceTypes'
import { Leads } from './collections/Leads'

import { CalculatorConfig } from './globals/CalculatorConfig'

import { fullRichEditor } from './utils/editor';

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Services,
    ServiceTypes,
    Portfolio,
    Posts,
    Categories,
    Media,
    Comments,
    Leads,
    Users
  ],
  globals: [
    CalculatorConfig,
  ],
  editor: fullRichEditor,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // Автоматично синхронізувати схему БД при старті (як в development)
    // Це безпечно для production якщо зміни тільки додають нові поля/таблиці
    push: true,
  }),
  // Локалізація для українська/англійська
  localization: {
    locales: [
      {
        label: 'Українська',
        code: 'uk',
      },
      {
        label: 'English',
        code: 'en',
      },
    ],
    defaultLocale: 'uk',
    fallback: true,
  },
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})