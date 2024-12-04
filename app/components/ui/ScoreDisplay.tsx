'use client';

import { useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

type Props = {
  score: number;
  size?: 'sm' | 'md' | 'lg';
};

export default function ScoreDisplay({ score, size = 'md' }: Props) {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('score_display_view', {
      score,
      size
    });
  }, [score, size, trackEvent]);

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl'
  };

  const scoreColor = score >= 8 ? 'emerald' : score >= 6 ? 'amber' : 'rose';

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Background Circle */}
      <div className={`absolute inset-0 rounded-full bg-${scoreColor}-100`} />
      
      {/* Score Circle */}
      <div 
        className={`absolute inset-0 rounded-full bg-${scoreColor}-600 
                   flex items-center justify-center text-white font-bold
                   transform transition-transform duration-300 hover:scale-105`}
        style={{
          clipPath: `polygon(0 0, 100% 0, 100% ${100 - (score * 10)}%, 0 ${100 - (score * 10)}%)`
        }}
      >
        {score}
      </div>

      {/* Score Text */}
      <div className={`absolute inset-0 rounded-full 
                      flex items-center justify-center 
                      font-bold ${score >= 8 ? 'text-emerald-600' : score >= 6 ? 'text-amber-600' : 'text-rose-600'}`}>
        {score}
      </div>
    </div>
  );
} 