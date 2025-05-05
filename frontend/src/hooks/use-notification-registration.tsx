import { useEffect, useCallback, useRef } from 'react';
import { useAppSelector } from '@/hooks/hooks';
import {
  registerSWAndRequestNotificationPermission,
  unregisterServiceWorker,
} from '@/firebase/firebase';
import AxiosRequest from '@/services/axiosInspector';

export function useNotificationRegistration() {
  const userData = useAppSelector((state) => state.user);
  const { axiosInstance } = AxiosRequest();
  const axiosRef = useRef(axiosInstance);

  // Update ref when axiosInstance changes
  useEffect(() => {
    axiosRef.current = axiosInstance;
  }, [axiosInstance]);

  const sendFcmTokenToServer = useCallback(async (fcmToken: string) => {
    try {
      const response = await axiosRef.current.post(
        '/notification/settings/set-device-fcm-token',
        {
          fcmToken: fcmToken,
        },
      );

      console.log('FCM token sent to server:', response.data);
    } catch (error) {
      console.error('Error sending FCM token to server:', error);
    }
  }, []);

  useEffect(() => {
    const handleNotificationRegistration = async () => {
      if (userData.email != null) {
        const token = await registerSWAndRequestNotificationPermission();
        if (token) {
          await sendFcmTokenToServer(token);
        }
      } else {
        unregisterServiceWorker();
      }
    };

    handleNotificationRegistration();
  }, [userData, sendFcmTokenToServer]);
}
