import { CheckCircle, CircleDashed, XCircle } from 'lucide-react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ValidityIndicator = React.memo(
  ({
    isUsernameAvailable,
    isUsernameAvailableLoading,
    offset,
  }: {
    isUsernameAvailable: boolean;
    isUsernameAvailableLoading: boolean;
    offset: { x: number; y: number };
  }) => {
    const containerClasses = `flex items-center gap-2 w-fit float-right`;
    const containerStyle = {
      transform: `translate(${offset.x}%,${offset.y}%)`,
    };
    return isUsernameAvailableLoading ? (
      <div className={containerClasses} style={containerStyle}>
        <motion.span
          key="loading-indicator"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            repeat: Infinity,
            repeatType: 'reverse',
            type: 'spring',
            stiffness: 250,
            damping: 15,
          }}
        >
          <CircleDashed />
        </motion.span>
      </div>
    ) : isUsernameAvailable ? (
      <div className={containerClasses} style={containerStyle}>
        <motion.span
          key="available-indicator"
          initial={{
            scale: 0.5,
          }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.4,
            scale: {
              type: 'spring',
              stiffness: 250,
              damping: 15,
            },
          }}
          className="text-green-500"
        >
          <CheckCircle />
        </motion.span>
      </div>
    ) : (
      <div className={containerClasses} style={containerStyle}>
        <motion.span
          key="unavailable-indicator"
          initial={{
            scale: 0.5,
          }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.6,
            scale: {
              type: 'spring',
              stiffness: 250,
              damping: 15,
            },
          }}
          className="text-red-500"
        >
          <XCircle />
        </motion.span>
      </div>
    );
  },
);

export interface IValidationError {
  msg: string;
  fieldId: string;
}

export const ValidateErrorElement = ({
  eleFieldId,
  errorList,
}: {
  eleFieldId: string;
  errorList: IValidationError[];
}) => {
  const fieldErrors = errorList.filter(
    (ve) => (ve.fieldId as string) === eleFieldId,
  );
  const initProps = {
    opacity: 1,
    scale: 1,
  };
  const animateProps = {
    opacity: [0, 0.9, 1],
    scale: [0, 1.06, 1],
  };
  return (
    <AnimatePresence mode="wait">
      {fieldErrors.length > 0 ? (
        <motion.div
          key={eleFieldId + '-errors' + fieldErrors.length}
          initial={initProps}
          animate={animateProps}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, exit: { duration: 0.5 } }}
          className="bg-red-50 border border-red-200 rounded-md p-3 mb-3"
        >
          <h4 className="text-sm font-medium text-red-800 mb-1">
            Check the input field rules:
          </h4>
          <ul className="text-xs text-red-700 list-disc pl-4 space-y-1">
            {fieldErrors.map((error, index) => (
              <li key={index}>{error.msg}</li>
            ))}
          </ul>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
