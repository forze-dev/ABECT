# Blog секція - Документація

## Структура URL (SEO-оптимізована)

```
/blog                      → Всі статті (H1: "Блог")
/blog/[category]           → Статті категорії (H1: назва категорії)
/blog/[category]/[slug]    → Стаття
```

**Переваги для SEO:**
- Кожна категорія має свій унікальний URL
- Окремі meta tags для кожної категорії
- Schema.org CollectionPage для категорій
- Breadcrumbs: Home → Blog → Category → Article

---

## Порівняння Portfolio vs Blog

| Аспект | Portfolio | Blog |
|--------|-----------|------|
| Колекція | `portfolio` | `posts` |
| Фільтрація | `service` (design/website/promotion) | `category` (relationship → categories) |
| Додаткові поля | client, projectUrl, type, order | author, tags, readTime |
| Зображення | `seo.ogImage` | `cover` |
| Дата | `projectDate` | `date` |
| URL структура | `/portfolio/[slug]` | `/blog/[category]/[slug]` |

---

## Структура файлів

```
src/
├── app/(frontend)/[locale]/blog/
│   ├── page.tsx                    # Всі статті
│   └── [category]/
│       ├── page.tsx                # Статті категорії
│       └── [slug]/
│           └── page.tsx            # Стаття
│
├── client/
│   ├── lib/
│   │   └── blog.ts                 # Data fetching функції
│   │
│   ├── modules/
│   │   ├── blog/
│   │   │   ├── BlogPage/
│   │   │   │   ├── BlogPage.tsx    # Client component зі списком
│   │   │   │   └── BlogPage.scss
│   │   │   └── BlogFilter/
│   │   │       ├── BlogFilter.tsx  # Фільтр по категоріях
│   │   │       └── BlogFilter.scss
│   │   │
│   │   └── article/
│   │       ├── Article.tsx         # Container для статті
│   │       ├── ArticleHero/
│   │       │   ├── ArticleHero.tsx
│   │       │   └── ArticleHero.scss
│   │       ├── ArticleContent/
│   │       │   ├── ArticleContent.tsx
│   │       │   └── ArticleContent.scss
│   │       └── RelatedArticles/
│   │           ├── RelatedArticles.tsx
│   │           └── RelatedArticles.scss
│   │
│   └── components/
│       ├── BlogCard/
│       │   ├── BlogCard.tsx
│       │   └── BlogCard.scss
│       └── BlogList/
│           ├── BlogList.tsx
│           └── BlogList.scss
```

---

## 1. Data Fetching Layer

### `src/client/lib/blog.ts`

```typescript
import type { Post, Category } from '@/payload-types';

interface PayloadResponse<T> {
  docs: T[];
  totalDocs?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
}

// Сортування: featured → date (новіші першими)
function sortByFeaturedAndDate(a: Post, b: Post): number {
  if (a.featured && !b.featured) return -1;
  if (!a.featured && b.featured) return 1;
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

// Всі опубліковані статті
export async function getAllPosts(locale: string = 'uk'): Promise<Post[]>

// Featured статті для головної (4 шт)
export async function getFeaturedPosts(locale: string = 'uk'): Promise<Post[]>

// Одна стаття по slug
export async function getPostBySlug(slug: string, locale: string = 'uk'): Promise<Post | null>

// Схожі статті (та сама категорія)
export async function getRelatedPosts(
  currentPostId: number,
  categoryId: number,
  locale: string = 'uk',
  limit: number = 3
): Promise<Post[]>

// Всі категорії для фільтра
export async function getAllCategories(locale: string = 'uk'): Promise<Category[]>
```

---

## 2. Server Pages

### `src/app/(frontend)/[locale]/blog/page.tsx`

```typescript
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/client/i18n/routing';
import { getAllPosts, getAllCategories } from '@/client/lib/blog';
import BlogPage from '@/client/modules/blog/BlogPage/BlogPage';
import type { Metadata } from 'next';

type Params = {
  params: Promise<{ locale: string }>;
};

// SSG для локалей
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// SEO Metadata
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogPage.seo' });

  // title, description, keywords з перекладів
  // OpenGraph, Twitter Card, alternates
}

// Server Component
export default async function BlogServerPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [posts, categories] = await Promise.all([
    getAllPosts(locale),
    getAllCategories(locale)
  ]);

  return <BlogPage locale={locale} initialPosts={posts} categories={categories} />;
}
```

### `src/app/(frontend)/[locale]/blog/[slug]/page.tsx`

```typescript
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPostBySlug, getRelatedPosts, getAllPosts } from '@/client/lib/blog';
import Article from '@/client/modules/article/Article';
import type { Metadata } from 'next';

type Params = {
  params: Promise<{ locale: string; slug: string }>;
};

// SSG для всіх статей
export async function generateStaticParams() {
  const postsUa = await getAllPosts('uk');
  const postsEn = await getAllPosts('en');

  return [
    ...postsUa.map((post) => ({ locale: 'ua', slug: post.slug })),
    ...postsEn.map((post) => ({ locale: 'en', slug: post.slug }))
  ];
}

// SEO Metadata з post.seo
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);

  if (!post) return { title: 'Post Not Found' };

  // metaTitle, metaDescription, cover як og:image
  // OpenGraph type: 'article'
  // publishedTime, authors
}

// Server Component
export default async function ArticlePage({ params }: Params) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  // Отримуємо category ID для related
  const categoryId = typeof post.category === 'object'
    ? post.category.id
    : post.category;

  const relatedPosts = await getRelatedPosts(post.id, categoryId, locale, 3);

  return (
    <>
      {/* JSON-LD Schema.org Article */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          image: post.cover?.url,
          author: {
            '@type': 'Person',
            name: post.author?.firstName + ' ' + post.author?.lastName
          },
          datePublished: post.date,
          dateModified: post.updatedAt,
          publisher: { '@type': 'Organization', name: 'ABECT' },
          wordCount: post.readTime * 200, // приблизно
          timeRequired: `PT${Math.ceil(post.readTime / 60)}M`
        })
      }} />

      {/* Breadcrumbs JSON-LD */}

      <Article post={post} relatedPosts={relatedPosts} locale={locale} />
    </>
  );
}
```

---

## 3. Client Components - Blog Module

### `src/client/modules/blog/BlogPage/BlogPage.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { Post, Category } from '@/payload-types';
import BlogFilter from '../BlogFilter/BlogFilter';
import BlogList from '@/client/components/BlogList/BlogList';
import Breadcrumbs from '@/client/components/Breadcrumbs/Breadcrumbs';
import './BlogPage.scss';

interface BlogPageProps {
  locale: string;
  initialPosts: Post[];
  categories: Category[];
}

export default function BlogPage({ locale, initialPosts, categories }: BlogPageProps) {
  const t = useTranslations('BlogPage');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Фільтрація по категорії
  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return initialPosts;
    return initialPosts.filter((post) => {
      const categoryId = typeof post.category === 'object'
        ? post.category.id
        : post.category;
      return String(categoryId) === activeFilter;
    });
  }, [activeFilter, initialPosts]);

  // Підрахунок для кожної категорії
  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialPosts.length };
    categories.forEach(cat => {
      counts[String(cat.id)] = initialPosts.filter(post => {
        const catId = typeof post.category === 'object' ? post.category.id : post.category;
        return catId === cat.id;
      }).length;
    });
    return counts;
  }, [initialPosts, categories]);

  return (
    <section className="blog-page" itemScope itemType="https://schema.org/Blog">
      <div className="container">
        <header className="blog-page__header">
          <h1 className="blog-page__title" itemProp="name">{t('title')}</h1>
          <p className="blog-page__subtitle" itemProp="description">{t('subtitle')}</p>
        </header>

        <Breadcrumbs chapter="blog" />

        <div className="blog-page__layout">
          <BlogFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            categories={categories}
            counts={filterCounts}
          />

          <div className="blog-page__content">
            {filteredPosts.length > 0 ? (
              <>
                <BlogList posts={filteredPosts} locale={locale} startRows={2} />

                <footer className="blog-page__stats">
                  <p>{t('showingResults', { count: filteredPosts.length })}</p>
                  {activeFilter !== 'all' && (
                    <button onClick={() => setActiveFilter('all')}>
                      {t('viewAllButton')}
                    </button>
                  )}
                </footer>
              </>
            ) : (
              <div className="blog-page__empty">
                <h3>{t('noResults')}</h3>
                <p>{t('noResultsDescription')}</p>
                <button className="cta" onClick={() => setActiveFilter('all')}>
                  {t('viewAllButton')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

### `src/client/modules/blog/BlogFilter/BlogFilter.tsx`

```typescript
'use client';

import { useTranslations } from 'next-intl';
import type { Category } from '@/payload-types';
import './BlogFilter.scss';

interface BlogFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  categories: Category[];
  counts: Record<string, number>;
}

export default function BlogFilter({
  activeFilter,
  onFilterChange,
  categories,
  counts
}: BlogFilterProps) {
  const t = useTranslations('BlogPage.filter');

  // Динамічні фільтри з категорій
  const filters = [
    { value: 'all', label: t('all') },
    ...categories.map(cat => ({
      value: String(cat.id),
      label: cat.name // вже локалізовано
    }))
  ];

  return (
    <aside className="blog-filter" aria-label={t('ariaLabel')}>
      <h2 className="blog-filter__title">{t('title')}</h2>

      {/* Desktop & Tablet - Список */}
      <ul className="blog-filter__list" role="list">
        {filters.map((filter) => (
          <li key={filter.value} role="listitem">
            <button
              className={`blog-filter__item ${
                activeFilter === filter.value ? 'blog-filter__item--active' : ''
              }`}
              onClick={() => onFilterChange(filter.value)}
              aria-pressed={activeFilter === filter.value}
            >
              <span className="blog-filter__label">{filter.label}</span>
              <span className="blog-filter__count">{counts[filter.value] || 0}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Mobile - Select */}
      <div className="blog-filter__select-wrapper">
        <select
          className="blog-filter__select"
          value={activeFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          {filters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label} ({counts[filter.value] || 0})
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
```

---

## 4. Client Components - Article Module

### `src/client/modules/article/Article.tsx`

```typescript
import type { Post } from '@/payload-types';
import ArticleHero from './ArticleHero/ArticleHero';
import ArticleContent from './ArticleContent/ArticleContent';
import RelatedArticles from './RelatedArticles/RelatedArticles';

interface ArticleProps {
  post: Post;
  relatedPosts: Post[];
  locale: string;
}

export default function Article({ post, relatedPosts, locale }: ArticleProps) {
  return (
    <main>
      <ArticleHero post={post} locale={locale} />
      <ArticleContent post={post} />
      <RelatedArticles posts={relatedPosts} locale={locale} />
    </main>
  );
}
```

### `src/client/modules/article/ArticleHero/ArticleHero.tsx`

```typescript
'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Calendar, Clock, Eye, User } from 'lucide-react';
import Breadcrumbs from '@/client/components/Breadcrumbs/Breadcrumbs';
import type { Post, Media, User as UserType, Category } from '@/payload-types';
import './ArticleHero.scss';

interface ArticleHeroProps {
  post: Post;
  locale: string;
}

export default function ArticleHero({ post, locale }: ArticleHeroProps) {
  const t = useTranslations('ArticleDetail');

  const cover = post.cover as Media | null;
  const imageUrl = cover?.url || '/images/placeholder-blog.jpg';

  const author = post.author as UserType | null;
  const authorName = author
    ? `${author.firstName} ${author.lastName}`
    : 'ABECT';

  const category = post.category as Category | null;

  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === 'ua' ? 'uk-UA' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  // Конвертуємо секунди в хвилини
  const readTimeMinutes = Math.ceil(post.readTime / 60);

  return (
    <section className="article-hero">
      <div className="container">
        <Breadcrumbs chapter="blog" slug={post.title} />

        <div className="article-hero__content">
          {/* Cover Image */}
          <div className="article-hero__image">
            <Image
              src={imageUrl}
              alt={post.title}
              width={1200}
              height={600}
              priority
              className="article-hero__img"
            />
          </div>

          {/* Info */}
          <div className="article-hero__info">
            {/* Meta badges */}
            <div className="article-hero__meta">
              {category && (
                <span className="article-hero__category">
                  {category.name}
                </span>
              )}
              {post.featured && (
                <span className="article-hero__featured">
                  ★ {t('featured')}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="article-hero__title">{post.title}</h1>

            {/* Description */}
            <p className="article-hero__description">{post.description}</p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="article-hero__tags">
                {post.tags.map((tagObj, index) => (
                  <span key={index} className="article-hero__tag">
                    #{tagObj.tag}
                  </span>
                ))}
              </div>
            )}

            {/* Details bar */}
            <div className="article-hero__details">
              <div className="article-hero__detail">
                <User size={16} />
                <span>{authorName}</span>
              </div>

              <div className="article-hero__detail">
                <Calendar size={16} />
                <time dateTime={post.date}>{formattedDate}</time>
              </div>

              <div className="article-hero__detail">
                <Clock size={16} />
                <span>{readTimeMinutes} {t('minRead')}</span>
              </div>

              {post.viewCount !== null && (
                <div className="article-hero__detail">
                  <Eye size={16} />
                  <span>{post.viewCount} {t('views')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### `src/client/modules/article/ArticleContent/ArticleContent.tsx`

```typescript
'use client';

import type { Post, User } from '@/payload-types';
import RichTextWithAnchors from '@/client/components/RichText/RichText';
import RichTextHeadings from '@/client/components/RichTextHeadings/RichTextHeadings';
import './ArticleContent.scss';

interface ArticleContentProps {
  post: Post;
}

export default function ArticleContent({ post }: ArticleContentProps) {
  const author = post.author as User | null;
  const authorName = author
    ? `${author.firstName} ${author.lastName}`
    : 'ABECT Studio';

  return (
    <section
      className="article-content"
      itemScope
      itemType="https://schema.org/Article"
    >
      <div className="container">
        <div className="article-content__wrapper">
          <aside className="article-content__sidebar" role="complementary">
            <RichTextHeadings content={post.content} />
          </aside>

          <article className="article-content__article" itemProp="articleBody">
            <meta itemProp="headline" content={post.title} />
            <meta itemProp="description" content={post.description} />
            <meta itemProp="datePublished" content={post.date} />
            <span itemProp="author" itemScope itemType="https://schema.org/Person" style={{ display: 'none' }}>
              <meta itemProp="name" content={authorName} />
            </span>

            <RichTextWithAnchors data={post.content} />
          </article>
        </div>
      </div>
    </section>
  );
}
```

### `src/client/modules/article/RelatedArticles/RelatedArticles.tsx`

```typescript
'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/client/i18n/navigation';
import type { Post } from '@/payload-types';
import BlogList from '@/client/components/BlogList/BlogList';
import './RelatedArticles.scss';

interface RelatedArticlesProps {
  posts: Post[];
  locale: string;
}

export default function RelatedArticles({ posts, locale }: RelatedArticlesProps) {
  const t = useTranslations('ArticleDetail.related');

  if (!posts || posts.length === 0) return null;

  return (
    <section className="related-articles">
      <header className="related-articles__header">
        <h2 className="related-articles__title">{t('title')}</h2>
        <p className="related-articles__subtitle">{t('subtitle')}</p>
      </header>

      <BlogList posts={posts} locale={locale} startRows={3} />

      <footer className="related-articles__footer">
        <Link href="/blog" className="cta cta-secondary">
          {t('viewAll')}
        </Link>
      </footer>
    </section>
  );
}
```

---

## 5. Shared Components

### `src/client/components/BlogList/BlogList.tsx`

```typescript
'use client';

import type { Post } from '@/payload-types';
import BlogCard from '../BlogCard/BlogCard';
import './BlogList.scss';

interface BlogListProps {
  posts: Post[];
  locale: string;
  startRows?: number; // 1-4 колонки
}

export default function BlogList({ posts, locale, startRows = 3 }: BlogListProps) {
  if (!posts?.length) return null;

  return (
    <div
      className={`blog-list blog-list__rows--${startRows}`}
      role="list"
      aria-label="Список статей блогу"
    >
      {posts.map((post) => (
        <div key={post.id} role="listitem">
          <BlogCard post={post} locale={locale} />
        </div>
      ))}
    </div>
  );
}
```

### `src/client/components/BlogCard/BlogCard.tsx`

```typescript
'use client';

import Image from 'next/image';
import { Link } from '@/client/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';
import type { Post, Media, Category, User } from '@/payload-types';
import './BlogCard.scss';

interface BlogCardProps {
  post: Post;
  locale: string;
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  const t = useTranslations('Common.BlogCard');

  const cover = post.cover as Media | null;
  const imageUrl = cover?.url || '/images/placeholder-blog.jpg';

  const category = post.category as Category | null;
  const author = post.author as User | null;

  const formattedDate = new Date(post.date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long'
  });

  const readTimeMinutes = Math.ceil(post.readTime / 60);

  return (
    <article
      className="blog-card"
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="blog-card__link"
        aria-label={`${t('readArticle')}: ${post.title}`}
      >
        {/* Cover Image */}
        <div className="blog-card__image">
          <Image
            src={imageUrl}
            alt={post.title}
            width={600}
            height={400}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="blog-card__img"
            itemProp="image"
          />
          <div className="blog-card__overlay">
            <span className="blog-card__cta">
              {t('readArticle')} →
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="blog-card__content">
          {/* Meta */}
          <div className="blog-card__meta">
            {category && (
              <span className="blog-card__category" itemProp="keywords">
                {category.name}
              </span>
            )}
            {post.featured && (
              <span className="blog-card__featured" title={t('featured')}>
                ★
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="blog-card__title" itemProp="headline">
            {post.title}
          </h3>

          {/* Description */}
          <p className="blog-card__description" itemProp="description">
            {post.description}
          </p>

          {/* Info bar */}
          <div className="blog-card__info">
            <div className="blog-card__author">
              {author && (
                <span itemProp="author">{author.firstName} {author.lastName}</span>
              )}
            </div>
            <div className="blog-card__details">
              <span className="blog-card__date">
                <time dateTime={post.date} itemProp="datePublished">
                  {formattedDate}
                </time>
              </span>
              <span className="blog-card__read-time">
                <Clock size={14} />
                {readTimeMinutes} {t('min')}
              </span>
            </div>
          </div>
        </div>

        {/* Schema.org meta */}
        <meta itemProp="publisher" content="ABECT" />
        <link itemProp="url" href={`/${locale}/blog/${post.slug}`} />
      </Link>
    </article>
  );
}
```

---

## 6. Стилі (SCSS)

Всі стилі копіюємо з Portfolio і адаптуємо:

| Portfolio | Blog |
|-----------|------|
| `.portfolio-page` | `.blog-page` |
| `.portfolio-filter` | `.blog-filter` |
| `.portfolio-card` | `.blog-card` |
| `.portfolio-list` | `.blog-list` |
| `.project-hero` | `.article-hero` |
| `.project-content` | `.article-content` |
| `.related-projects` | `.related-articles` |

### Відмінності в стилях BlogCard:

```scss
.blog-card {
  // Категорія замість service badge
  &__category {
    color: var(--accent);
    background: var(--accent-alpha-10);
    // Один колір для всіх категорій
  }

  // Додатковий елемент: read time
  &__read-time {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: var(--nav-text);
  }

  // Автор в info bar
  &__author {
    font-size: 14px;
    font-weight: 500;
    color: var(--white);
  }
}
```

### Відмінності в ArticleHero:

```scss
.article-hero {
  // Теги
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }

  &__tag {
    font-size: 13px;
    color: var(--accent);
    background: var(--accent-alpha-05);
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid var(--accent-alpha-10);
  }

  // Категорія один колір (не як service badges)
  &__category {
    color: var(--accent);
    background: var(--accent-alpha-10);
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
  }
}
```

---

## 7. Переклади (i18n)

### `messages/ua.json` (додати)

```json
{
  "BlogPage": {
    "title": "Блог",
    "subtitle": "Корисні статті про веб-розробку, дизайн та маркетинг",
    "showingResults": "Показано {count} статей",
    "viewAllButton": "Показати всі",
    "noResults": "Статей не знайдено",
    "noResultsDescription": "Спробуйте вибрати іншу категорію",
    "filter": {
      "title": "Категорії",
      "all": "Всі статті",
      "ariaLabel": "Фільтр по категоріях",
      "selectAriaLabel": "Виберіть категорію"
    },
    "seo": {
      "title": "Блог | ABECT",
      "description": "Читайте наші статті про веб-розробку, дизайн та digital-маркетинг",
      "keywords": "блог, статті, веб-розробка, дизайн, маркетинг"
    }
  },
  "ArticleDetail": {
    "featured": "Рекомендовано",
    "minRead": "хв читання",
    "views": "переглядів",
    "related": {
      "title": "Схожі статті",
      "subtitle": "Читайте також інші корисні матеріали",
      "viewAll": "Всі статті"
    }
  },
  "Common": {
    "BlogCard": {
      "readArticle": "Читати статтю",
      "featured": "Рекомендовано",
      "min": "хв"
    }
  },
  "Breadcrumbs": {
    "blog": "Блог"
  }
}
```

### `messages/en.json` (додати)

```json
{
  "BlogPage": {
    "title": "Blog",
    "subtitle": "Useful articles about web development, design and marketing",
    "showingResults": "Showing {count} articles",
    "viewAllButton": "View all",
    "noResults": "No articles found",
    "noResultsDescription": "Try selecting a different category",
    "filter": {
      "title": "Categories",
      "all": "All articles",
      "ariaLabel": "Filter by category",
      "selectAriaLabel": "Select category"
    },
    "seo": {
      "title": "Blog | ABECT",
      "description": "Read our articles about web development, design and digital marketing",
      "keywords": "blog, articles, web development, design, marketing"
    }
  },
  "ArticleDetail": {
    "featured": "Featured",
    "minRead": "min read",
    "views": "views",
    "related": {
      "title": "Related Articles",
      "subtitle": "Read more useful content",
      "viewAll": "All articles"
    }
  },
  "Common": {
    "BlogCard": {
      "readArticle": "Read article",
      "featured": "Featured",
      "min": "min"
    }
  },
  "Breadcrumbs": {
    "blog": "Blog"
  }
}
```

---

## 8. Візуальна структура сторінок

### `/blog` - Список статей

```
┌─────────────────────────────────────────────────────────┐
│                      Header                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                        Блог                             │
│     Корисні статті про веб-розробку, дизайн...         │
│                                                         │
│  Home / Блог                                            │
│                                                         │
├─────────────┬───────────────────────────────────────────┤
│ Категорії   │                                           │
│             │  ┌─────────┐ ┌─────────┐                  │
│ [Всі (12)]  │  │ Card 1  │ │ Card 2  │                  │
│ [Dev (5)]   │  │ ┌─────┐ │ │ ┌─────┐ │                  │
│ [Design(4)] │  │ │ Img │ │ │ │ Img │ │                  │
│ [Marketing] │  │ └─────┘ │ │ └─────┘ │                  │
│             │  │ [Cat] ★ │ │ [Cat]   │                  │
│             │  │ Title   │ │ Title   │                  │
│             │  │ Desc... │ │ Desc... │                  │
│             │  │─────────│ │─────────│                  │
│             │  │Author|📅│ │Author|📅│                  │
│             │  └─────────┘ └─────────┘                  │
│             │                                           │
│             │  ─────────────────────────────────────    │
│             │  Показано 12 статей    [Показати всі]     │
├─────────────┴───────────────────────────────────────────┤
│                      Footer                             │
└─────────────────────────────────────────────────────────┘
```

### `/blog/[slug]` - Деталі статті

```
┌─────────────────────────────────────────────────────────┐
│                      Header                             │
├─────────────────────────────────────────────────────────┤
│  Home / Блог / Назва статті...                          │
│                                                         │
│  ┌─────────────────────┬───────────────────────────┐    │
│  │                     │ [Категорія] ★ Featured    │    │
│  │   Cover Image       │                           │    │
│  │   1200 x 600        │ Заголовок статті          │    │
│  │                     │                           │    │
│  │                     │ Короткий опис статті...   │    │
│  │                     │                           │    │
│  │                     │ #tag1 #tag2 #tag3         │    │
│  │                     │ ──────────────────────    │    │
│  │                     │ 👤 Author | 📅 Date |     │    │
│  │                     │ ⏱ 5 хв | 👁 1234 views   │    │
│  └─────────────────────┴───────────────────────────┘    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┬───────────────────────────────────┐    │
│  │ Зміст       │                                   │    │
│  │             │  ## Заголовок H2                  │    │
│  │ 1. Вступ    │                                   │    │
│  │ 2. Основна  │  Текст статті...                  │    │
│  │ 3. Висновки │                                   │    │
│  │             │  ## Наступний H2                  │    │
│  │ (sticky)    │                                   │    │
│  └─────────────┴───────────────────────────────────┘    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    Схожі статті                         │
│        Читайте також інші корисні матеріали            │
│                                                         │
│    ┌─────────┐ ┌─────────┐ ┌─────────┐                 │
│    │ Card 1  │ │ Card 2  │ │ Card 3  │                 │
│    └─────────┘ └─────────┘ └─────────┘                 │
│                                                         │
│             ─────────────────────────                   │
│                   [Всі статті]                          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                      Footer                             │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Порядок імплементації

### Фаза 1: Data Layer
1. ✅ Колекція `Posts` вже існує
2. [ ] Створити `src/client/lib/blog.ts`

### Фаза 2: Shared Components
3. [ ] Створити `BlogCard` компонент
4. [ ] Створити `BlogList` компонент

### Фаза 3: Blog List Page
5. [ ] Створити `BlogFilter` компонент
6. [ ] Створити `BlogPage` модуль
7. [ ] Створити `/blog/page.tsx` серверну сторінку

### Фаза 4: Article Detail Page
8. [ ] Створити `ArticleHero` компонент
9. [ ] Створити `ArticleContent` компонент
10. [ ] Створити `RelatedArticles` компонент
11. [ ] Створити `Article` container
12. [ ] Створити `/blog/[slug]/page.tsx` серверну сторінку

### Фаза 5: Integration
13. [ ] Додати переклади в `messages/ua.json` та `messages/en.json`
14. [ ] Оновити `Breadcrumbs` (якщо потрібно)
15. [ ] Додати посилання на блог в Header/Footer (якщо немає)

### Фаза 6: Testing
16. [ ] Перевірити SSG (`generateStaticParams`)
17. [ ] Перевірити SEO metadata
18. [ ] Перевірити Schema.org JSON-LD
19. [ ] Перевірити адаптивність
20. [ ] Перевірити фільтрацію по категоріях

---

## 10. Відмінності від Portfolio

| Аспект | Portfolio | Blog |
|--------|-----------|------|
| Фільтр | Статичний (3 types) | Динамічний (з categories API) |
| Badge | service-based кольори | Один колір для категорії |
| Hero | client, projectUrl | author, tags, readTime |
| Card | client + date | author + date + readTime |
| Schema | CreativeWork | BlogPosting/Article |
| Related | По service | По category |
