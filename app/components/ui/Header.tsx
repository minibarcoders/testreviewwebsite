'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAnalytics } from 'app/hooks/useAnalytics';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const { trackEvent } = useAnalytics();

  const handleNavClick = (navItem: string) => {
    trackEvent('navigation_click', {
      from_path: pathname,
      to_nav_item: navItem
    });
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-20"
    >
      <nav className="mx-auto max-w-7xl h-full px-8 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center space-x-3 group"
          onClick={() => handleNavClick('home')}
        >
          <div className="relative w-10 h-10 transform group-hover:scale-110 transition-transform">
            <Image
              src="/images/logo.png"
              alt="Fixed or Custom Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Fixed or Custom
          </span>
        </Link>

        <div className="flex items-center gap-12">
          {[
            { href: '/reviews', label: 'Reviews' },
            { href: '/blog', label: 'Blog' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' }
          ].map(({ href, label }) => (
            <Link 
              key={href}
              href={href} 
              className="relative group py-2"
              onClick={() => handleNavClick(label.toLowerCase())}
            >
              <span className={`text-base font-medium transition-colors ${
                isActive(href) 
                  ? 'text-indigo-600'
                  : 'text-gray-700 group-hover:text-indigo-600'
              }`}>
                {label}
              </span>
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform origin-left transition-transform duration-300 ${
                isActive(href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
          ))}
        </div>
      </nav>
    </motion.header>
  );
}
