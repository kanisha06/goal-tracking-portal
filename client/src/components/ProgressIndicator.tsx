import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: 'emerald' | 'amber' | 'rose' | 'blue' | 'slate';
}

export function ProgressIndicator({
  value,
  max = 100,
  size = 'md',
  showLabel = true,
  color = 'blue',
}: ProgressIndicatorProps) {
  const percentage = Math.round((value / max) * 100);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-lg',
    lg: 'text-3xl',
  };

  const colorClasses = {
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    rose: 'text-rose-600',
    blue: 'text-blue-600',
    slate: 'text-slate-600',
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size])}>
      <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-200"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-500', colorClasses[color])}
        />
      </svg>
      {showLabel && (
        <div className="text-center">
          <div className={cn('font-bold', textSizeClasses[size], colorClasses[color])}>
            {percentage}%
          </div>
        </div>
      )}
    </div>
  );
}
