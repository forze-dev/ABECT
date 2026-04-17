// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
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

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is required')
}
if (!process.env.DATABASE_URI) {
  throw new Error('DATABASE_URI environment variable is required')
}

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
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
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