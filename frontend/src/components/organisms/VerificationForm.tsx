'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { VerificationHeader } from '@/components/molecules/VerificationHeader';
import { UploadArea } from '@/components/molecules/UploadArea';
import { FileList } from '@/components/molecules/FileList';
import { AnimatedButton } from '@/components/atoms/AnimatedButton';
import { Text } from '@/components/atoms/text';

export function VerificationForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (newFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;

    setIsSubmitting(true);
    // Simulate upload process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);

    // Handle successful upload
    console.log(
      'Files uploaded:',
      selectedFiles.map((f) => f.name),
    );
  };

  const handleBack = () => {
    // Handle navigation back
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
          <UploadArea
            onFileSelect={handleFileSelect}
            hasFiles={selectedFiles.length > 0}
          />

          <FileList files={selectedFiles} onRemoveFile={handleRemoveFile} />

          <AnimatedButton
            onClick={handleSubmit}
            disabled={selectedFiles.length === 0 || isSubmitting}
            className="bg-yellow-600 hover:bg-yellow-700 text-white h-12 font-medium"
          >
            {isSubmitting
              ? 'Uploading...'
              : `Submit ${selectedFiles.length > 0 ? `(${selectedFiles.length} files)` : ''}`}
          </AnimatedButton>

          <motion.button
            onClick={handleBack}
            className="flex items-center justify-center w-full gap-2 text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ x: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <ArrowLeft className="h-4 w-4" />
            <Text variant="body">Back</Text>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
