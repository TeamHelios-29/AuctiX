import { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, ZoomIn, ZoomOut, Move } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Position {
  x: number;
  y: number;
}

interface ImageResult {
  imageData: string | null;
  position: Position;
  scale: number;
}

interface ImageUploadPopupProps {
  onConfirm?: (result: ImageResult) => void;
}

export default function ImageUploadPopup({ onConfirm }: ImageUploadPopupProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const positionRef = useRef<Position>(position);
  const [scale, setScale] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenDialog = (): void => setIsOpen(true);

  const handleCloseDialog = (): void => {
    setIsOpen(false);
    setImage(null);
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match('image.*')) {
        handleFileSelect(file);
      }
    }
  };

  const handleFileSelect = (file: File): void => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
        setPosition({ x: 0, y: 0 });
        setScale(1);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleButtonClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleZoomIn = (): void => {
    setScale(scale + 0.1);
  };

  const handleZoomOut = (): void => {
    if (scale > 0.2) {
      setScale(scale - 0.1);
    }
  };

  const handleDraging = (
    e: Event,
    info: { offset: { x: number; y: number } },
  ) => {
    setIsDragging(false);
    console.log('dragged to', info.offset.x, info.offset.y);
    setPosition({
      x: positionRef.current.x + info.offset.x,
      y: positionRef.current.y + info.offset.y,
    });
  };

  const handleConfirm = (): void => {
    const result: ImageResult = {
      imageData: image,
      position,
      scale,
    };
    console.log('Image set as object:', result);

    // If onConfirm prop is provided, call it with the result
    if (onConfirm) {
      onConfirm(result);
    }

    // Close the dialog
    handleCloseDialog();
  };

  return (
    <div className="flex flex-col items-center">
      <Button onClick={handleOpenDialog} className="flex items-center gap-2">
        <Upload size={16} />
        Upload Image
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
          <DialogHeader>
            <DialogTitle>Upload and Adjust Image</DialogTitle>
          </DialogHeader>

          <div className="my-4">
            {!image ? (
              <Card
                className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer"
                onClick={handleButtonClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                />
                <Upload className="w-12 h-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Drag & drop an image or click to browse
                </p>
              </Card>
            ) : (
              <div className="relative h-64 w-full overflow-hidden bg-gray-100 rounded-lg">
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  drag
                  dragMomentum={false}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0}
                  onDragStart={() => setIsDragging(true)}
                  onDrag={handleDraging}
                  onDragEnd={() => {
                    setIsDragging(false);
                  }}
                  style={{
                    position: 'relative',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    touchAction: 'none',
                    left: position.x,
                    top: position.y,
                    scale: scale,
                  }}
                >
                  <img
                    src={image}
                    alt="Preview"
                    className="max-w-full max-h-full"
                    draggable="false"
                  />
                </motion.div>

                <div className="absolute bottom-2 right-2 flex gap-2 bg-black bg-opacity-50 p-2 rounded-md">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white p-1 h-8 w-8"
                    onClick={handleZoomIn}
                  >
                    <ZoomIn size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white p-1 h-8 w-8"
                    onClick={handleZoomOut}
                  >
                    <ZoomOut size={16} />
                  </Button>
                  <div className="flex items-center justify-center text-white p-1 h-8 w-8">
                    <Move size={16} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!image}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
