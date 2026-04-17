import 'dotenv/config'
import { getPayload } from 'payload'
import type { DataFromCollectionSlug } from 'payload'
import config from '../payload.config'

const seedServices = async () => {
  console.log('🌱 Starting Services seed...\n')

  try {
    // Initialize Payload
    const payload = await getPayload({ config })

    // Helper function to create localized service
    const createService = async (
      ukData: Record<string, unknown>,
      enData: Record<string, unknown>,
    ) => {
      // Create with Ukrainian (default locale)
      const service = await payload.create({
        collection: 'services',
        locale: 'uk',
        data: ukData as unknown as DataFromCollectionSlug<'services'>,
      })

      // Update with English translations
      await payload.update({
        collection: 'services',
        id: service.id,
        locale: 'en',
        data: enData as unknown as DataFromCollectionSlug<'services'>,
      })

      return service
    }

    // Service 1: Landing Page
    console.log('📄 Creating Landing Page service...')
    await createService(
      // Ukrainian data
      {
        title: 'Лендінг',
        slug: 'landing-page',
        shortDescription: 'Швидке створення одностороінкового сайту для презентації продукту або послуги',
        category: 'web-development',
        order: 1,
        featured: true,
        status: 'published',

        // Weblium Option
        hasWebliumOption: true,
        webliumPrice: 6000,
        webliumPriceCurrency: 'UAH',
        webliumTimeline: '5-7 днів',
        webliumDescription: 'Швидке створення на конструкторі з готовими блоками',
        webliumFeatures: [
          { feature: 'До 5 секцій' },
          { feature: 'Візуальний редактор' },
          { feature: 'Готові блоки' },
          { feature: 'Форма зв\'язку' },
          { feature: 'Хостинг включено' },
        ],

        // Custom Option
        customPrice: 10000,
        customPriceCurrency: 'UAH',
        customTimeline: '7-10 днів',
        customDescription: 'Унікальний дизайн та оптимізований код для максимальної швидкості',
        customFeatures: [
          { feature: 'До 5 секцій' },
          { feature: 'Унікальний дизайн' },
          { feature: 'SEO оптимізація' },
          { feature: 'Швидке завантаження' },
          { feature: 'Чистий код' },
        ],

        // Detailed Description
        detailedDescription: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Лендінг (Landing Page) — це одностороінковий сайт, створений для досягнення конкретної маркетингової мети: продажу продукту, збору контактів, реєстрації на подію тощо.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        },

        // Process Steps
        process: [
          {
            stepNumber: '01',
            stepTitle: 'Аналіз і планування',
            stepDescription: 'Вивчаємо ваш продукт, цільову аудиторію та конкурентів',
          },
          {
            stepNumber: '02',
            stepTitle: 'Дизайн прототипу',
            stepDescription: 'Створюємо структуру та прототип майбутньої сторінки',
          },
          {
            stepNumber: '03',
            stepTitle: 'Розробка',
            stepDescription: 'Верстка та програмування функціоналу',
          },
          {
            stepNumber: '04',
            stepTitle: 'Тестування',
            stepDescription: 'Перевірка на всіх пристроях та браузерах',
          },
          {
            stepNumber: '05',
            stepTitle: 'Запуск',
            stepDescription: 'Розміщення на хостингу та налаштування аналітики',
          },
        ],

        // FAQ
        faq: [
          {
            question: 'Яка різниця між Weblium та Custom розробкою?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Weblium — швидше та дешевше, але з обмеженнями. Custom — повна свобода в дизайні та функціоналі.',
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
        ],

        // SEO
        seo: {
          metaTitle: 'Розробка Landing Page | Замовити лендінг від 6000 грн | ABECT',
          metaDescription: 'Професійна розробка лендінг пейдж під ключ. Швидко, якісно, з гарантією результату. Від 6000 грн. Безкоштовна консультація ✓',
          metaKeywords: 'розробка лендінг пейдж, замовити лендінг, створити landing page, landing page ціна',
        },
      },
      // English data
      {
        title: 'Landing Page',
        shortDescription: 'Quick creation of a single-page website to present your product or service',
        webliumTimeline: '5-7 days',
        webliumDescription: 'Quick creation on builder with ready-made blocks',
        webliumFeatures: [
          { feature: 'Up to 5 sections' },
          { feature: 'Visual editor' },
          { feature: 'Ready blocks' },
          { feature: 'Contact form' },
          { feature: 'Hosting included' },
        ],
        customTimeline: '7-10 days',
        customDescription: 'Unique design and optimized code for maximum speed',
        customFeatures: [
          { feature: 'Up to 5 sections' },
          { feature: 'Unique design' },
          { feature: 'SEO optimization' },
          { feature: 'Fast loading' },
          { feature: 'Clean code' },
        ],
        detailedDescription: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'A Landing Page is a single-page website created to achieve a specific marketing goal: selling a product, collecting contacts, registering for an event, etc.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        },
        process: [
          {
            stepNumber: '01',
            stepTitle: 'Analysis & Planning',
            stepDescription: 'We study your product, target audience and competitors',
          },
          {
            stepNumber: '02',
            stepTitle: 'Prototype Design',
            stepDescription: 'We create the structure and prototype of the future page',
          },
          {
            stepNumber: '03',
            stepTitle: 'Development',
            stepDescription: 'Layout and programming of functionality',
          },
          {
            stepNumber: '04',
            stepTitle: 'Testing',
            stepDescription: 'Testing on all devices and browsers',
          },
          {
            stepNumber: '05',
            stepTitle: 'Launch',
            stepDescription: 'Hosting deployment and analytics setup',
          },
        ],
        faq: [
          {
            question: 'What is the difference between Weblium and Custom development?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Weblium is faster and cheaper, but with limitations. Custom offers complete freedom in design and functionality.',
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
        ],
        seo: {
          metaTitle: 'Landing Page Development | Order from $240 | ABECT',
          metaDescription: 'Professional turnkey landing page development. Fast, high quality, with guaranteed results. From $240. Free consultation ✓',
          metaKeywords: 'landing page development, order landing page, create landing page, landing page price',
        },
      },
    )
    console.log('✅ Landing Page created\n')

    // Service 2: Corporate Website
    console.log('🏢 Creating Corporate Website service...')
    await createService(
      // Ukrainian data
      {
        title: 'Корпоративний сайт',
        slug: 'corporate-website',
        shortDescription: 'Багатосторінковий сайт для презентації компанії, послуг та команди',
        category: 'web-development',
        order: 2,
        featured: true,
        status: 'published',
        hasWebliumOption: true,
        webliumPrice: 15000,
        webliumPriceCurrency: 'UAH',
        webliumTimeline: '10-14 днів',
        webliumDescription: 'Багатосторінковий сайт з CMS та візуальним редактором',
        webliumFeatures: [
          { feature: '10-15 сторінок' },
          { feature: 'CMS Weblium' },
          { feature: 'Візуальний редактор' },
          { feature: 'Форми та інтеграції' },
          { feature: 'Хостинг включено' },
        ],
        customPrice: 25000,
        customPriceCurrency: 'UAH',
        customTimeline: '14-21 день',
        customDescription: 'Професійний сайт з унікальним дизайном та технічною SEO',
        customFeatures: [
          { feature: '10-15 сторінок' },
          { feature: 'Headless CMS (за потреби)' },
          { feature: 'Технічна SEO' },
          { feature: 'Семантична розмітка' },
          { feature: 'Максимальна швидкість' },
        ],
        detailedDescription: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Корпоративний сайт — це візитна картка вашої компанії в інтернеті. Багатосторінковий сайт для презентації послуг, команди, портфоліо та контактів.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        },
        process: [
          {
            stepNumber: '01',
            stepTitle: 'Бріфінг та аналіз',
            stepDescription: 'Збираємо вимоги та вивчаємо специфіку бізнесу',
          },
          {
            stepNumber: '02',
            stepTitle: 'Структура та прототип',
            stepDescription: 'Створюємо карту сайту та прототипи сторінок',
          },
          {
            stepNumber: '03',
            stepTitle: 'Дизайн',
            stepDescription: 'Розробка унікального дизайну всіх сторінок',
          },
          {
            stepNumber: '04',
            stepTitle: 'Розробка та CMS',
            stepDescription: 'Верстка, програмування та підключення CMS',
          },
          {
            stepNumber: '05',
            stepTitle: 'Запуск та підтримка',
            stepDescription: 'Тестування, запуск та місяць безкоштовної підтримки',
          },
        ],
        faq: [
          {
            question: 'Скільки сторінок входить у вартість?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Базовий пакет включає 10-15 сторінок. Додаткові сторінки розраховуються окремо.',
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
        ],
        seo: {
          metaTitle: 'Розробка корпоративного сайту | Від 15000 грн | ABECT',
          metaDescription: 'Створення корпоративного сайту під ключ. 10-15 сторінок, CMS, унікальний дизайн. Від 15000 грн. Гарантія якості ✓',
          metaKeywords: 'розробка корпоративного сайту, створити сайт компанії, корпоративний сайт ціна',
        },
      },
      // English data
      {
        title: 'Corporate Website',
        shortDescription: 'Multi-page website to present your company, services and team',
        webliumTimeline: '10-14 days',
        webliumDescription: 'Multi-page website with CMS and visual editor',
        webliumFeatures: [
          { feature: '10-15 pages' },
          { feature: 'Weblium CMS' },
          { feature: 'Visual editor' },
          { feature: 'Forms and integrations' },
          { feature: 'Hosting included' },
        ],
        customTimeline: '14-21 days',
        customDescription: 'Professional website with unique design and technical SEO',
        customFeatures: [
          { feature: '10-15 pages' },
          { feature: 'Headless CMS (if needed)' },
          { feature: 'Technical SEO' },
          { feature: 'Semantic markup' },
          { feature: 'Maximum speed' },
        ],
        detailedDescription: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'A corporate website is your company\'s business card on the internet. A multi-page site for presenting services, team, portfolio and contacts.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        },
        process: [
          {
            stepNumber: '01',
            stepTitle: 'Briefing and Analysis',
            stepDescription: 'We gather requirements and study business specifics',
          },
          {
            stepNumber: '02',
            stepTitle: 'Structure and Prototype',
            stepDescription: 'We create site map and page prototypes',
          },
          {
            stepNumber: '03',
            stepTitle: 'Design',
            stepDescription: 'Unique design development for all pages',
          },
          {
            stepNumber: '04',
            stepTitle: 'Development and CMS',
            stepDescription: 'Layout, programming and CMS integration',
          },
          {
            stepNumber: '05',
            stepTitle: 'Launch and Support',
            stepDescription: 'Testing, launch and one month of free support',
          },
        ],
        faq: [
          {
            question: 'How many pages are included in the price?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'The basic package includes 10-15 pages. Additional pages are calculated separately.',
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
        ],
        seo: {
          metaTitle: 'Corporate Website Development | From $600 | ABECT',
          metaDescription: 'Turnkey corporate website development. 10-15 pages, CMS, unique design. From $600. Quality guarantee ✓',
          metaKeywords: 'corporate website development, create company website, corporate site price',
        },
      },
    )
    console.log('✅ Corporate Website created\n')

    // Service 3: E-commerce Store
    console.log('🛒 Creating E-commerce Store service...')
    await createService(
      // Ukrainian data
      {
        title: 'Інтернет-магазин',
        slug: 'ecommerce-store',
        shortDescription: 'Повнофункціональний онлайн-магазин з каталогом, кошиком та оплатою',
        category: 'web-development',
        order: 3,
        featured: true,
        status: 'published',
        hasWebliumOption: true,
        webliumPrice: 25000,
        webliumPriceCurrency: 'UAH',
        webliumTimeline: '20-30 днів',
        webliumDescription: 'Магазин з готовою CMS та платіжними системами',
        webliumFeatures: [
          { feature: 'Каталог товарів' },
          { feature: 'CMS Weblium' },
          { feature: 'Готові платежі' },
          { feature: 'Особистий кабінет' },
          { feature: 'Хостинг включено' },
        ],
        customPrice: 40000,
        customPriceCurrency: 'UAH',
        customTimeline: '30-45 днів',
        customDescription: 'Масштабований магазин з індивідуальним функціоналом',
        customFeatures: [
          { feature: 'Каталог товарів' },
          { feature: 'Кастомний функціонал' },
          { feature: 'Інтеграція з CRM' },
          { feature: 'Оптимізація продуктивності' },
          { feature: 'Гнучка масштабованість' },
        ],
        detailedDescription: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Інтернет-магазин — це повнофункціональна платформа для онлайн-продажів з каталогом товарів, кошиком, оплатою та системою управління замовленнями.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        },
        process: [
          {
            stepNumber: '01',
            stepTitle: 'Аналіз ніші',
            stepDescription: 'Вивчаємо конкурентів та особливості вашого асортименту',
          },
          {
            stepNumber: '02',
            stepTitle: 'UX/UI дизайн',
            stepDescription: 'Проектуємо зручний інтерфейс для покупців',
          },
          {
            stepNumber: '03',
            stepTitle: 'Розробка функціоналу',
            stepDescription: 'Каталог, кошик, оплата, особистий кабінет',
          },
          {
            stepNumber: '04',
            stepTitle: 'Інтеграції',
            stepDescription: 'Підключення CRM, платежів, доставки',
          },
          {
            stepNumber: '05',
            stepTitle: 'Тестування та запуск',
            stepDescription: 'Перевірка всіх процесів та запуск магазину',
          },
        ],
        faq: [
          {
            question: 'Які платіжні системи можна підключити?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'LiqPay, Fondy, WayForPay, PayPal, Stripe та інші популярні системи.',
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
        ],
        seo: {
          metaTitle: 'Розробка інтернет-магазину | Від 25000 грн | ABECT',
          metaDescription: 'Створення інтернет-магазину під ключ. Каталог, кошик, оплата, CRM. Від 25000 грн. Запуск за 20-30 днів ✓',
          metaKeywords: 'розробка інтернет магазину, створити онлайн магазин, інтернет магазин ціна',
        },
      },
      // English data
      {
        title: 'E-commerce Store',
        shortDescription: 'Full-featured online store with catalog, cart and payment',
        webliumTimeline: '20-30 days',
        webliumDescription: 'Store with ready CMS and payment systems',
        webliumFeatures: [
          { feature: 'Product catalog' },
          { feature: 'Weblium CMS' },
          { feature: 'Ready payments' },
          { feature: 'User account' },
          { feature: 'Hosting included' },
        ],
        customTimeline: '30-45 days',
        customDescription: 'Scalable store with custom functionality',
        customFeatures: [
          { feature: 'Product catalog' },
          { feature: 'Custom functionality' },
          { feature: 'CRM integration' },
          { feature: 'Performance optimization' },
          { feature: 'Flexible scalability' },
        ],
        detailedDescription: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'An e-commerce store is a full-featured platform for online sales with product catalog, cart, payment and order management system.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        },
        process: [
          {
            stepNumber: '01',
            stepTitle: 'Niche Analysis',
            stepDescription: 'We study competitors and your product range features',
          },
          {
            stepNumber: '02',
            stepTitle: 'UX/UI Design',
            stepDescription: 'We design a user-friendly interface for customers',
          },
          {
            stepNumber: '03',
            stepTitle: 'Functionality Development',
            stepDescription: 'Catalog, cart, payment, user account',
          },
          {
            stepNumber: '04',
            stepTitle: 'Integrations',
            stepDescription: 'CRM, payments, delivery connection',
          },
          {
            stepNumber: '05',
            stepTitle: 'Testing and Launch',
            stepDescription: 'Verification of all processes and store launch',
          },
        ],
        faq: [
          {
            question: 'What payment systems can be connected?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'LiqPay, Fondy, WayForPay, PayPal, Stripe and other popular systems.',
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
        ],
        seo: {
          metaTitle: 'E-commerce Store Development | From $1,000 | ABECT',
          metaDescription: 'Turnkey e-commerce store development. Catalog, cart, payment, CRM. From $1,000. Launch in 20-30 days ✓',
          metaKeywords: 'e-commerce development, create online store, online store price',
        },
      },
    )
    console.log('✅ E-commerce Store created\n')

    // Service 4: Contextual Advertising
    console.log('📢 Creating Contextual Advertising service...')
    await createService(
      // Ukrainian data
      {
        title: 'Контекстна реклама',
        slug: 'contextual-advertising',
        shortDescription: 'Налаштування та ведення рекламних кампаній в Google Ads для залучення клієнтів',
        category: 'marketing',
        order: 4,
        featured: false,
        status: 'published',
        hasWebliumOption: false,
        customPrice: 8000,
        customPriceCurrency: 'UAH',
        customTimeline: '5-7 днів',
        customDescription: 'Налаштування та ведення Google Ads',
        customFeatures: [
          { feature: 'Аналіз конкурентів' },
          { feature: 'Підбір ключових слів' },
          { feature: 'Налаштування кампаній' },
          { feature: 'A/B тестування' },
          { feature: 'Щотижневі звіти' },
        ],
        detailedDescription: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Контекстна реклама — це ефективний спосіб залучення цільової аудиторії через Google Ads. Ваші оголошення показуються людям, які вже шукають ваш продукт.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        },
        process: [
          {
            stepNumber: '01',
            stepTitle: 'Аудит та аналіз',
            stepDescription: 'Вивчаємо вашу нішу та конкурентів',
          },
          {
            stepNumber: '02',
            stepTitle: 'Стратегія',
            stepDescription: 'Розробляємо стратегію просування',
          },
          {
            stepNumber: '03',
            stepTitle: 'Налаштування',
            stepDescription: 'Створюємо кампанії та оголошення',
          },
          {
            stepNumber: '04',
            stepTitle: 'Запуск',
            stepDescription: 'Активуємо рекламу та моніторимо результати',
          },
          {
            stepNumber: '05',
            stepTitle: 'Оптимізація',
            stepDescription: 'Покращуємо показники та звітуємо',
          },
        ],
        faq: [
          {
            question: 'Який мінімальний рекламний бюджет?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Рекомендуємо стартувати з бюджету від 300$ на місяць для тестування ефективності.',
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
        ],
        seo: {
          metaTitle: 'Контекстна реклама Google Ads | Від 8000 грн | ABECT',
          metaDescription: 'Професійне налаштування Google Ads. Підбір ключів, A/B тести, щотижневі звіти. Від 8000 грн. Перші результати за 7 днів ✓',
          metaKeywords: 'контекстна реклама, google ads, налаштування реклами, контекстна реклама ціна',
        },
      },
      // English data
      {
        title: 'Contextual Advertising',
        shortDescription: 'Setup and management of Google Ads campaigns to attract customers',
        customTimeline: '5-7 days',
        customDescription: 'Google Ads setup and management',
        customFeatures: [
          { feature: 'Competitor analysis' },
          { feature: 'Keyword research' },
          { feature: 'Campaign setup' },
          { feature: 'A/B testing' },
          { feature: 'Weekly reports' },
        ],
        detailedDescription: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Contextual advertising is an effective way to attract target audience through Google Ads. Your ads are shown to people already searching for your product.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        },
        process: [
          {
            stepNumber: '01',
            stepTitle: 'Audit and Analysis',
            stepDescription: 'We study your niche and competitors',
          },
          {
            stepNumber: '02',
            stepTitle: 'Strategy',
            stepDescription: 'We develop a promotion strategy',
          },
          {
            stepNumber: '03',
            stepTitle: 'Setup',
            stepDescription: 'We create campaigns and ads',
          },
          {
            stepNumber: '04',
            stepTitle: 'Launch',
            stepDescription: 'We activate ads and monitor results',
          },
          {
            stepNumber: '05',
            stepTitle: 'Optimization',
            stepDescription: 'We improve metrics and report',
          },
        ],
        faq: [
          {
            question: 'What is the minimum advertising budget?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'We recommend starting with a budget of $300 per month to test effectiveness.',
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
        ],
        seo: {
          metaTitle: 'Google Ads Contextual Advertising | From $320 | ABECT',
          metaDescription: 'Professional Google Ads setup. Keyword research, A/B tests, weekly reports. From $320. First results in 7 days ✓',
          metaKeywords: 'contextual advertising, google ads, advertising setup, contextual ads price',
        },
      },
    )
    console.log('✅ Contextual Advertising created\n')

    console.log('🎉 All services seeded successfully!')
    console.log('✨ You can now view them in the admin panel at /admin/collections/services')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding services:', error)
    process.exit(1)
  }
}

// Run the seed
seedServices()
