'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (
      type: string,
      action: string,
      data?: { [key: string]: any }
    ) => void;
  }
}

export const useAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views
  useEffect(() => {
    if (pathname) {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_search: searchParams?.toString(),
      });
    }
  }, [pathname, searchParams]);

  // Track custom events
  const trackEvent = (action: string, data?: { [key: string]: any }) => {
    window.gtag('event', action, data);
  };

  // Track outbound links
  const trackOutboundLink = (url: string) => {
    window.gtag('event', 'click', {
      event_category: 'outbound',
      event_label: url,
      transport_type: 'beacon',
    });
  };

  // Track file downloads
  const trackDownload = (fileUrl: string, fileType: string) => {
    window.gtag('event', 'download', {
      event_category: 'file_download',
      event_label: fileUrl,
      file_type: fileType,
    });
  };

  // Track user engagement
  const trackEngagement = (type: string, contentId: string) => {
    window.gtag('event', 'engagement', {
      event_category: type,
      event_label: contentId,
    });
  };

  return {
    trackEvent,
    trackOutboundLink,
    trackDownload,
    trackEngagement,
  };
}; 