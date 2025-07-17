'use client';

import type React from 'react';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
}

export function ActionButton({
  children,
  onClick,
  variant = 'default',
  className,
  disabled = false,
}: ActionButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Button
        onClick={onClick}
        variant={variant}
        disabled={disabled}
        className={cn('w-full h-12 font-medium', className)}
      >
        {children}
      </Button>
    </motion.div>
  );
}
