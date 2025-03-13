import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { motion } from 'motion/react';

export const AlertBox = ({
  title,
  message,
  alertOpen,
  onAlertOpenChange,
  IconElement,
  continueBtn = 'Continue',
  cancelBtn = 'Cancel',
}: {
  title: string;
  message: string;
  alertOpen: boolean;
  onAlertOpenChange: (open: boolean) => void;
  IconElement: JSX.Element;
  continueBtn?: string;
  cancelBtn?: string;
}) => {
  return (
    <AlertDialog open={alertOpen} onOpenChange={onAlertOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            {IconElement && (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{
                  scale: 1,
                }}
                transition={{
                  duration: 0.6,
                  scale: {
                    type: 'spring',
                    stiffness: 250,
                    damping: 15,
                  },
                }}
              >
                {IconElement}
              </motion.div>
            )}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>{' '}
        <AlertDialogFooter>
          {cancelBtn && <AlertDialogCancel>{cancelBtn}</AlertDialogCancel>}
          {continueBtn && <AlertDialogAction>{continueBtn}</AlertDialogAction>}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
