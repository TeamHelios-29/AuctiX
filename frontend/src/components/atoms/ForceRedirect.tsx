import React, { useEffect } from 'react';
import { useAppSelector } from '../../hooks/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function ForceRedirect() {
  const pendingActions = useAppSelector((state) => state.pendingActions);
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
    console.log('Checking pending actions for redirection...');
    if (!pendingActions.loading && authUser.token) {
      pendingActions.pendingActions.forEach((action) => {
        if (action.actionType === 'COMPLETE_PROFILE') {
          forceNavigate(
            '/settings/profile',
            'Complete your profile to continue',
          );
        } else if (
          action.actionType === 'SELLER_VERIFICATION_DOCUMENT_SUBMISSION'
        ) {
          forceNavigate(
            '/settings/verification-submit',
            'Verify your email to continue',
          );
        } else if (action.actionType === 'FIRST_LOGIN_CHANGE_PASSWORD') {
          forceNavigate(
            '/settings/payment',
            'Setup your payment method to continue',
          );
        }
      });
    }
  }, [authUser.token, pendingActions.loading, navigate]);

  return <></>;
}
