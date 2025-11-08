import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'role'],
  },
  auth: true,
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      localized: true,
      label: 'Імʼя',
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      localized: true,
      label: 'Прізвище',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'moderator',
      label: 'Роль користувача',
      options: [
        { label: 'Суперадмін', value: 'superadmin' },
        { label: 'Адмін', value: 'admin' },
        { label: 'Модератор', value: 'moderator' },
      ],
      admin: {
        description: 'Визначає рівень доступу користувача',
      },
    },
  ],
}
