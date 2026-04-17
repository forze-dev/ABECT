'use client';

import React from 'react';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react';
import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical';
import { generateSlug } from '@/utils/generateSlug';
import "./RichText.scss"

interface RichTextWithAnchorsProps {
    data: SerializedEditorState;
}

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
        if (node.tag === 'h2') {
            const text = nodesToJSX({ nodes: node.children });

            // Генеруємо текстове значення для slug
            const textValue = text
                .map(item => (typeof item === 'string' ? item : ''))
                .join('')
                .trim();

            const id = generateSlug(textValue);

            return <h2 id={id}>{text}</h2>;
        }

        // Для інших рівнів повертаємо звичайний заголовок
        const text = nodesToJSX({ nodes: node.children });
        const Tag = node.tag;
        return <Tag>{text}</Tag>;
    },
});

class RichTextErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: Error) { console.error('[RichText] render error:', error); }
    render() {
        if (this.state.hasError) return <div className="RichText RichText--error" />;
        return this.props.children;
    }
}

export default function RichTextWithAnchors({ data }: RichTextWithAnchorsProps) {
    return (
        <RichTextErrorBoundary>
            <div className="RichText">
                <RichText data={data} converters={jsxConverters} />
            </div>
        </RichTextErrorBoundary>
    )
}