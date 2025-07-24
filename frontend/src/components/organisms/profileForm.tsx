import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { ImageResult } from '../molecules/ImageUploadPopup';
import {
  deleteBannerPhoto,
  deleteProfilePhoto,
  IProfileUpdateData,
  updateBannerPhoto,
  updateProfileInfo,
  updateProfilePhoto,
} from '@/services/userService';
import { AxiosInstance } from 'axios';
import AxiosRequest from '@/services/axiosInspector';
import { fetchCurrentUser } from '@/store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { useToast } from '@/hooks/use-toast';
import { AlertBox } from './AlertBox';
import ProfileCard from '../molecules/ProfileCard';
import { ProfileUrlsSection } from '../molecules/ProfileURLsSection';
import { AddressSection } from '../molecules/ProfileAddressSection';
import { PersonalBasicInfoSection } from '../molecules/ProfileBasicInfoSection';
import { assets } from '@/config/assets';
import { IUser } from '@/types/IUser';
import { fetchPendingRequiredActions } from '@/store/slices/requiredActionsSlice';

const profileFormSchema = z.object({
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
    }),
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
        value: z.string().min(1, { message: 'URL cannot be empty.' }).url({
          message: 'Please enter a valid URL including http:// or https://.',
        }),
        timestamp: z.number().optional(),
      }),
    )
    .min(0)
    .optional()
    .superRefine((urls, ctx) => {
      if (urls) {
        // Check for duplicate URLs
        const urlValues = urls.map((u) => u.value.toLowerCase());
        const duplicates = urlValues.filter(
          (item, index) => urlValues.indexOf(item) !== index,
        );

        if (duplicates.length > 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Duplicate URLs are not allowed',
            path: [],
          });
        }
      }
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  firstName: '',
  lastName: '',
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
  // useState hooks
  const [croppedImg, setCroppedImg] = useState<string | null>(null);
  const [bannerImg, setBannerImg] = useState<string>(
    assets.default_banner_image,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isProfilePictureLoading, setIsProfilePictureLoading] = useState(false);
  const [isBannerLoading, setIsBannerLoading] = useState(false);

  // hooks
  const { toast } = useToast();
  const axiosInstance: AxiosInstance = AxiosRequest().axiosInstance;
  const dispatch = useAppDispatch();
  const userData = useAppSelector<IUser>((state) => state.user);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  // useEffect hooks
  useEffect(() => {
    const values = {
      ...defaultValues,
    };
    form.reset(values);
  }, [form]);

  useEffect(() => {
    // default values for the form
    const values: ProfileFormValues = {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      bio: '',
      address: {
        number: '',
        addressLine1: '',
        addressLine2: '',
        country: '',
      },
      urls: [],
    };

    if ('bio' in userData && typeof userData.bio === 'string') {
      values.bio = userData.bio;
    }

    if ('address' in userData && userData.address) {
      const address = userData.address as any;
      if (address.number) values.address.number = address.number;
      if (address.addressLine1)
        values.address.addressLine1 = address.addressLine1;
      if (address.addressLine2)
        values.address.addressLine2 = address.addressLine2;
      if (address.country) values.address.country = address.country;
    }

    if ('urls' in userData && Array.isArray(userData.urls)) {
      values.urls = (userData.urls as any[]).map((url) => ({
        value: url.value || '',
        timestamp: url.timestamp || Date.now(),
      }));
    }

    form.reset(values);
    setCroppedImg(userData.profile_photo || null);
    setBannerImg(userData.banner_photo || assets.default_banner_image);
  }, [userData, form]);

  function onSubmit(_data: ProfileFormValues) {
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

  const onBannerPhotoSet = useCallback(
    (e: ImageResult) => {
      if (e.croppedImageBase64 != undefined && e.croppedImageFile) {
        setBannerImg(e.croppedImageBase64);
        setIsBannerLoading(true);
        updateBannerPhoto(e.croppedImageFile, axiosInstance)
          .then(() => {
            dispatch(fetchCurrentUser);
          })
          .finally(() => {
            setIsBannerLoading(false);
          })
          .catch((error) => {
            toast({
              variant: 'destructive',
              title: 'Banner not uploaded.',
              description: 'Failed to upload banner image. Please try again.',
            });
            console.error('Banner image not uploaded.', error);
          });
      }
    },
    [axiosInstance, dispatch],
  );

  const onRemoveBanner = () => {
    setIsBannerLoading(true);
    setBannerImg(assets.default_banner_image);
    // TODO: API call to remove banner
    deleteBannerPhoto(userData.username || '', axiosInstance)
      .then(() => {
        console.log('Banner image deleted successfully.');
        toast({
          title: 'Banner image deleted successfully.',
          description: 'Your banner image has been removed.',
        });
        dispatch(fetchCurrentUser());
      })
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Banner not deleted.',
          description: 'Failed to delete banner image. Please try again.',
        });
        console.error('Banner image not deleted.', error);
      })
      .finally(() => {
        setIsBannerLoading(false);
      });
  };

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
    setTimeout(() => {
      const formData = form.getValues();
      console.log('Submitting form data:', formData);
      let validUrls: string[] = [];
      if (formData.urls && formData.urls.length > 0) {
        validUrls = formData.urls
          .filter((url) => url.value.trim() !== '')
          .map((url) => url.value);
        console.log('URLs to submit:', validUrls);
      }

      // Prepare profile data for submission
      const profileData: IProfileUpdateData = {
        bio: formData.bio,
        firstName: formData.firstName,
        lastName: formData.lastName,
        urls: validUrls,
        address: {
          number: formData.address.number || '',
          addressLine1: formData.address.addressLine1 || '',
          addressLine2: formData.address.addressLine2 || '',
          country: formData.address.country || '',
        },
      };

      updateProfileInfo(profileData, axiosInstance)
        .then(() => {
          toast({
            title: 'Profile details updated successfully',
            description: 'Your profile details has been updated.',
          });
          dispatch(fetchPendingRequiredActions());
        })
        .catch((err) => {
          console.error('Error updating profile details:', err);
          toast({
            variant: 'destructive',
            title: 'Profile details not updated.',
            description:
              'There was an error when updating your profile details.',
          });
        });

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
      {/* Update profile alert */}
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
        profilePhoto={croppedImg || assets.default_profile_image}
        bannerPhoto={bannerImg}
        isProfileLoading={isProfilePictureLoading}
        isBannerLoading={isBannerLoading}
        onProfilePhotoSet={onProfilePhotoSet}
        onProfilePhotoDelete={onProfilePhotoDelete}
        onBannerPhotoSet={onBannerPhotoSet}
        onRemoveBanner={onRemoveBanner}
        isInEditMode={true}
      />

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
              {/* PersonalInfoSection */}
              <div className="space-y-6">
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="h-0.5 w-full bg-gray-100 my-2"></div>
                </motion.div>

                <PersonalBasicInfoSection form={form} />
              </div>

              {/* Address section */}
              <div className="space-y-6 pt-4">
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-medium">Address Information</h3>
                  <div className="h-0.5 w-full bg-gray-100 my-2"></div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <AddressSection form={form} />
                </motion.div>
              </div>

              {/* URLs section */}
              <div className="space-y-6 pt-4">
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-medium">Online Presence</h3>
                  <div className="h-0.5 w-full bg-gray-100 my-2"></div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="urls"
                    render={({ fieldState }) => (
                      <FormItem>
                        <ProfileUrlsSection form={form} name="urls" />
                        {fieldState.error && (
                          <FormMessage>
                            {fieldState.error.message ||
                              'Please check your URLs for errors.'}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              <motion.div className="pt-6" variants={itemVariants}>
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
