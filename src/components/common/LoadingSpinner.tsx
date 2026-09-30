import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-slate-400 gap-3 ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin text-indigo-400`} />
      {text && <span className="text-xs font-mono tracking-wide uppercase text-slate-400">{text}</span>}
    </div>
  );
};
