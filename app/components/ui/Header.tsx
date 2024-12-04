'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/app/hooks/useAnalytics';

export default function Header() {
  const pathname = usePathname();
  const { trackEvent } = useAnalytics();

  const handleNavClick = (navItem: string) => {
    trackEvent('navigation_click', {
      from_path: pathname,
      to_nav_item: navItem
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          onClick={() => handleNavClick('home')}
        >
          Fixed or Custom
        </Link>

        <div className="flex items-center gap-8">
          <Link 
            href="/reviews" 
            className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            onClick={() => handleNavClick('reviews')}
          >
            Reviews
          </Link>
          <Link 
            href="/blog" 
            className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            onClick={() => handleNavClick('blog')}
          >
            Blog
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            onClick={() => handleNavClick('about')}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            onClick={() => handleNavClick('contact')}
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
} 