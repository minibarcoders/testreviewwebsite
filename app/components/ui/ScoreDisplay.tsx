'use client';

import { useEffect } from 'react';
import { useAnalytics } from 'app/hooks/useAnalytics';

type Props = {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export default function ScoreDisplay({ score, label, size = 'md' }: Props) {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('score_display_view', {
      score,
      size,
      label,
      category: getScoreConfig(score).label
    });
  }, [score, size, label, trackEvent]);

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl',
    xl: 'w-32 h-32 text-5xl'
  };

  const getScoreConfig = (score: number) => {
    if (score >= 9) {
      return {
        bgGradient: 'from-emerald-100 to-emerald-200',
        fillGradient: 'from-emerald-500 to-emerald-600',
        textColor: 'text-emerald-600',
        ringColor: 'ring-emerald-400',
        label: 'Outstanding',
        description: 'Sets new standards'
      };
    }
    if (score >= 7) {
      return {
        bgGradient: 'from-blue-100 to-blue-200',
        fillGradient: 'from-blue-500 to-blue-600',
        textColor: 'text-blue-600',
        ringColor: 'ring-blue-400',
        label: 'Excellent',
        description: 'Highly recommended'
      };
    }
    if (score >= 5) {
      return {
        bgGradient: 'from-amber-100 to-amber-200',
        fillGradient: 'from-amber-500 to-amber-600',
        textColor: 'text-amber-600',
        ringColor: 'ring-amber-400',
        label: 'Good',
        description: 'Worth considering'
      };
    }
    return {
      bgGradient: 'from-rose-100 to-rose-200',
      fillGradient: 'from-rose-500 to-rose-600',
      textColor: 'text-rose-600',
      ringColor: 'ring-rose-400',
      label: 'Fair',
      description: 'Has limitations'
    };
  };

  const config = getScoreConfig(score);

  const handleHover = () => {
    trackEvent('score_display_hover', {
      score,
      size,
      label,
      category: config.label
    });
  };

  const handleClick = () => {
    trackEvent('score_display_click', {
      score,
      size,
      label,
      category: config.label
    });
  };

  return (
    <div className="flex flex-col items-center gap-3" role="presentation">
      <div 
        className={`relative ${sizeClasses[size]} ring-2 ring-offset-2 ${config.ringColor}
                   rounded-full shadow-lg transform transition-all duration-300
                   hover:scale-105 hover:shadow-xl cursor-pointer`}
        aria-label={`Score: ${score} out of 10 - ${config.label}`}
        onMouseEnter={handleHover}
        onClick={handleClick}
      >
        {/* Background Circle with Gradient */}
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.bgGradient}`}
        />
        
        {/* Score Circle with Gradient and Animation */}
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.fillGradient}
                     flex items-center justify-center text-white font-bold
                     transform transition-all duration-500 ease-out`}
          style={{
            clipPath: `polygon(0 0, 100% 0, 100% ${100 - (score * 10)}%, 0 ${100 - (score * 10)}%)`,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
        >
          {score}
        </div>

        {/* Score Text with Enhanced Visibility */}
        <div className={`absolute inset-0 rounded-full 
                        flex items-center justify-center 
                        font-bold ${config.textColor}
                        drop-shadow-sm`}>
          {score}
        </div>
      </div>
      
      {label && (
        <div className="text-center space-y-1">
          <div className="text-sm font-medium text-gray-700">{label}</div>
          <div className={`text-sm font-semibold ${config.textColor}`}>
            {config.label}
          </div>
          <div className="text-xs text-gray-500">
            {config.description}
          </div>
        </div>
      )}
    </div>
  );
}
