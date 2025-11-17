'use client';

import { JSX } from 'react';
import type { Portfolio } from '@/payload-types';
import RichTextWithAnchors from '@/client/components/RichText/RichText';
import RichTextHeadings from '@/client/components/RichTextHeadings/RichTextHeadings';
import './ProjectContent.scss';

interface ProjectContentProps {
	project: Portfolio;
	author?: string;
}

export default function ProjectContent({
	project,
	author = "ABECT Studio"
}: ProjectContentProps): JSX.Element {
	return (
		<section
			className='project-content'
			itemScope
			itemType="https://schema.org/Article"
		>
			<div className="container">
				<div className="project-content__wrapper">
					<aside
						className="project-content__sidebar"
						role="complementary"
						aria-label="Table of contents"
					>
						<RichTextHeadings content={project.content} />
					</aside>

					<article
						className="project-content__article"
						itemProp="articleBody"
					>
						<meta itemProp="headline" content={project.title} />
						<meta itemProp="description" content={project.shortDescription} />
						<meta itemProp="datePublished" content={project.projectDate} />
						<meta itemProp="dateModified" content={project.projectDate} />
						{author && (
							<span itemProp="author" itemScope itemType="https://schema.org/Organization" style={{ display: 'none' }}>
								<meta itemProp="name" content={author} />
							</span>
						)}

						<RichTextWithAnchors data={project.content} />
					</article>
				</div>
			</div>
		</section>
	);
}