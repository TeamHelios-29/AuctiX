import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StatusNotice } from '@/components/molecules/StatusNotice';
import { SubmittedFilesList } from '@/components/molecules/SubmittedFilesList';
import { IssuesList } from '@/components/molecules/IssuesList';

interface VerificationStatusContentProps {
  status: 'pending' | 'approved' | 'rejected';
  onBack: () => void;
}

// TODO: Replace mock data with actual API calls
const mockFiles = [
  {
    id: '1',
    name: 'national_id_front.jpg',
    size: 2048000,
    uploadedAt: '2 hours ago',
    status: 'pending' as const,
  },
  {
    id: '2',
    name: 'passport_photo.pdf',
    size: 1536000,
    uploadedAt: '2 hours ago',
    status: 'pending' as const,
  },
];

const mockIssues = [
  {
    id: '1',
    title: 'Document Quality Issue',
    description:
      'The uploaded image is too blurry. Please upload a clearer photo of your document.',
    severity: 'high' as const,
    fileName: 'national_id_front.jpg',
  },
  {
    id: '2',
    title: 'Missing Information',
    description:
      'The document appears to be cropped. Please ensure all corners and edges are visible.',
    severity: 'medium' as const,
    fileName: 'passport_photo.pdf',
  },
];

export function VerificationStatusContent({
  status,
  onBack,
}: VerificationStatusContentProps) {
  const [currentView, setCurrentView] = useState<'status' | 'files' | 'issues'>(
    'status',
  );

  const handleViewClick = () => {
    setCurrentView(status === 'rejected' ? 'issues' : 'files');
  };

  const handleBackToStatus = () => {
    setCurrentView('status');
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {currentView === 'status' && (
          <StatusNotice
            key="status"
            status={status}
            onViewClick={handleViewClick}
            onBack={onBack}
          />
        )}

        {currentView === 'files' && (
          <SubmittedFilesList
            key="files"
            files={mockFiles}
            onBack={handleBackToStatus}
          />
        )}

        {currentView === 'issues' && (
          <IssuesList
            key="issues"
            issues={mockIssues}
            onBack={handleBackToStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
