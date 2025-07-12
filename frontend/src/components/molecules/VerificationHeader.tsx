'use client';

import { motion } from 'framer-motion';
import { Text } from '@/components/atoms/text';

export function VerificationHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center space-y-6 mb-8"
    >
      <div className="space-y-3">
        <Text variant="heading" className="text-3xl font-bold">
          Get Verified!
        </Text>
        <div className="w-16 h-0.5 bg-yellow-500 mx-auto"></div>
      </div>
      <Text variant="subheading" className="max-w-md mx-auto leading-relaxed">
        Verify your seller account by uploading front side of your National
        Identity Card / Passport / Business Registration Certificate
      </Text>
    </motion.div>
  );
}
