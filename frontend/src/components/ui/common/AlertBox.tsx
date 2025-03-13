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
  continueAction,
  cancelAction,
  IconElement,
  continueBtn = 'Continue',
  cancelBtn = 'Cancel',
}: {
  title: string;
  message: string;
  alertOpen: boolean;
  onAlertOpenChange: (open: boolean) => void;
  continueAction?: () => void;
  cancelAction?: () => void;
  IconElement?: (() => JSX.Element) | null;
  continueBtn?: string | null;
  cancelBtn?: string | null;
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
                {<IconElement />}
              </motion.div>
            )}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancelBtn && (
            <AlertDialogCancel onClick={() => cancelAction && cancelAction()}>
              {cancelBtn}
            </AlertDialogCancel>
          )}
          {continueBtn && (
            <AlertDialogAction
              onClick={() => continueAction && continueAction()}
            >
              {continueBtn}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
