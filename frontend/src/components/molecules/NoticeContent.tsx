import { motion } from 'framer-motion';

interface NoticeContentProps {
  content: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export function NoticeContent({ content }: NoticeContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="px-6 pb-6 text-sm text-gray-800 leading-relaxed space-y-4"
    >
      <div
        dangerouslySetInnerHTML={{
          __html: content.replace(
            /<(?!\/?(i|u|b|strong|sub|sup|h[1-6]|p|br|ul|li|ol)\b)[^>]+>/gi,
            '',
          ),
        }}
      />
    </motion.div>
  );
}
