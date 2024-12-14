'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAnalytics } from 'app/hooks/useAnalytics';

export default function Footer() {
  const pathname = usePathname();
  const { trackEvent } = useAnalytics();

  const handleNavClick = (navItem: string) => {
    trackEvent('footer_navigation_click', {
      from_path: pathname,
      to_nav_item: navItem
    });
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link 
              href="/" 
              className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              onClick={() => handleNavClick('home')}
            >
              Fixed or Custom
            </Link>
            <p className="text-slate-600 text-sm">
              Expert tech reviews and in-depth guides to help you make informed decisions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Content</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/reviews" 
                  className="text-slate-600 hover:text-indigo-600 transition-colors text-sm"
                  onClick={() => handleNavClick('reviews')}
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-slate-600 hover:text-indigo-600 transition-colors text-sm"
                  onClick={() => handleNavClick('blog')}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="text-slate-600 hover:text-indigo-600 transition-colors text-sm"
                  onClick={() => handleNavClick('about')}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-slate-600 hover:text-indigo-600 transition-colors text-sm"
                  onClick={() => handleNavClick('contact')}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-slate-600 hover:text-indigo-600 transition-colors text-sm"
                  onClick={() => handleNavClick('privacy')}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-slate-600 hover:text-indigo-600 transition-colors text-sm"
                  onClick={() => handleNavClick('terms')}
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-600 text-sm">
              © {new Date().getFullYear()} Fixed or Custom. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="https://twitter.com/fixedorcustom" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-indigo-600 transition-colors"
                onClick={() => trackEvent('social_click', { platform: 'twitter' })}
              >
                Twitter
              </a>
              <a 
                href="https://github.com/fixedorcustom" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-indigo-600 transition-colors"
                onClick={() => trackEvent('social_click', { platform: 'github' })}
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
