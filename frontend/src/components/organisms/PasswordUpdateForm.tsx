import type React from 'react';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FormSection } from '@/components/molecules/FormSection';
import { FormField } from '@/components/atoms/FormField';
import { AnimatedButton } from '@/components/atoms/AnimatedButton';
import { Separator } from '@/components/ui/separator';
import { ZodError, set, z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { changePassword, IChangePasswordData } from '@/services/userService';
import { AxiosInstance } from 'axios';
import AxiosRequest from '@/services/axiosInspector';

const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

type PasswordUpdateFormData = z.infer<typeof passwordUpdateSchema>;

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export function PasswordUpdateForm() {
  const [formData, setFormData] = useState<PasswordUpdateFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const axiosInstance: AxiosInstance = AxiosRequest().axiosInstance;

  const validateForm = (): boolean => {
    try {
      passwordUpdateSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormErrors] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const data: IChangePasswordData = {
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    };

    changePassword(data, axiosInstance)
      .then(() => {
        toast({
          title: 'Success',
          description: 'Your password has been updated successfully.',
          variant: 'default',
        });
      })
      .catch((error) => {
        if (error.response?.status === 500) {
          toast({
            title: 'Error',
            description:
              'An unexpected error occurred. Please try again later.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description:
              error.response?.data?.message || 'Failed to update password.',
            variant: 'destructive',
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Reset form on success
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    console.log('Password updated successfully!');
  };

  const updateField =
    (field: keyof PasswordUpdateFormData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Update Password
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Keep your account secure by updating your password regularly. Make
              sure to choose a strong password.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <FormSection
              title="Current Password"
              description="Enter your current password to verify your identity"
              delay={0.5}
            >
              <FormField
                label="Current Password"
                id="currentPassword"
                type="password"
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={updateField('currentPassword')}
                error={errors.currentPassword}
                delay={0.6}
              />
            </FormSection>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex justify-center"
            >
              <Separator className="w-24" />
            </motion.div>

            <FormSection
              title="New Password"
              description="Choose a strong password with at least 8 characters, including uppercase, lowercase, and numbers"
              delay={0.8}
            >
              <FormField
                label="New Password"
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={updateField('newPassword')}
                error={errors.newPassword}
                delay={0.9}
              />

              <FormField
                label="Confirm New Password"
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={updateField('confirmPassword')}
                error={errors.confirmPassword}
                delay={1.0}
              />
            </FormSection>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="pt-6"
            >
              <AnimatedButton
                type="submit"
                loading={isLoading}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium"
              >
                Update Password
              </AnimatedButton>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
