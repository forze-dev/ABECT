import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'contact', 'type', 'status', 'createdAt'],
    group: 'Заявки',
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    // ============ КОНТАКТНІ ДАНІ ============
    {
      name: 'name',
      type: 'text',
      required: true,
      label: "Ім'я та Прізвище",
    },
    {
      name: 'contact',
      type: 'text',
      required: true,
      label: 'Телефон або Email',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Коментар',
    },

    // ============ ТИП ЗАЯВКИ ============
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Тип заявки',
      defaultValue: 'simple',
      options: [
        { label: 'Проста форма', value: 'simple' },
        { label: 'Калькулятор', value: 'calculator' },
      ],
    },

    // ============ ДАНІ КАЛЬКУЛЯТОРА ============
    {
      name: 'calculatorData',
      type: 'group',
      label: 'Дані калькулятора',
      admin: {
        condition: (data) => data.type === 'calculator',
      },
      fields: [
        {
          name: 'projectType',
          type: 'text',
          label: 'Тип проекту',
        },
        {
          name: 'platform',
          type: 'select',
          label: 'Платформа',
          options: [
            { label: 'Weblium', value: 'weblium' },
            { label: 'Custom', value: 'custom' },
          ],
        },
        {
          name: 'pagesCount',
          type: 'number',
          label: 'Кількість сторінок',
        },
        {
          name: 'additionalServices',
          type: 'json',
          label: 'Додаткові послуги',
        },
        {
          name: 'urgency',
          type: 'text',
          label: 'Терміновість',
        },
        {
          name: 'estimatedPrice',
          type: 'number',
          label: 'Розрахована ціна',
        },
        {
          name: 'estimatedTimeline',
          type: 'text',
          label: 'Розрахований термін',
        },
      ],
    },

    // ============ МЕТА-ДАНІ ============
    {
      name: 'source',
      type: 'text',
      label: 'Джерело (URL сторінки)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'utm',
      type: 'group',
      label: 'UTM мітки',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'source',
          type: 'text',
          label: 'UTM Source',
        },
        {
          name: 'medium',
          type: 'text',
          label: 'UTM Medium',
        },
        {
          name: 'campaign',
          type: 'text',
          label: 'UTM Campaign',
        },
      ],
    },

    // ============ СТАТУС ОБРОБКИ ============
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Статус',
      defaultValue: 'new',
      options: [
        { label: '🆕 Нова', value: 'new' },
        { label: '🔄 В обробці', value: 'processing' },
        { label: '✅ Завершена', value: 'completed' },
        { label: '❌ Відхилена', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Нотатки менеджера',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
