'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'set',
      action: string,
      params?: Record<string, any>
    ) => void;
  }
}

export const useAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname, searchParams]);

  const trackPageView = (path: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  };

  const trackEvent = (
    eventName: string,
    eventParams?: Record<string, any>
  ) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...eventParams,
        page_path: pathname,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  };

  return {
    trackEvent,
    trackPageView,
  };
};

export default useAnalytics;