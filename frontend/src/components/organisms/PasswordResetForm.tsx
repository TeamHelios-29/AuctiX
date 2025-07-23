'use client';

import type React from 'react';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { FormInput } from '@/components/atoms/FormInput';
import { SixDigitCodeInput } from '@/components/molecules/SixDigitCodeInput';
import { ActionButton } from '@/components/atoms/ActionButton';
import { StatusMessage } from '@/components/molecules/StatusMessage';
import { ZodError, z } from 'zod';
import {
  requestPasswordResetCode,
  resetPassword,
  validateVerificationCode,
} from '@/services/passwordResetService';
import { useToast } from '@/hooks/use-toast';
import AxiosRequest from '@/services/axiosInspector';
import { AxiosInstance } from 'axios';
import { getServerErrorMessage } from '@/lib/errorMsg';
import { useNavigate } from 'react-router-dom';

export const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const verificationCodeSchema = z.object({
  code: z
    .string()
    .regex(
      /^[A-Za-z0-9]{6}$/,
      'Please enter a valid 6-digit verification code',
    ),
});

export const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type EmailFormData = z.infer<typeof emailSchema>;
export type VerificationCodeFormData = z.infer<typeof verificationCodeSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

// Helper function to format code for display
export const formatCodeForDisplay = (code: string): string => {
  const cleaned = code.replace(/[-\s]/g, '');
  if (cleaned.length >= 3) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}`;
  }
  return cleaned;
};

type Step = 'email' | 'verification' | 'createPassword' | 'success' | 'error';

export function PasswordResetForm() {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [passwordData, setPasswordData] = useState<NewPasswordFormData>({
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const { toast } = useToast();
  const axiosInstance: AxiosInstance = AxiosRequest().axiosInstance;
  const navigate = useNavigate();

  const steps = ['Email', 'Verify', 'Password'];

  function getCurrentStepNumber(): number {
    switch (currentStep) {
      case 'email':
        return 1;
      case 'verification':
        return 2;
      case 'createPassword':
        return 3;
      default:
        return 1;
    }
  }

  const validateEmail = (): boolean => {
    try {
      emailSchema.parse({ email });
      setEmailError('');
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        setEmailError(error.errors[0]?.message || 'Invalid email');
      }
      return false;
    }
  };

  const validateCode = (): boolean => {
    try {
      verificationCodeSchema.parse({ code: verificationCode });
      setCodeError('');
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        setCodeError(error.errors[0]?.message || 'Invalid verification code');
      }
      return false;
    }
  };

  const validatePasswords = (): boolean => {
    try {
      newPasswordSchema.parse(passwordData);
      setPasswordErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: { newPassword?: string; confirmPassword?: string } =
          {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof typeof newErrors] = err.message;
          }
        });
        setPasswordErrors(newErrors);
      }
      return false;
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setIsLoading(true);
    requestPasswordResetCode(email, axiosInstance)
      .then(() => {
        setCurrentStep('verification');
        toast({
          variant: 'default',
          title: 'Verification Code Sent',
          description: `A verification code has been sent to ${email}. Please check your inbox.`,
        });
      })
      .catch((error) => {
        console.error('Error requesting password reset code:', error);
        setEmailError(getServerErrorMessage(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCode()) return;

    setIsLoading(true);
    validateVerificationCode(email, verificationCode, axiosInstance)
      .then(() => {
        setCurrentStep('createPassword');
        toast({
          variant: 'default',
          title: 'Code Verified',
          description: 'You can now create a new password.',
        });
      })
      .catch((error) => {
        console.error('Error verifying code:', error);
        setCurrentStep('error');
        const errorMsg = getServerErrorMessage(error);
        setCodeError(errorMsg);
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: errorMsg,
        });
        setVerificationCode('');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) return;

    setIsLoading(true);
    resetPassword(
      email,
      verificationCode,
      passwordData.newPassword,
      axiosInstance,
    )
      .then(() => {
        setCurrentStep('success');
        toast({
          variant: 'default',
          title: 'Password Reset Successful',
          description:
            'Your password has been reset successfully. You can now log in with your new password.',
        });
      })
      .catch((error) => {
        console.error('Error verifying code:', error);
        setCurrentStep('error');
        setCodeError('Invalid verification code. Please try again.');
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description:
            'The verification code you entered is incorrect. Please try again.',
        });
        setVerificationCode('');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTryAgain = () => {
    setVerificationCode('');
    setCodeError('');
    setCurrentStep('verification');
  };

  const handleStartOver = () => {
    setEmail('');
    setVerificationCode('');
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setEmailError('');
    setCodeError('');
    setPasswordErrors({});
    setCurrentStep('email');
  };

  const updatePasswordField =
    (field: keyof NewPasswordFormData) => (value: string) => {
      setPasswordData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (passwordErrors[field]) {
        setPasswordErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const renderStep = () => {
    switch (currentStep) {
      case 'email':
        return (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                Reset Password
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                Enter your email address and we'll send you a verification code
                to reset your password.
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <FormInput
                label="Email Address"
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={setEmail}
                error={emailError}
                delay={0.2}
                disabled={isLoading}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <ActionButton
                  type="submit"
                  loading={isLoading}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Send Verification Code
                </ActionButton>
              </motion.div>
            </form>
          </motion.div>
        );

      case 'verification':
        return (
          <motion.div
            key="verification"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                Enter Verification Code
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                Please enter the 6-digit verification code sent to your email
                address.
              </p>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <SixDigitCodeInput
                label="Verification Code"
                value={verificationCode}
                onChange={setVerificationCode}
                error={codeError}
                delay={0.2}
                disabled={isLoading}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-3"
              >
                <ActionButton
                  type="submit"
                  loading={isLoading}
                  disabled={verificationCode.length !== 6}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Verify Code
                </ActionButton>

                <ActionButton
                  onClick={() => setCurrentStep('email')}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  Back
                </ActionButton>
              </motion.div>
            </form>
          </motion.div>
        );

      case 'createPassword':
        return (
          <motion.div
            key="createPassword"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                Create New Password
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                Choose a strong password for your account. Make sure it's
                something you'll remember.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <FormInput
                label="New Password"
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={passwordData.newPassword}
                onChange={updatePasswordField('newPassword')}
                error={passwordErrors.newPassword}
                delay={0.2}
                disabled={isLoading}
              />

              <FormInput
                label="Confirm New Password"
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={passwordData.confirmPassword}
                onChange={updatePasswordField('confirmPassword')}
                error={passwordErrors.confirmPassword}
                delay={0.4}
                disabled={isLoading}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="space-y-3"
              >
                <ActionButton
                  type="submit"
                  loading={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Reset Password
                </ActionButton>

                <ActionButton
                  onClick={() => setCurrentStep('verification')}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  Back
                </ActionButton>
              </motion.div>
            </form>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <StatusMessage
              status="success"
              title="Password Reset Complete!"
              message="Your password has been successfully reset. You can now sign in with your new password."
              buttonText="Sign In"
              onButtonClick={() => navigate('/login')}
            />
          </motion.div>
        );

      case 'error':
        return (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <StatusMessage
              status="error"
              title="Invalid Code"
              message="The verification code you entered is incorrect. Please check your email and try again."
              buttonText="Try Again"
              onButtonClick={handleTryAgain}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ActionButton
                onClick={handleStartOver}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                Start Over
              </ActionButton>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Progress Bar - only show for main steps */}
        {!['success', 'error'].includes(currentStep) && (
          <ProgressBar
            currentStep={getCurrentStepNumber()}
            totalSteps={3}
            steps={steps}
          />
        )}

        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </motion.div>
    </div>
  );
}
