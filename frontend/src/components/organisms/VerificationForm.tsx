import { useState } from 'react';
import { motion } from 'framer-motion';
import { VerificationHeader } from '@/components/molecules/VerificationHeader';
import { AxiosInstance } from 'axios';
import AxiosRequest from '@/services/axiosInspector';
import { uploadVerificationDocs } from '@/services/userService';
import UploadAreaBody from '../molecules/UploadAreaBody';
import { VerificationStatusContent } from '../molecules/VerificationStatusContent';

export function VerificationForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const axiosInstance: AxiosInstance = AxiosRequest().axiosInstance;
  const [verificationStatus] = useState<'pending' | 'approved' | 'rejected'>(
    'rejected',
  );

  const handleFileSelect = (newFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;

    setIsSubmitting(true);
    uploadVerificationDocs(selectedFiles, axiosInstance)
      .then((response) => {
        console.log('Files uploaded successfully:', response);
      })
      .catch((error) => {
        console.error('Error uploading files:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    // Reset form
    setSelectedFiles([]);
  };

  const handleBack = () => {
    // TODO: Implement back navigation
    console.log('Navigate back');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md space-y-8"
      >
        <VerificationHeader />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="space-y-6"
        >
          {/* <UploadAreaBody
            handleFileSelect={handleFileSelect}
            selectedFiles={selectedFiles}
            handleRemoveFile={handleRemoveFile}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            handleBack={handleBack}
          /> */}

          <VerificationStatusContent
            status={verificationStatus}
            onBack={handleBack}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
