import type { CollectionConfig } from 'payload'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'service', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    // Основна інформація
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Назва проекту',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      localized: true,
      label: 'Короткий опис',
      admin: {
        description: 'Опис для картки проекту',
      },
    },
    {
      name: 'client',
      type: 'text',
      required: true,
      localized: true,
      label: 'Назва клієнта',
    },
    {
      name: 'service',
      type: 'select',
      required: true,
      label: 'Тип послуги',
      options: [
        { label: 'Дизайн', value: 'design' },
        { label: 'Сайт', value: 'website' },
        { label: 'Просування', value: 'promotion' },
      ],
    },
    {
      name: 'type',
      type: 'select',
      label: 'Тип сайту',
      admin: {
        description: 'Заповнюється тільки якщо service = "Сайт"',
        condition: (data) => data.service === 'website',
      },
      options: [
        { label: 'Кастомна розробка', value: 'custom' },
        { label: 'На конструкторі', value: 'builder' },
      ],
    },
    {
      name: 'projectUrl',
      type: 'text',
      label: 'Посилання на сайт',
      admin: {
        description: 'URL проекту (якщо є)',
      },
    },
    {
      name: 'projectDate',
      type: 'date',
      required: true,
      label: 'Дата публікації проекту',
      admin: {
        description: 'Дата публікації проекту',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
      label: 'Повний опис проекту',
    },
    
    // SEO
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
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          required: true,
          localized: true,
          label: 'Meta Title',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          required: true,
          localized: true,
          label: 'Meta Description',
        },
        {
          name: 'metaKeywords',
          type: 'textarea',
          required: true,
          localized: true,
          label: 'Meta Keywords',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'OG Image',
          admin: {
            description: 'Зображення для соціальних мереж',
          },
        },
      ],
    },
    {
      name: 'viewCount',
      type: 'number',
      label: 'Кількість переглядів',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    
    // Статус
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Статус',
      options: [
        { label: 'Чернетка', value: 'draft' },
        { label: 'Опубліковано', value: 'published' },
        { label: 'Архів', value: 'archived' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Виділений проект',
      defaultValue: false,
      admin: {
        description: 'Показувати на головній сторінці',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Порядковий номер',
      admin: {
        description: 'Порядок відображення на сайті (менше число = вище)',
      },
    },
  ],
}