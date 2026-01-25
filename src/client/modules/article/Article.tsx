import { JSX } from 'react';
import type { Post } from '@/payload-types';
import ArticleHero from './ArticleHero/ArticleHero';
import ArticleContent from './ArticleContent/ArticleContent';
import RelatedArticles from './RelatedArticles/RelatedArticles';

interface ArticleProps {
	post: Post;
	relatedPosts: Post[];
	locale: string;
}

export default function Article({ post, relatedPosts, locale }: ArticleProps): JSX.Element {
	return (
		<main>
			<ArticleHero post={post} locale={locale} />
			<ArticleContent post={post} />
			<RelatedArticles posts={relatedPosts} locale={locale} />
		</main>
	);
}
