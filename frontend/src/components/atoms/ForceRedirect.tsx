import React, { useEffect } from 'react';
import { useAppSelector } from '../../hooks/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function ForceRedirect() {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  // Redirect control logic
  const forceNavigate = (path: string, msg: string) => {
    if (path !== location.pathname) {
      navigate(path);
      showRedirectInfoMessage(msg);
      console.log(`Redirecting to ${path} with message: ${msg}`);
    }
  };

  const showRedirectInfoMessage = async (
    msg: string,
    title: string = 'Action Required',
    variant: 'default' | 'destructive' = 'default',
  ) => {
    toast({
      variant: variant,
      title: title,
      description: msg,
    });
  };

  useEffect(() => {
    // Redirect Conditions
    if (!user.loading && authUser.token) {
      if (!user.isProfileComplete) {
        forceNavigate('/settings/profile', 'Complete your profile to continue');
      }
    }
  }, [authUser.token, user.loading, navigate, user.isProfileComplete]);

  return <></>;
}
