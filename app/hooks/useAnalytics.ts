'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageview } from '../lib/gtag';

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname]);

  const trackEvent = (action: string, params = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        ...params,
        page_path: pathname,
      });
    }
  };

  return { trackEvent };
} 