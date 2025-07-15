import React from 'react';
import { UploadArea } from './UploadArea';
import { ArrowLeft } from 'lucide-react';
import { Text } from '../atoms/text';
import { AnimatedButton } from '../atoms/AnimatedButton';
import { FileList } from './FileList';
import { motion } from 'framer-motion';

export default function UploadAreaBody({
  handleFileSelect,
  selectedFiles,
  handleRemoveFile,
  handleSubmit,
  isSubmitting,
  handleBack,
}: {
  handleFileSelect: (files: File[]) => void;
  selectedFiles: File[];
  handleRemoveFile: (index: number) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  handleBack: () => void;
}) {
  return (
    <>
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
    </>
  );
}
