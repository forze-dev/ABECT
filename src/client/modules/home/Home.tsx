import React, { JSX } from 'react';

import Hero from './Hero/Hero';
import Services from './Services/Services';
import Advantages from './Advantages/Advantages';

function Home(): JSX.Element {
	return (
		<main>
			<Hero />
			<Services />
			<Advantages />
		</main>
	);
}

export default Home