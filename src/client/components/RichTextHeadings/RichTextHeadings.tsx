'use client';
import { JSX } from 'react';
import type { Portfolio } from '@/payload-types';
import { generateSlug } from '@/utils/generateSlug';
import "./RichTextHeadings.scss"

interface RichTextHeadings {
    content: Portfolio["content"];
    title?: string;
}

export default function RichTextHeadings({ content, title = "Table of Contents" }: RichTextHeadings): JSX.Element | null {
    if (!content?.root?.children) return null;

    const headings: Array<{ id: string; text: string; }> = [];

    content.root.children.forEach((node: any, index: number) => {
        if (node.type === 'heading') {
            const level = Number(node.tag?.replace('h', '') || 0);

            if (level === 2) {
                const text = node.children?.map((c: any) => c.text || '').join('').trim();
                if (!text) return;

                const id = generateSlug(text)

                headings.push({ id, text });
            }
        }
    });

    if (headings.length === 0) return null;

    return (
        <nav
            role="navigation"
            aria-label={title}
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
            className='RichTextHeadings'
        >
            <div className="RichTextHeadings__title">{title}</div>
            <ol itemProp="about" className='RichTextHeadings__list'>
                {headings.map((h, idx) => (
                    <li
                        key={h.id}
                        itemProp="itemListElement"
                        itemScope
                        itemType="https://schema.org/ListItem"
                        className='RichTextHeadings__item'
                    >
                        <a
                            href={`#${h.id}`}
                            itemProp="url"
                        >
                            <span itemProp="name">{h.text}</span>
                        </a>
                        <meta itemProp="position" content={String(idx + 1)} />
                    </li>
                ))}
            </ol>
        </nav>
    );
}