import React, { JSX } from 'react';

import Hero from './Hero/Hero';
import Services from './Services/Services';
import Portfolio from './Portfolio/Portfolio';
import Advantages from './Advantages/Advantages';

interface HomeProps {
	locale: string;
}

function Home({ locale }: HomeProps): JSX.Element {
	return (
		<main>
			<Hero />
			<Services />
			<Portfolio locale={locale}/>
			<Advantages />
		</main>
	);
}

export default Home