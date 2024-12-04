'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Blog', href: '/blog' },
  { name: 'Write', href: '/admin/articles/new' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

// Sample search results - in a real app, this would come from your database
const sampleResults = [
  { title: 'Mechanical Keyboard Review', category: 'Peripherals', href: '/reviews/mechanical-keyboard' },
  { title: 'Gaming Mouse Comparison', category: 'Peripherals', href: '/reviews/gaming-mouse' },
  { title: 'Best Monitors 2024', category: 'Displays', href: '/reviews/best-monitors' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter results based on search query
  const filteredResults = sampleResults.filter(result =>
    result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between py-4">
          <div className="flex lg:flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo-colorful.svg"
                alt="TechReview Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TechReview
              </span>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-sm font-semibold leading-6 px-3 py-2 rounded-lg transition-all duration-300 
                  ${pathname === item.href 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 
                  after:bg-gradient-to-r after:from-indigo-600 after:to-purple-600 
                  after:transform after:scale-x-0 after:transition-transform after:duration-300 
                  hover:after:scale-x-100
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end" ref={searchRef}>
            <div className="relative">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className={`text-sm font-semibold leading-6 p-2 rounded-lg transition-all duration-300
                  ${searchOpen ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'}`}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Search Panel */}
              {searchOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      {searchQuery && filteredResults.map((result, index) => (
                        <Link
                          key={index}
                          href={result.href}
                          onClick={() => setSearchOpen(false)}
                          className="block p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <div className="text-sm font-medium text-gray-900">{result.title}</div>
                          <div className="text-xs text-gray-500">{result.category}</div>
                        </Link>
                      ))}
                      {searchQuery && filteredResults.length === 0 && (
                        <div className="text-sm text-gray-500 p-3">
                          No results found for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo-colorful.svg"
                alt="TechReview Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TechReview
              </span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 
                      ${pathname === item.href 
                        ? 'text-indigo-600 bg-indigo-50' 
                        : 'text-gray-900 hover:bg-gray-50'
                      } transition-all duration-300`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
