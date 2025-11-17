import React, { JSX } from 'react';
import type { Portfolio } from '@/payload-types';

import ProjectHero from './ProjectHero/ProjectHero';
import ProjectContent from './ProjectContent/ProjectContent';
import RelatedProjects from './RelatedProjects/RelatedProjects';

interface ProjectProps {
    project: Portfolio;
    relatedProjects: Portfolio[];
    locale: string;
}

function Project({ locale, relatedProjects, project }: ProjectProps): JSX.Element {

    console.log(project)

    return (
        <main>
            <ProjectHero project={project} locale={locale} />
            <ProjectContent project={project} />
            <RelatedProjects projects={relatedProjects} locale={locale} />
        </main>
    );
}

export default Project