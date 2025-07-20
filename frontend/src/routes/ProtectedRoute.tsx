import { useNavigate } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { useAppSelector } from '@/hooks/hooks';
import ForceRedirect from '@/components/atoms/ForceRedirect';

const ProtectedRoute = ({
  children,
  allowedUsers,
  redirectPath = '/403',
  ignorePendingForceRedirects = false,
}: {
  children: ReactNode;
  allowedUsers: string[];
  redirectPath?: string;
  ignorePendingForceRedirects?: boolean;
}): ReactNode => {
  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.auth);
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    console.log('ProtectedRoute called');
    if (
      authUser?.role &&
      !allowedUsers.includes(authUser.role) &&
      !allowedUsers.includes('ANY')
    ) {
      console.log(
        'user :',
        authUser?.role,
        'not allowed, redirecting to:',
        redirectPath,
      );
      navigate(redirectPath);
    } else if (!authUser?.token && !user.loading) {
      console.log('user token is null, redirecting to login', authUser?.token);
      navigate('/login');
    } else {
      console.log(
        'userRole:',
        authUser?.role,
        'allowedUsers:',
        allowedUsers,
        'authorized',
      );
    }
  }, [
    authUser.role,
    authUser.token,
    allowedUsers,
    redirectPath,
    navigate,
    user.loading,
  ]);

  const checkIsAuthorized = () => {
    return (
      authUser?.role &&
      (allowedUsers.includes(authUser.role) || allowedUsers.includes('ANY'))
    );
  };

  return (
    <>
      {!ignorePendingForceRedirects ? <ForceRedirect /> : null}
      {checkIsAuthorized() ? children : null}
    </>
  );
};

export default ProtectedRoute;
