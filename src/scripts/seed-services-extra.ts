import 'dotenv/config'
import { getPayload } from 'payload'
import type { DataFromCollectionSlug } from 'payload'
import config from '../payload.config'

const seedExtraServices = async () => {
  console.log('🌱 Starting Extra Services seed...\n')

  try {
    // Initialize Payload
    const payload = await getPayload({ config })

    // Helper function to create localized service
    const createService = async (ukData: Record<string, unknown>, enData: Record<string, unknown>) => {
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

    // Service 1: Telegram/Discord Bot Development
    console.log('🤖 Creating Bot Development service...')
    await createService(
      // Ukrainian data
      {
        title: 'Розробка Telegram/Discord ботів',
        slug: 'bot-development',
        shortDescription: 'Автоматизація бізнесу через чат-ботів: приймання замовлень, консультації, розсилки',
        category: 'web-development',
        order: 5,
        featured: false,
        status: 'published',
        hasWebliumOption: false,
        customPrice: 8000,
        customPriceCurrency: 'UAH',
        customTimeline: '7-14 днів',
        customDescription: 'Розробка функціонального бота під ваші бізнес-процеси',
        customFeatures: [
          { feature: 'Telegram або Discord бот' },
          { feature: 'Інтеграція з API та базами даних' },
          { feature: 'Панель адміністратора' },
          { feature: 'Аналітика та статистика' },
          { feature: 'Технічна підтримка місяць' },
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
                    text: 'Чат-боти — це ефективний інструмент автоматизації бізнесу. Telegram та Discord боти допомагають приймати замовлення, консультувати клієнтів, робити розсилки та збирати відгуки в автоматичному режимі 24/7.',
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
            stepTitle: 'Аналіз завдань',
            stepDescription: 'Визначаємо функціонал та сценарії роботи бота',
          },
          {
            stepNumber: '02',
            stepTitle: 'Розробка архітектури',
            stepDescription: 'Проектуємо структуру бота та інтеграції',
          },
          {
            stepNumber: '03',
            stepTitle: 'Програмування',
            stepDescription: 'Розробка бота та підключення необхідних API',
          },
          {
            stepNumber: '04',
            stepTitle: 'Тестування',
            stepDescription: 'Перевірка всіх сценаріїв та виправлення помилок',
          },
          {
            stepNumber: '05',
            stepTitle: 'Запуск та навчання',
            stepDescription: 'Розгортання бота та навчання вашої команди',
          },
        ],
        faq: [
          {
            question: 'Які функції можна реалізувати в боті?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Приймання замовлень, онлайн-консультації, розсилки, опитування, бронювання, інтеграція з CRM, оплата, видача контенту та багато іншого.',
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
          {
            question: 'Скільки коштує підтримка бота?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Перший місяць підтримки безкоштовно. Далі від 2000 грн/міс залежно від складності.',
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
        technologies: [
          { tech: 'Node.js' },
          { tech: 'Python' },
          { tech: 'Telegram Bot API' },
          { tech: 'Discord.js' },
        ],
        benefits: [
          {
            title: 'Автоматизація 24/7',
            description: 'Бот працює цілодобово без вихідних та відпусток',
            icon: '⏰',
          },
          {
            title: 'Економія часу',
            description: 'Автоматичні відповіді на типові питання клієнтів',
            icon: '⚡',
          },
          {
            title: 'Збільшення продажів',
            description: 'Миттєва обробка замовлень підвищує конверсію',
            icon: '📈',
          },
        ],
        seo: {
          metaTitle: 'Розробка Telegram та Discord ботів | Від 8000 грн | ABECT',
          metaDescription: 'Створення Telegram та Discord ботів для автоматизації бізнесу. Приймання замовлень, консультації, розсилки. Від 8000 грн. Запуск за 7-14 днів ✓',
          metaKeywords: 'розробка telegram бота, створити discord бота, чат бот на замовлення, telegram bot ціна',
        },
      },
      // English data
      {
        title: 'Telegram/Discord Bot Development',
        shortDescription: 'Business automation through chatbots: order processing, consultations, newsletters',
        customTimeline: '7-14 days',
        customDescription: 'Development of a functional bot for your business processes',
        customFeatures: [
          { feature: 'Telegram or Discord bot' },
          { feature: 'API and database integration' },
          { feature: 'Admin panel' },
          { feature: 'Analytics and statistics' },
          { feature: 'One month technical support' },
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
                    text: 'Chatbots are an effective business automation tool. Telegram and Discord bots help take orders, consult clients, send newsletters and collect feedback automatically 24/7.',
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
            stepTitle: 'Task Analysis',
            stepDescription: 'We define functionality and bot workflow scenarios',
          },
          {
            stepNumber: '02',
            stepTitle: 'Architecture Development',
            stepDescription: 'We design bot structure and integrations',
          },
          {
            stepNumber: '03',
            stepTitle: 'Programming',
            stepDescription: 'Bot development and necessary API connections',
          },
          {
            stepNumber: '04',
            stepTitle: 'Testing',
            stepDescription: 'Checking all scenarios and fixing bugs',
          },
          {
            stepNumber: '05',
            stepTitle: 'Launch and Training',
            stepDescription: 'Bot deployment and training your team',
          },
        ],
        faq: [
          {
            question: 'What features can be implemented in a bot?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Order processing, online consultations, newsletters, surveys, booking, CRM integration, payments, content delivery and much more.',
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
          {
            question: 'How much does bot support cost?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'First month of support is free. Then from $80/month depending on complexity.',
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
        benefits: [
          {
            title: '24/7 Automation',
            description: 'Bot works around the clock without weekends and vacations',
            icon: '⏰',
          },
          {
            title: 'Time Saving',
            description: 'Automatic answers to common customer questions',
            icon: '⚡',
          },
          {
            title: 'Increased Sales',
            description: 'Instant order processing increases conversion',
            icon: '📈',
          },
        ],
        seo: {
          metaTitle: 'Telegram & Discord Bot Development | From $320 | ABECT',
          metaDescription: 'Telegram and Discord bot development for business automation. Order processing, consultations, newsletters. From $320. Launch in 7-14 days ✓',
          metaKeywords: 'telegram bot development, create discord bot, custom chatbot, telegram bot price',
        },
      },
    )
    console.log('✅ Bot Development created\n')

    // Service 2: SEO Services
    console.log('📈 Creating SEO Services...')
    await createService(
      // Ukrainian data
      {
        title: 'SEO просування сайтів',
        slug: 'seo-services',
        shortDescription: 'Виведення сайту в ТОП Google: технічна оптимізація, контент, посилання',
        category: 'marketing',
        order: 6,
        featured: true,
        status: 'published',
        hasWebliumOption: false,
        customPrice: 12000,
        customPriceCurrency: 'UAH',
        customTimeline: 'від 3 місяців',
        customDescription: 'Комплексне SEO просування з гарантією результату',
        customFeatures: [
          { feature: 'Технічний аудит сайту' },
          { feature: 'Збір семантичного ядра' },
          { feature: 'Оптимізація контенту' },
          { feature: 'Нарощування посилань' },
          { feature: 'Щомісячні звіти' },
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
                    text: 'SEO просування — це комплекс заходів для виведення сайту в топ пошукових систем Google та Bing. Органічний трафік з пошуку приносить якісних клієнтів, які вже зацікавлені у вашому продукті.',
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
            stepTitle: 'Аудит сайту',
            stepDescription: 'Технічний аналіз та виявлення помилок',
          },
          {
            stepNumber: '02',
            stepTitle: 'Аналіз конкурентів',
            stepDescription: 'Вивчаємо ТОП-10 конкурентів у вашій ніші',
          },
          {
            stepNumber: '03',
            stepTitle: 'Семантичне ядро',
            stepDescription: 'Збір ключових слів для просування',
          },
          {
            stepNumber: '04',
            stepTitle: 'Оптимізація',
            stepDescription: 'Технічні та контентні покращення',
          },
          {
            stepNumber: '05',
            stepTitle: 'Посилання та моніторинг',
            stepDescription: 'Нарощування посилань та відстеження позицій',
          },
        ],
        faq: [
          {
            question: 'Коли будуть перші результати?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Перші зміни в позиціях видно через 1-2 місяці. Стабільні результати — через 3-6 місяців залежно від конкуренції.',
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
          {
            question: 'Чи гарантуєте ви вихід в ТОП-1?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Ми гарантуємо вихід в ТОП-10 по низькочастотних запитах. ТОП-1 залежить від багатьох факторів, але ми робимо все можливе для максимального результату.',
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
        benefits: [
          {
            title: 'Довгостроковий ефект',
            description: 'Органічний трафік працює роками після оптимізації',
            icon: '📊',
          },
          {
            title: 'Якісний трафік',
            description: 'Відвідувачі з пошуку мають високий намір до покупки',
            icon: '🎯',
          },
          {
            title: 'ROI 300-500%',
            description: 'SEO окупається вже через 6-9 місяців',
            icon: '💰',
          },
        ],
        seo: {
          metaTitle: 'SEO просування сайтів | Виведення в ТОП Google | ABECT',
          metaDescription: 'Професійне SEO просування сайтів від 12000 грн/міс. Технічний аудит, оптимізація контенту, посилання. Гарантія виходу в ТОП-10 ✓',
          metaKeywords: 'seo просування, оптимізація сайту, вивести сайт в топ google, seo послуги ціна',
        },
      },
      // English data
      {
        title: 'SEO Services',
        shortDescription: 'Get your website to TOP of Google: technical optimization, content, link building',
        customTimeline: 'from 3 months',
        customDescription: 'Comprehensive SEO promotion with guaranteed results',
        customFeatures: [
          { feature: 'Technical site audit' },
          { feature: 'Keyword research' },
          { feature: 'Content optimization' },
          { feature: 'Link building' },
          { feature: 'Monthly reports' },
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
                    text: 'SEO promotion is a set of measures to bring your website to the top of Google and Bing search engines. Organic search traffic brings quality customers who are already interested in your product.',
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
            stepTitle: 'Site Audit',
            stepDescription: 'Technical analysis and error detection',
          },
          {
            stepNumber: '02',
            stepTitle: 'Competitor Analysis',
            stepDescription: 'We study TOP-10 competitors in your niche',
          },
          {
            stepNumber: '03',
            stepTitle: 'Keyword Research',
            stepDescription: 'Collecting keywords for promotion',
          },
          {
            stepNumber: '04',
            stepTitle: 'Optimization',
            stepDescription: 'Technical and content improvements',
          },
          {
            stepNumber: '05',
            stepTitle: 'Link Building & Monitoring',
            stepDescription: 'Building links and tracking positions',
          },
        ],
        faq: [
          {
            question: 'When will I see first results?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'First changes in positions are visible in 1-2 months. Stable results in 3-6 months depending on competition.',
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
          {
            question: 'Do you guarantee TOP-1 ranking?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'We guarantee TOP-10 for low-frequency queries. TOP-1 depends on many factors, but we do everything possible for maximum results.',
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
        benefits: [
          {
            title: 'Long-term Effect',
            description: 'Organic traffic works for years after optimization',
            icon: '📊',
          },
          {
            title: 'Quality Traffic',
            description: 'Search visitors have high purchase intent',
            icon: '🎯',
          },
          {
            title: '300-500% ROI',
            description: 'SEO pays off in 6-9 months',
            icon: '💰',
          },
        ],
        seo: {
          metaTitle: 'SEO Services | Get to TOP of Google | ABECT',
          metaDescription: 'Professional SEO promotion from $480/month. Technical audit, content optimization, link building. Guaranteed TOP-10 ranking ✓',
          metaKeywords: 'seo services, website optimization, get to top google, seo promotion price',
        },
      },
    )
    console.log('✅ SEO Services created\n')

    // Service 3: SMM & Social Media Management
    console.log('📱 Creating SMM Services...')
    await createService(
      // Ukrainian data
      {
        title: 'SMM та ведення соціальних мереж',
        slug: 'smm-services',
        shortDescription: 'Просування в Instagram, Facebook, TikTok: контент, реклама, комунікація',
        category: 'marketing',
        order: 7,
        featured: true,
        status: 'published',
        hasWebliumOption: false,
        customPrice: 10000,
        customPriceCurrency: 'UAH',
        customTimeline: 'від 1 місяця',
        customDescription: 'Комплексне ведення соцмереж з створенням контенту',
        customFeatures: [
          { feature: 'Стратегія та контент-план' },
          { feature: 'Створення постів та сторіз' },
          { feature: 'Комунікація з підписниками' },
          { feature: 'Таргетована реклама' },
          { feature: 'Аналітика та звіти' },
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
                    text: 'SMM (Social Media Marketing) — це просування бізнесу через соціальні мережі. Професійне ведення Instagram, Facebook та TikTok допомагає залучати нових клієнтів, будувати довіру до бренду та збільшувати продажі.',
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
            stepTitle: 'Аналіз та стратегія',
            stepDescription: 'Вивчаємо аудиторію та розробляємо SMM-стратегію',
          },
          {
            stepNumber: '02',
            stepTitle: 'Контент-план',
            stepDescription: 'Створюємо план публікацій на місяць',
          },
          {
            stepNumber: '03',
            stepTitle: 'Створення контенту',
            stepDescription: 'Дизайн постів, написання текстів, відео',
          },
          {
            stepNumber: '04',
            stepTitle: 'Публікація та комунікація',
            stepDescription: 'Розміщення контенту та спілкування з аудиторією',
          },
          {
            stepNumber: '05',
            stepTitle: 'Аналітика',
            stepDescription: 'Аналіз результатів та оптимізація стратегії',
          },
        ],
        faq: [
          {
            question: 'Скільки постів входить у вартість?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Базовий пакет включає 12-15 постів на місяць (3-4 на тиждень) + сторіз щодня. Додаткові пости розраховуються окремо.',
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
          {
            question: 'Чи включена реклама в соцмережах?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Налаштування реклами входить у вартість. Рекламний бюджет оплачується окремо (рекомендуємо від $200/міс).',
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
        benefits: [
          {
            title: 'Постійна присутність',
            description: 'Ваш бренд завжди на зв\'язку з аудиторією',
            icon: '🎯',
          },
          {
            title: 'Лояльність клієнтів',
            description: 'Якісний контент будує довіру до бренду',
            icon: '❤️',
          },
          {
            title: 'Прямі продажі',
            description: 'До 30% продажів приходять із соцмереж',
            icon: '💸',
          },
        ],
        seo: {
          metaTitle: 'SMM ведення соціальних мереж | Instagram, Facebook, TikTok | ABECT',
          metaDescription: 'Професійне SMM ведення від 10000 грн/міс. Контент, реклама, комунікація. Instagram, Facebook, TikTok. Збільшення продажів через соцмережі ✓',
          metaKeywords: 'smm послуги, ведення instagram, просування в соцмережах, smm manager ціна',
        },
      },
      // English data
      {
        title: 'SMM & Social Media Management',
        shortDescription: 'Instagram, Facebook, TikTok promotion: content, ads, community management',
        customTimeline: 'from 1 month',
        customDescription: 'Comprehensive social media management with content creation',
        customFeatures: [
          { feature: 'Strategy and content plan' },
          { feature: 'Posts and stories creation' },
          { feature: 'Community management' },
          { feature: 'Targeted advertising' },
          { feature: 'Analytics and reports' },
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
                    text: 'SMM (Social Media Marketing) is business promotion through social networks. Professional management of Instagram, Facebook and TikTok helps attract new customers, build brand trust and increase sales.',
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
            stepTitle: 'Analysis and Strategy',
            stepDescription: 'We study audience and develop SMM strategy',
          },
          {
            stepNumber: '02',
            stepTitle: 'Content Plan',
            stepDescription: 'We create a monthly publication plan',
          },
          {
            stepNumber: '03',
            stepTitle: 'Content Creation',
            stepDescription: 'Post design, copywriting, video production',
          },
          {
            stepNumber: '04',
            stepTitle: 'Publishing and Communication',
            stepDescription: 'Content posting and audience engagement',
          },
          {
            stepNumber: '05',
            stepTitle: 'Analytics',
            stepDescription: 'Results analysis and strategy optimization',
          },
        ],
        faq: [
          {
            question: 'How many posts are included in the price?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Basic package includes 12-15 posts per month (3-4 per week) + daily stories. Additional posts are calculated separately.',
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
          {
            question: 'Is social media advertising included?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Ad setup is included. Advertising budget is paid separately (we recommend from $200/month).',
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
        benefits: [
          {
            title: 'Constant Presence',
            description: 'Your brand is always in touch with the audience',
            icon: '🎯',
          },
          {
            title: 'Customer Loyalty',
            description: 'Quality content builds brand trust',
            icon: '❤️',
          },
          {
            title: 'Direct Sales',
            description: 'Up to 30% of sales come from social media',
            icon: '💸',
          },
        ],
        seo: {
          metaTitle: 'SMM & Social Media Management | Instagram, Facebook, TikTok | ABECT',
          metaDescription: 'Professional SMM management from $400/month. Content, ads, community management. Instagram, Facebook, TikTok. Increase sales through social media ✓',
          metaKeywords: 'smm services, instagram management, social media promotion, smm manager price',
        },
      },
    )
    console.log('✅ SMM Services created\n')

    // Service 4: Custom Project
    console.log('🎯 Creating Custom Project service...')
    await createService(
      // Ukrainian data
      {
        title: 'Індивідуальне замовлення',
        slug: 'custom-project',
        shortDescription: 'Нестандартні проєкти під ваші унікальні завдання: від ідеї до реалізації',
        category: 'web-development',
        order: 8,
        featured: false,
        status: 'published',
        hasWebliumOption: false,
        customPrice: 5000,
        customPriceCurrency: 'UAH',
        customTimeline: 'обговорюється',
        customDescription: 'Розробка унікального рішення за вашими вимогами',
        customFeatures: [
          { feature: 'Індивідуальний підхід' },
          { feature: 'Будь-який стек технологій' },
          { feature: 'Гнучкі терміни' },
          { feature: 'Поетапна оплата' },
          { feature: 'Повний цикл розробки' },
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
                    text: 'Не знайшли потрібну послугу? Ми реалізуємо нестандартні проєкти будь-якої складності: веб-застосунки, SaaS-платформи, маркетплейси, CRM-системи, інтеграції, парсери та багато іншого. Опишіть свою ідею — ми знайдемо рішення!',
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
            stepTitle: 'Аналіз завдання',
            stepDescription: 'Детально обговорюємо ваші потреби та цілі',
          },
          {
            stepNumber: '02',
            stepTitle: 'Оцінка та пропозиція',
            stepDescription: 'Розраховуємо вартість і терміни реалізації',
          },
          {
            stepNumber: '03',
            stepTitle: 'Узгодження',
            stepDescription: 'Фіксуємо вимоги, етапи та умови',
          },
          {
            stepNumber: '04',
            stepTitle: 'Розробка',
            stepDescription: 'Реалізація проєкту з регулярною звітністю',
          },
          {
            stepNumber: '05',
            stepTitle: 'Здача та підтримка',
            stepDescription: 'Тестування, запуск та подальша підтримка',
          },
        ],
        faq: [
          {
            question: 'Які проєкти ви реалізуєте?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Веб-застосунки, SaaS-платформи, маркетплейси, CRM/ERP системи, парсери даних, інтеграції, автоматизація, мобільні додатки, API та багато іншого.',
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
          {
            question: 'Як формується ціна?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Ціна залежить від складності, термінів та використовуваних технологій. Після детального брифу ми надаємо точну оцінку. Мінімальна вартість — від 5000 грн.',
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
        benefits: [
          {
            title: '100% під вас',
            description: 'Рішення створюється під ваші унікальні потреби',
            icon: '🎨',
          },
          {
            title: 'Прозорість',
            description: 'Чіткі етапи, звіти та контроль на кожному кроці',
            icon: '📊',
          },
          {
            title: 'Масштабованість',
            description: 'Архітектура дозволяє легко розвивати проєкт',
            icon: '🚀',
          },
        ],
        seo: {
          metaTitle: 'Індивідуальне замовлення веб-розробки | Від 5000 грн | ABECT',
          metaDescription: 'Нестандартні веб-проєкти під ключ: SaaS, маркетплейси, CRM, інтеграції. Повний цикл розробки. Від 5000 грн. Безкоштовна консультація ✓',
          metaKeywords: 'індивідуальна розробка, замовити веб проект, custom development, розробка на замовлення',
        },
      },
      // English data
      {
        title: 'Custom Project',
        shortDescription: 'Non-standard projects for your unique tasks: from idea to implementation',
        customTimeline: 'negotiable',
        customDescription: 'Development of a unique solution according to your requirements',
        customFeatures: [
          { feature: 'Individual approach' },
          { feature: 'Any technology stack' },
          { feature: 'Flexible deadlines' },
          { feature: 'Staged payment' },
          { feature: 'Full development cycle' },
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
                    text: 'Haven\'t found the service you need? We implement non-standard projects of any complexity: web applications, SaaS platforms, marketplaces, CRM systems, integrations, parsers and much more. Describe your idea - we will find a solution!',
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
            stepTitle: 'Task Analysis',
            stepDescription: 'We discuss your needs and goals in detail',
          },
          {
            stepNumber: '02',
            stepTitle: 'Estimate and Proposal',
            stepDescription: 'We calculate cost and implementation timeline',
          },
          {
            stepNumber: '03',
            stepTitle: 'Agreement',
            stepDescription: 'We fix requirements, stages and terms',
          },
          {
            stepNumber: '04',
            stepTitle: 'Development',
            stepDescription: 'Project implementation with regular reporting',
          },
          {
            stepNumber: '05',
            stepTitle: 'Delivery and Support',
            stepDescription: 'Testing, launch and ongoing support',
          },
        ],
        faq: [
          {
            question: 'What projects do you implement?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Web applications, SaaS platforms, marketplaces, CRM/ERP systems, data parsers, integrations, automation, mobile apps, API and much more.',
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
          {
            question: 'How is the price formed?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Price depends on complexity, timeline and technologies used. After detailed brief, we provide accurate estimate. Minimum cost - from $200.',
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
        benefits: [
          {
            title: '100% for You',
            description: 'Solution created for your unique needs',
            icon: '🎨',
          },
          {
            title: 'Transparency',
            description: 'Clear stages, reports and control at every step',
            icon: '📊',
          },
          {
            title: 'Scalability',
            description: 'Architecture allows easy project development',
            icon: '🚀',
          },
        ],
        seo: {
          metaTitle: 'Custom Web Development | From $200 | ABECT',
          metaDescription: 'Turnkey non-standard web projects: SaaS, marketplaces, CRM, integrations. Full development cycle. From $200. Free consultation ✓',
          metaKeywords: 'custom development, order web project, bespoke development, custom software',
        },
      },
    )
    console.log('✅ Custom Project created\n')

    console.log('🎉 All extra services seeded successfully!')
    console.log('✨ Total services in database: 8')
    console.log('📍 View at /admin/collections/services\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding extra services:', error)
    process.exit(1)
  }
}

// Run the seed
seedExtraServices()
