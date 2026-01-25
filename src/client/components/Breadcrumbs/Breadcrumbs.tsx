"use client"

import "./Breadcrumbs.scss"
import { Link } from "@/client/i18n/navigation"
import { useTranslations } from "next-intl"
import { JSX } from "react"

interface BreadcrumbsProps {
    chapter: "portfolio" | "services" | "blog" | "contacts" | "about" | "calculator";
    slug?: string;
    // Для блогу/сервісів: категорія між chapter та slug
    categorySlug?: string;
    categoryName?: string;
}

export default function Breadcrumbs({ chapter, slug, categorySlug, categoryName }: BreadcrumbsProps): JSX.Element {
    const t = useTranslations("Breadcrumbs")

    // Визначаємо позиції
    let position = 2;

    return (
        <nav className="breadcrumbs" itemScope itemType="https://schema.org/BreadcrumbList">
            <ol>
                {/* HOME */}
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <Link itemProp="item" href="/">
                        <span itemProp="name">{t("home")}</span>
                    </Link>
                    <meta itemProp="position" content="1" />
                </li>

                {/* CHAPTER */}
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    {(slug || categorySlug) ? (
                        <Link itemProp="item" href={`/${chapter}`}>
                            <span itemProp="name">{t(chapter)}</span>
                        </Link>
                    ) : (
                        <span itemProp="name">{t(chapter)}</span>
                    )}
                    <meta itemProp="position" content={String(position++)} />
                </li>

                {/* CATEGORY (тільки для блогу, якщо є) */}
                {categorySlug && categoryName && (
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        {slug ? (
                            <Link itemProp="item" href={`/${chapter}/${categorySlug}`}>
                                <span itemProp="name">{categoryName}</span>
                            </Link>
                        ) : (
                            <span itemProp="name">{categoryName}</span>
                        )}
                        <meta itemProp="position" content={String(position++)} />
                    </li>
                )}

                {/* SLUG (тільки якщо є) */}
                {slug && (
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <span itemProp="name">{slug}</span>
                        <meta itemProp="position" content={String(position)} />
                    </li>
                )}
            </ol>
        </nav>
    )
}
