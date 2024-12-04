'use client';

import { useCallback } from 'react';
import { GA_MEASUREMENT_ID } from '../components/GoogleAnalytics';

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

export function useAnalytics() {
  const trackEvent = useCallback((action: string, params: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        ...params,
        send_to: GA_MEASUREMENT_ID
      });
    }
  }, []);

  const trackEngagement = useCallback((action: string, contentId: string) => {
    trackEvent('engagement', {
      action,
      content_id: contentId,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  return { trackEvent, trackEngagement };
} 