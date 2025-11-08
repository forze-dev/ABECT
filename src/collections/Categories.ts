import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Назва категорії',
      localized: true
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL (slug) - відображення на нашому сайті',
      admin: {
        description: 'URL-friendly назва для посилань',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Опис категорії',
      required: true,
      localized: true
    },
    {
      name: 'color',
      type: 'text',
      label: 'Колір (hex)',
      admin: {
        description: 'Наприклад: #3B82F6',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Обкладинка категорії',
    },
    // SEO Fields
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          required: true,
          localized: true
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          required: true,
          localized: true
        },
        {
          name: 'metaKeywords',
          type: 'textarea',
          label: 'Meta Keywords',
          required: true,
          localized: true
        },
      ],
    },
  ],
}