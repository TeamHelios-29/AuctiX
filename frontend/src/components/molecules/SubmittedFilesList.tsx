import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { ActionButton } from '@/components/atoms/ActionButton';

interface SubmittedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface SubmittedFilesListProps {
  files: SubmittedFile[];
  onBack: () => void;
}

export function SubmittedFilesList({ files, onBack }: SubmittedFilesListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Under Review';
    }
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold text-foreground">
          Submitted Files
        </h2>
      </motion.div>

      <div className="space-y-3">
        <AnimatePresence>
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="border rounded-lg p-4 bg-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded{' '}
                      {file.uploadedAt}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(file.status)}`}
                >
                  {getStatusText(file.status)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ActionButton
          onClick={onBack}
          variant="outline"
          className="border-gray-300 hover:bg-gray-50"
        >
          Back to Status
        </ActionButton>
      </motion.div>
    </motion.div>
  );
}
