'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import type { ImageResult } from '../molecules/ImageUploadPopup';
import { updateProfilePhoto } from '@/services/userService';
import type { AxiosInstance } from 'axios';
import AxiosRequest from '@/services/axiosInspector';
import { fetchCurrentUser } from '@/store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { AlertBox } from './AlertBox';
import ProfileCard from '../molecules/ProfileCard';
import { ProfileUrlsSection } from '../molecules/ProfileURLsSection';
import { AddressSection } from '../molecules/ProfileAddressSection';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  firstName: z
    .string()
    .min(3, {
      message: 'First name must be at least 3 characters.',
    })
    .max(30, {
      message: 'First name must not be longer than 30 characters.',
    }),
  lastName: z
    .string()
    .min(3, {
      message: 'Last name must be at least 3 characters.',
    })
    .max(30, {
      message: 'Last name must not be longer than 30 characters.',
    })
    .optional(),
  email: z
    .string({
      required_error: 'Please provide an email address.',
    })
    .email(),
  bio: z
    .string()
    .max(160, {
      message: 'Bio must not be longer than 160 characters.',
    })
    .min(4, {
      message: 'Bio must be at least 4 characters.',
    }),
  address: z.object({
    number: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    country: z.string().optional(),
  }),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: 'Please enter a valid URL.' }),
      }),
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  bio: '',
  address: {
    number: '',
    addressLine1: '',
    addressLine2: '',
    country: '',
  },
  urls: [],
};

export function ProfileForm() {
  const [croppedImg, setCroppedImg] = useState<string | null>(null);
  const [bannerImg, setBannerImg] = useState<string>('/defaultBanner.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isProfilePictureLoading, setIsProfilePictureLoading] = useState(false);
  const [isBannerLoading, setIsBannerLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const axiosInstance: AxiosInstance = AxiosRequest().axiosInstance;
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    const values = {
      ...defaultValues,
    };
    form.reset(values);
  }, [form]);

  useEffect(() => {
    const values = {
      username: userData.username || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      // bio: userData.bio || "",   // add bio from backend
      // address: {
      //   number: userData.address?.number || "",
      //   addressLine1: userData.address?.addressLine1 || "",
      //   addressLine2: userData.address?.addressLine2 || "",
      //   country: userData.address?.country || "",
      // },                         // add address from backend
      // urls: userData.urls || [], // add urls from backend
    };
    form.reset(values);
    setCroppedImg(userData.profile_photo || null);
    setBannerImg('/defaultBanner.jpg'); // get the banner image from backend
  }, [userData, form]);

  function onSubmit(data: ProfileFormValues) {
    setIsAlertOpen(true);
  }

  const onProfilePhotoSet = useCallback(
    (e: ImageResult) => {
      if (e.croppedImageBase64 != undefined && e.croppedImageFile) {
        setCroppedImg(e.croppedImageBase64);
        setIsProfilePictureLoading(true);
        updateProfilePhoto(e.croppedImageFile, axiosInstance)
          .then(() => {
            dispatch(fetchCurrentUser);
          })
          .finally(() => {
            setIsProfilePictureLoading(false);
          })
          .catch((error) => {
            setErrorMessage(
              'Failed to upload profile picture. Please try again.',
            );
            console.error('Profile picture not uploaded.', error);
          });
      }
    },
    [axiosInstance, dispatch],
  );

  const onBannerPhotoSet = useCallback(
    (e: ImageResult) => {
      if (e.croppedImageBase64 != undefined && e.croppedImageFile) {
        setBannerImg(e.croppedImageBase64);
        setIsBannerLoading(true);
        // Assuming there's a similar function for banner upload
        updateProfilePhoto(e.croppedImageFile, axiosInstance)
          .then(() => {
            dispatch(fetchCurrentUser);
          })
          .finally(() => {
            setIsBannerLoading(false);
          })
          .catch((error) => {
            setErrorMessage('Failed to upload banner image. Please try again.');
            console.error('Banner image not uploaded.', error);
          });
      }
    },
    [axiosInstance, dispatch],
  );

  const removeBanner = () => {
    setBannerImg('/defaultbanner.jpg');
    // TODO: API call to remove banner
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log('Submitting form data:', form.getValues());
      setIsSubmitting(false);
      setIsAlertOpen(false);
    }, 1500);
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <>
      <AlertBox
        onAlertOpenChange={(e) => {
          setIsAlertOpen(e);
        }}
        IconElement={<CheckCircle2 />}
        alertOpen={isAlertOpen}
        continueAction={() => handleSubmit()}
        title="Confirm Profile Update"
        message="Are you sure you want to update your profile information?"
        continueBtn="Confirm"
        cancelBtn="Cancel"
      />

      {/* Profile Card Component */}
      <ProfileCard
        username={userData.username || ''}
        email={userData.email || ''}
        role={userData.role || ''}
        profilePhoto={croppedImg || '/defaultProfilePhoto.jpg'}
        bannerPhoto={bannerImg}
        isProfileLoading={isProfilePictureLoading}
        isBannerLoading={isBannerLoading}
        onProfilePhotoSet={onProfilePhotoSet}
        onBannerPhotoSet={onBannerPhotoSet}
        onRemoveBanner={removeBanner}
      />

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <X className="h-5 w-5 mr-2" />
              <p>{errorMessage}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto mt-1 text-red-700 hover:text-red-800 p-0"
              onClick={() => setErrorMessage(null)}
            >
              Dismiss
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <Form {...form}>
            <motion.form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username field - disabled */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Username cannot be changed after registration.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Email field - disabled */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Contact support to update your email address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* First Name field */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Last Name field */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              {/* Bio field */}
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        You can <span className="font-medium">@mention</span>{' '}
                        other users and organizations to link to them.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Address section */}
              <motion.div variants={itemVariants}>
                <AddressSection form={form} />
              </motion.div>

              {/* URLs section */}
              <motion.div variants={itemVariants}>
                <ProfileUrlsSection form={form} name="SocialMediaUrls" />
              </motion.div>

              <motion.div className="pt-4" variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update profile'}
                </Button>
              </motion.div>
            </motion.form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
