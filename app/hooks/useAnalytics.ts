'use client';

import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

type EventName = 
  | 'page_view'
  | 'article_view'
  | 'review_view'
  | 'search'
  | 'login'
  | 'logout'
  | 'error'
  | 'share'
  | 'rating_submit'
  | 'comment_submit'
  | 'navigation_click'
  | 'footer_navigation_click'
  | 'social_click'
  | 'article_create_attempt'
  | 'article_create_success'
  | 'article_create_error'
  | 'article_edit_attempt'
  | 'article_edit_success'
  | 'article_edit_error'
  | 'article_delete_attempt'
  | 'article_delete_success'
  | 'article_delete_error'
  | 'article_publish'
  | 'article_unpublish'
  | 'image_upload_attempt'
  | 'image_upload_success'
  | 'image_upload_error'
  | 'image_select'
  | 'score_display_view'
  | 'score_display_hover'
  | 'score_display_click'
  | 'contact_form_view'
  | 'contact_form_submit'
  | 'contact_form_success'
  | 'contact_form_error';

interface AnalyticsEvent {
  name: EventName;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
  path?: string;
  referrer?: string;
}

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const trackEvent = useCallback(async (
    eventName: EventName,
    properties: Record<string, any> = {}
  ) => {
    try {
      const event: AnalyticsEvent = {
        name: eventName,
        properties,
        userId: session?.user?.id,
        timestamp: Date.now(),
        path: pathname,
        referrer: document.referrer,
      };

      // Track event to your analytics service
      if (process.env.NEXT_PUBLIC_ANALYTICS_URL) {
        await fetch(process.env.NEXT_PUBLIC_ANALYTICS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Analytics-Key': process.env.NEXT_PUBLIC_ANALYTICS_KEY || '',
          },
          body: JSON.stringify(event),
        });
      }

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics]', event);
      }

      // Track to Google Analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, {
          ...properties,
          user_id: session?.user?.id,
          path: pathname,
          referrer: document.referrer,
        });
      }
    } catch (error) {
      console.error('[Analytics Error]', error);
    }
  }, [pathname, session?.user?.id]);

  // Track page views
  const trackPageView = useCallback(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    trackEvent('page_view', {
      url,
      title: document.title,
    });
  }, [pathname, searchParams, trackEvent]);

  // Track errors
  const trackError = useCallback((error: Error, additionalInfo?: Record<string, any>) => {
    trackEvent('error', {
      message: error.message,
      stack: error.stack,
      ...additionalInfo,
    });
  }, [trackEvent]);

  // Track article views
  const trackArticleView = useCallback((articleId: string, title: string, category: string) => {
    trackEvent('article_view', {
      article_id: articleId,
      title,
      category,
    });
  }, [trackEvent]);

  // Track review views
  const trackReviewView = useCallback((reviewId: string, title: string, rating?: number) => {
    trackEvent('review_view', {
      review_id: reviewId,
      title,
      rating,
    });
  }, [trackEvent]);

  // Track search
  const trackSearch = useCallback((query: string, resultsCount: number) => {
    trackEvent('search', {
      query,
      results_count: resultsCount,
    });
  }, [trackEvent]);

  // Track authentication events
  const trackAuth = useCallback((action: 'login' | 'logout') => {
    trackEvent(action, {
      method: 'credentials',
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackError,
    trackArticleView,
    trackReviewView,
    trackSearch,
    trackAuth,
  };
}