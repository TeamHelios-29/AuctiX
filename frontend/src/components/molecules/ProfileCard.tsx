'use client';

import { motion } from 'framer-motion';
import type { ImageResult } from '../molecules/ImageUploadPopup';
import ImageUploadPopup from '../molecules/ImageUploadPopup';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Trash2, ImagePlus } from 'lucide-react';
import { TooltipBtn } from '../atoms/TooltipBtn';

interface ProfileCardProps {
  username: string;
  email: string;
  role: string;
  profilePhoto: string;
  bannerPhoto: string;
  isProfileLoading: boolean;
  isBannerLoading: boolean;
  onProfilePhotoSet: (e: ImageResult) => void;
  onBannerPhotoSet: (e: ImageResult) => void;
  onRemoveBanner: () => void;
}

export default function ProfileCard({
  username,
  email,
  role,
  profilePhoto,
  bannerPhoto,
  isProfileLoading,
  isBannerLoading,
  onProfilePhotoSet,
  onBannerPhotoSet,
  onRemoveBanner,
}: ProfileCardProps) {
  const formatRole = (role: string) => {
    return role
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Card className="overflow-hidden mb-6">
      {/* Banner Section */}
      <div className="relative h-48 bg-gray-200">
        {isBannerLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <img
              src={bannerPhoto || '/placeholder.svg'}
              alt="Profile Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <ImageUploadPopup
                minHeight={300}
                minWidth={1000}
                acceptingHeight={500}
                acceptingWidth={1500}
                shape="square"
                onConfirm={onBannerPhotoSet}
              />
              <TooltipBtn
                icon={Trash2}
                text="Remove Banner"
                onClick={onRemoveBanner}
              />
            </div>
          </motion.div>
        )}

        {/* Profile Photo (positioned to overlap the banner) */}
        <div className="absolute -bottom-16 left-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
              {isProfileLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <img
                  src={profilePhoto || '/placeholder.svg'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2">
              <ImageUploadPopup
                minHeight={100}
                minWidth={100}
                acceptingHeight={500}
                acceptingWidth={500}
                shape="circle"
                onConfirm={onProfilePhotoSet}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <CardContent className="pt-20 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold">{username}</h2>
          <p className="text-gray-500">{email}</p>
          <div className="mt-2">
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {formatRole(role)}
            </span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
