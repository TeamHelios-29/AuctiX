import React, { useEffect } from 'react';
import { ValidityIndicator } from '../atoms/validityIndicator';
import { AxiosInstance } from 'axios';
import AxiosReqest from '@/services/axiosInspector';

export default function ValidateUsernameOrEmail({
  usernameOrEmail,
  offset,
  type,
}: {
  usernameOrEmail: string | null;
  offset: { x: number; y: number };
  type: 'email' | 'username';
}) {
  const [isUserAvailable, setIsUserAvailable] = React.useState(false);
  const [isUserAvailableLoading, setIsUserAvailableLoading] =
    React.useState(false);
  const [isWaitingForApiCall, setIsWaitingForApiCall] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);

  const axiosInstance: AxiosInstance = AxiosReqest().axiosInstance;

  useEffect(() => {
    setIsTyping(true);
  }, [usernameOrEmail]);

  useEffect(() => {
    if (isTyping) {
      setTimeout(() => {
        if (isTyping) {
          setIsTyping(false);
          setIsWaitingForApiCall(true);
        }
      }, 1000);
    }
  }, [isTyping]);

  useEffect(() => {
    if (isWaitingForApiCall) {
      setIsWaitingForApiCall(false);
      isUserNameAvailable();
    }
  }, [isWaitingForApiCall]);

  const isUserNameAvailable = () => {
    if (type === 'username' && usernameOrEmail && usernameOrEmail.length >= 3) {
      setIsUserAvailableLoading(true);

      setTimeout(() => {
        if (!isTyping) {
          isUserAvailableApiCall();
        }
      }, 1000);
    } else if (
      type === 'email' &&
      usernameOrEmail &&
      usernameOrEmail.length >= 3 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail)
    ) {
      setIsUserAvailableLoading(true);

      setTimeout(() => {
        if (!isTyping) {
          isUserAvailableApiCall();
        }
      }, 1000);
    } else {
      // less than 3 characters, are not available for users
      setIsUserAvailableLoading(false);
      setIsUserAvailable(false);
    }
  };

  const isUserAvailableApiCall = () => {
    console.log('isUserAvailableApiCall for', usernameOrEmail);

    axiosInstance
      .get('/user/isUserExists', {
        params: {
          [type == 'email' ? 'email' : 'username']: usernameOrEmail,
        },
      })
      .then((res) => {
        console.log('isUserAvailable', !res.data);
        setIsUserAvailable(!res.data);
      })
      .finally(() => {
        setIsUserAvailableLoading(false);
      });
  };

  return (
    <ValidityIndicator
      isUsernameAvailable={isUserAvailable}
      isUsernameAvailableLoading={isUserAvailableLoading}
      offset={offset}
    />
  );
}
