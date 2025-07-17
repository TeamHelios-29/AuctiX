'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ModalOverlay } from '@/components/molecules/ModalOverlay';
import { UserProfileCard } from '@/components/molecules/UserProfileCard';
import { WarningMessage } from '@/components/molecules/WarningMessage';
import { ModalButton } from '@/components/atoms/ModalButton';
import { IUser } from '@/types/IUser';
import { assets } from '@/config/assets';

interface RemoveProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser;
  onRemove: (userId: string) => Promise<void>;
}

export function RemoveProfilePictureModal({
  isOpen,
  onClose,
  user,
  onRemove,
}: RemoveProfilePictureModalProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    if (user.username == null || user.email == null) {
      return;
    }
    setIsRemoving(true);
    try {
      await onRemove(user.username);
      onClose();
    } catch (error) {
      console.error('Failed to remove profile picture:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h2 className="text-xl font-semibold text-foreground">
            Remove Profile Picture
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </motion.button>
        </motion.div>

        {/* User Profile Card */}
        <UserProfileCard user={user} />

        {/* Warning Message */}
        <WarningMessage
          title="Permanent Action"
          message="This action cannot be undone. The user's profile picture will be permanently removed from their account."
        />

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg"
        >
          <p>
            <strong>Note:</strong> The user will be notified of this action and
            can upload a new profile picture at any time.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 pt-4"
        >
          <ModalButton
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isRemoving}
          >
            Cancel
          </ModalButton>
          <ModalButton
            onClick={handleRemove}
            variant="destructive"
            className="flex-1"
            loading={isRemoving}
            disabled={!user.profile_photo}
          >
            Remove Picture
          </ModalButton>
        </motion.div>

        {/* No Picture Message */}
        {user.profile_photo === assets.default_profile_image && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground italic"
          >
            This user doesn't have a profile picture to remove.
          </motion.p>
        )}
      </div>
    </ModalOverlay>
  );
}
