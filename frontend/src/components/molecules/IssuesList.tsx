'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { ActionButton } from '@/components/atoms/ActionButton';

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  fileName?: string;
}

interface IssuesListProps {
  issues: Issue[];
  onBack: () => void;
}

export function IssuesList({ issues, onBack }: IssuesListProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      default:
        return 'Low Priority';
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
          Verification Issues
        </h2>
      </motion.div>

      <div className="space-y-4">
        <AnimatePresence>
          {issues.map((issue, index) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="border rounded-lg p-4 bg-white"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-foreground">
                        {issue.title}
                      </h3>
                      {issue.fileName && (
                        <p className="text-sm text-muted-foreground">
                          File: {issue.fileName}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}
                  >
                    {getSeverityText(issue.severity)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground pl-8">
                  {issue.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <ActionButton
          onClick={() => console.log('Resubmit documents')}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Resubmit Documents
        </ActionButton>
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
