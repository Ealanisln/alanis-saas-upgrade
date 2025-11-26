import { createNavigation } from 'next-intl/navigation';
import { routing } from '@/i18n/routing';

// Create navigation using the shared routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing); 