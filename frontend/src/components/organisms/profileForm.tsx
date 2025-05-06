import { zodResolver } from '@hookform/resolvers/zod';
import { set, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { CheckCircle2 } from 'lucide-react';
import { AlertBox } from './AlertBox';
import { useCallback, useEffect, useState } from 'react';
import ImageUploadPopup, { ImageResult } from '../molecules/ImageUploadPopup';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { IUser } from '@/types/IUser';

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
      message: 'First name must be at least 2 characters.',
    })
    .max(30, {
      message: 'First name must not be longer than 30 characters.',
    }),
  lastName: z
    .string()
    .min(3, {
      message: 'Last name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Last name must not be longer than 30 characters.',
    })
    .optional(),

  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  bio: z.string().max(160).min(4),
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

export function ProfileForm() {
  const [cropedImg, setCropedImg] = useState<string | null>(null);
  const [imgData, setImgData] = useState<ImageResult | null>(null);
  const [defaultValues, setDefaultValue] = useState<Partial<ProfileFormValues>>(
    {},
  );

  const userdata: IUser = useAppSelector((state) => state.user as IUser);
  type ProfileFormValues = z.infer<typeof profileFormSchema>;

  useEffect(() => {
    const values = {
      bio: 'I own a computer shop.',
      urls: [{ value: 'https://shadcn.com' }],
      username: userdata.username || '',
      firstName: userdata.firstName || '',
      lastName: userdata.lastName || '',
      email: userdata.email || '',
      address: {
        number: '',
        addressLine1: '',
        addressLine2: '',
        country: '',
      },
    };
    form.reset(values);
    setCropedImg(userdata.profile_photo || null);
  }, [userdata]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control,
  });

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  function onSubmit(data: ProfileFormValues) {
    setIsAlertOpen(true);
  }

  const onProfilePhotoSet = useCallback((e: ImageResult) => {
    console.log(e);
    if (e.cropedImage != undefined) {
      setCropedImg(e.cropedImage);
      setImgData(e);
    }
  }, []);

  return (
    <Form {...form}>
      <AlertBox
        onAlertOpenChange={() => {}}
        IconElement={<CheckCircle2 />}
        alertOpen={isAlertOpen}
        title="Confirm Profile Update"
        message=""
        continueBtn="Confirm"
        cancelBtn="Cancel"
      />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username field - disabled */}
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

          {/* Email field - disabled */}
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

          {/* First Name field */}
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

          {/* Last Name field */}
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
        </div>

        {/* Profile Photo Upload */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 overflow-hidden rounded-full border border-gray-200">
            <img
              className="w-full h-full object-cover"
              src={cropedImg ? cropedImg : '/defaultProfilePhoto.jpg'}
              alt="Profile"
            />
          </div>
          <ImageUploadPopup
            minHeight={100}
            minWidth={100}
            acceptingHeight={500}
            acceptingWidth={500}
            shape="circle"
            onConfirm={onProfilePhotoSet}
          />
        </div>

        {/* Bio field */}
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
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address fields */}
        <div className="space-y-4">
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
        </div>

        {/* URLs section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Media & Websites</h3>

          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: '' })}
          >
            Add URL
          </Button>
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Update profile
        </Button>
      </form>
    </Form>
  );
}
