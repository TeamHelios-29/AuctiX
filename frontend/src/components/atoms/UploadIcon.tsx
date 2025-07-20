import { Upload } from 'lucide-react';

interface UploadIconProps {
  className?: string;
}

export function UploadIcon({ className }: UploadIconProps) {
  return <Upload className={className} />;
}
