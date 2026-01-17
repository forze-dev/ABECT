"use client"

import "./Breadcrumbs.scss"
import { Link } from "@/client/i18n/navigation"
import { useTranslations } from "next-intl"
import { JSX } from "react"

interface BreadcrumbsProps {
    chapter: "portfolio" | "services" | "blog" | "contacts" | "about";
    slug?: string;
}

export default function Breadcrumbs({ chapter, slug }: BreadcrumbsProps): JSX.Element {
    const t = useTranslations("Breadcrumbs")

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
                    {slug ? (
                        <Link itemProp="item" href={`/${chapter}`}>
                            <span itemProp="name">{t(chapter)}</span>
                        </Link>
                    ) : (
                        <span itemProp="name">{t(chapter)}</span>
                    )}
                    <meta itemProp="position" content="2" />
                </li>

                {/* SLUG (тільки якщо є) */}
                {slug && (
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <span itemProp="name">{slug}</span>
                        <meta itemProp="position" content="3" />
                    </li>
                )}
            </ol>
        </nav>
    )
}
