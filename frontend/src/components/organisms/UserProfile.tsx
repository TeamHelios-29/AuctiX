import React from 'react';
import ProfileCard from '../molecules/ProfileCard';
import { assets } from '@/config/assets';
import { useAppSelector } from '@/hooks/hooks';
import { useParams } from 'react-router-dom';

export default function UserProfile() {
  const userData = useAppSelector((state) => state.user);
  // TODO: Fetch user data based on the id from the URL params instead of current user data
  const { id } = useParams<{ id: string }>();
  console.log('Profile id extracted: ', id);

  return (
    <>
      <ProfileCard
        username={userData.username || ''}
        email={userData.email || ''}
        role={userData.role || ''}
        profilePhoto={userData.profile_photo || assets.default_profile_image}
        bannerPhoto={assets.default_banner_image}
        isProfileLoading={false}
        isBannerLoading={false}
        isInEditMode={true}
        onProfilePhotoSet={() => {}}
        onBannerPhotoSet={() => {}}
        onRemoveBanner={() => {}}
        onProfilePhotoDelete={() => {}}
      />
    </>
  );
}
