import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['author', 'post', 'status', 'createdAt'],
  },
  access: {
    // Тільки залогінені користувачі можуть створювати коментарі
    create: ({ req: { user } }) => !!user,
    // Всі можуть читати схвалені коментарі
    read: ({ req: { user } }) => {
      if (user) {
        return true // Залогінені бачать всі
      }
      return {
        status: { equals: 'approved' }, // Гості бачать тільки схвалені
      }
    },
    // Тільки адміни можуть оновлювати/видаляти
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Автор',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      label: 'Стаття',
      admin: {
        description: 'До якої статті відноситься коментар',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Текст коментаря',
      maxLength: 1000,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Статус',
      options: [
        { label: 'Очікує модерації', value: 'pending' },
        { label: 'Схвалено', value: 'approved' },
        { label: 'Спам', value: 'spam' },
      ],
      admin: {
        description: 'Модерація коментарів адміністратором',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'comments',
      label: 'Відповідь на коментар',
      admin: {
        description: 'Для вкладених відповідей (необов\'язково)',
      },
    },
  ],
  timestamps: true,
}