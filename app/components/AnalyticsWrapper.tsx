'use client';

import { Suspense, ReactNode } from 'react';

interface AnalyticsWrapperProps {
  children: ReactNode;
}

export default function AnalyticsWrapper({ children }: AnalyticsWrapperProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}