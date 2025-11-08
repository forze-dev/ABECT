import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt текст',
      required: true,
      admin: {
        description: 'Опис зображення для SEO та доступності',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Підпис',
      admin: {
        description: 'Підпис до зображення',
      },
    },
    {
      name: 'folder',
      type: 'select',
      label: 'Папка',
      options: [
        { label: 'Пости', value: 'posts' },
        { label: 'Категорії', value: 'categories' },
        { label: 'Загальне', value: 'general' },
      ],
      defaultValue: 'general',
      admin: {
        description: 'Організація файлів по папках',
      },
    },
  ],
}