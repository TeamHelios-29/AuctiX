import { Navigate, useNavigate } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { useAppSelector } from '@/hooks/hooks';

const ProtectedRoute = ({
  children,
  allowedUsers,
  redirectPath = '/403',
}: {
  children: ReactNode;
  allowedUsers: string[];
  redirectPath?: string;
}): ReactNode => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log('ProtectedRoute called');
    if (user?.role && !allowedUsers.includes(user.role)) {
      console.log(
        'user :',
        user?.role,
        'not allowed, redirecting to:',
        redirectPath,
      );
      navigate(redirectPath);
    } else if (!user?.token) {
      console.log('user token is null, redirecting to login', user?.token);
      navigate('/login');
    } else {
      console.log(
        'userRole:',
        user?.role,
        'allowedUsers:',
        allowedUsers,
        'autherized',
      );
    }
  }, [user?.role, allowedUsers, redirectPath, navigate, user?.token]);

  return user?.role &&
    (allowedUsers.includes(user.role) || allowedUsers.includes('ANY')) ? (
    children
  ) : (
    <></>
  );
};

export default ProtectedRoute;
