'use client';

import { Star } from 'lucide-react';
import { useAnalytics } from '@/app/hooks/useAnalytics';

interface ScoreDisplayProps {
  score: number;
  title: string;
  slug: string;
}

export default function ScoreDisplay({ score, title, slug }: ScoreDisplayProps) {
  const { trackEvent } = useAnalytics();

  const handleScoreHover = () => {
    trackEvent('score_hover', {
      review_title: title,
      review_slug: slug,
      score: score
    });
  };

  return (
    <div 
      className="flex items-center gap-2"
      onMouseEnter={handleScoreHover}
    >
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < Math.floor(score)
                ? 'text-yellow-400 fill-yellow-400'
                : i < score
                ? 'text-yellow-400 fill-yellow-400 opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-lg font-semibold text-gray-900">{score.toFixed(1)}</span>
    </div>
  );
} 