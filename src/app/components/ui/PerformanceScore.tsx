'use client';

import { motion } from 'framer-motion';

type PerformanceScoreProps = {
  score: number;
  size?: 'sm' | 'lg';
};

export default function PerformanceScore({ score, size = 'lg' }: PerformanceScoreProps) {
  const circumference = size === 'lg' ? 282.74 : 188.49;
  const radius = size === 'lg' ? 45 : 30;
  const strokeWidth = size === 'lg' ? 10 : 6;

  return (
    <div className={`relative ${size === 'lg' ? 'w-32 h-32' : 'w-20 h-20'}`}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={score >= 90 ? '#22c55e' : score >= 70 ? '#eab308' : '#ef4444'}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold ${size === 'lg' ? 'text-3xl' : 'text-xl'}`}>
          {score}
        </span>
      </div>
    </div>
  );
}
