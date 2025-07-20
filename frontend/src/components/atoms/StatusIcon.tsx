'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerificationStatus } from '../organisms/VerificationForm';

interface StatusIconProps {
  status: VerificationStatus;
  className?: string;
}

export function StatusIcon({ status, className }: StatusIconProps) {
  const iconConfig = {
    [VerificationStatus.PENDING]: {
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
    },
    [VerificationStatus.APPROVED]: {
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    [VerificationStatus.REJECTED]: {
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
    },
    [VerificationStatus.NO_VERIFICATION_REQUESTED]: {
      icon: Clock,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
    },
  } as const;

  const config = iconConfig[status];
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      }}
      className={cn(
        'rounded-full p-4 inline-flex items-center justify-center',
        config.bgColor,
        className,
      )}
    >
      <IconComponent className={cn('h-12 w-12', config.color)} />
    </motion.div>
  );
}
