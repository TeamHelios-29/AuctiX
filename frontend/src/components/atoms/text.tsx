import type React from 'react';
import { cn } from '@/lib/utils';

interface TextProps {
  children: React.ReactNode;
  variant?: 'heading' | 'subheading' | 'body' | 'caption';
  className?: string;
}

export function Text({ children, variant = 'body', className }: TextProps) {
  const baseClasses = {
    heading: 'text-2xl font-bold text-foreground',
    subheading: 'text-base text-muted-foreground',
    body: 'text-sm text-foreground',
    caption: 'text-xs text-muted-foreground',
  };

  return (
    <span className={cn(baseClasses[variant], className)}>{children}</span>
  );
}
