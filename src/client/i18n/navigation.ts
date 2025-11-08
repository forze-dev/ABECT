import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Обгортки навколо API навігації Next.js,
// які враховують конфігурацію маршрутизації
export const { Link, redirect, usePathname, useRouter, getPathname } =
	createNavigation(routing);