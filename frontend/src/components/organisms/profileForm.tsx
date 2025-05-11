'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Plus, X } from 'lucide-react';

import { cn } from '@/lib/utils';
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
import { AlertBox } from './AlertBox';
import { Card, CardContent } from '@/components/ui/card';
import ImageUploadPopup, { ImageResult } from '../molecules/ImageUploadPopup';
import { deleteProfilePhoto, updateProfilePhoto } from '@/services/userService';
import { AxiosInstance } from 'axios';
import AxiosRequest from '@/services/axiosInspector';
import { fetchCurrentUser } from '@/store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { useToast } from '@/hooks/use-toast';

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
    country: z.string(),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isProfilePictureLoading, setIsProfilePictureLoading] = useState(false);
  const { toast } = useToast();

  const axiosInstance: AxiosInstance = AxiosRequest().axiosInstance;
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'urls',
    control: form.control,
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
      bio: '',
      address: {
        number: '',
        addressLine1: '',
        addressLine2: '',
        country: '',
      },
      urls: [],
    };
    form.reset(values);
    setCroppedImg(userData.profile_photo || null);
  }, [userData]);

  function onSubmit(data: ProfileFormValues) {
    setIsAlertOpen(true);
  }

  const onProfilePhotoSet = useCallback((e: ImageResult) => {
    console.log(e);
    if (e.croppedImageBase64 != undefined && e.croppedImageFile) {
      setCroppedImg(e.croppedImageBase64);
      setIsProfilePictureLoading(true);
      updateProfilePhoto(e.croppedImageFile, axiosInstance)
        .then(() => {
          console.log('Profile picture uploaded successfully.');
          toast({
            title: 'Profile picture uploaded successfully.',
            description: 'Your profile picture has been updated.',
          });
          dispatch(fetchCurrentUser());
        })
        .finally(() => {
          setIsProfilePictureLoading(false);
        })
        .catch(() => {
          console.error('Profile picture not uploaded.');
          toast({
            variant: 'destructive',
            title: 'Profile picture not uploaded.',
            description: 'There was an error uploading your profile picture.',
          });
        });
    }
  }, []);

  const onProfilePhotoDelete = useCallback(() => {
    setCroppedImg(null);
    setIsProfilePictureLoading(false);
    deleteProfilePhoto(
      userData.username ? userData.username : '',
      axiosInstance,
    )
      .then(() => {
        console.log('Profile picture deleted successfully.');
        toast({
          title: 'Profile picture deleted successfully.',
          description: 'Your profile picture has been removed.',
        });
        dispatch(fetchCurrentUser());
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Profile picture not deleted.',
          description: 'There was an error deleting your profile picture.',
        });
        console.error('Profile picture not deleted.');
      });
  }, []);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
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

      <Card>
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

              {/* Profile Photo Upload */}
              <motion.div
                className="flex flex-col items-center space-y-4"
                variants={itemVariants}
              >
                <div className="w-32 h-32 overflow-hidden rounded-full border border-gray-200">
                  {!isProfilePictureLoading ? (
                    <img
                      className="w-full h-full object-cover"
                      src={croppedImg ? croppedImg : '/defaultProfilePhoto.jpg'}
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-32 h-32 overflow-hidden rounded-full border border-gray-200">
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    </div>
                  )}
                </div>
                <ImageUploadPopup
                  minHeight={100}
                  minWidth={100}
                  acceptingHeight={500}
                  acceptingWidth={500}
                  shape="circle"
                  onConfirm={onProfilePhotoSet}
                  onDelete={onProfilePhotoDelete}
                />
              </motion.div>

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

              {/* Address fields */}
              <motion.div className="space-y-4" variants={itemVariants}>
                <h3 className="text-lg font-medium">Address Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="address.number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>House/Building Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="United States" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.addressLine1"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input placeholder="Street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.addressLine2"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Apartment, suite, unit, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              {/* URLs section */}
              <motion.div className="space-y-4" variants={itemVariants}>
                <h3 className="text-lg font-medium">Social Media & Websites</h3>

                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FormField
                      control={form.control}
                      name={`urls.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className={cn(index !== 0 && 'sr-only')}>
                            URLs
                          </FormLabel>
                          <FormDescription
                            className={cn(index !== 0 && 'sr-only')}
                          >
                            Add links to your website, blog, or social media
                            profiles.
                          </FormDescription>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-8"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove URL</span>
                    </Button>
                  </motion.div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ value: '' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add URL
                </Button>
              </motion.div>

              <motion.div className="pt-4" variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full md:w-auto"
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
