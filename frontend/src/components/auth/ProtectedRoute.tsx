import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAppSelector } from '@/services/hooks';

const ProtectedRoute = ({
  children,
  allowedUsers,
  redirectPath = '/403',
}: {
  children: ReactNode;
  allowedUsers: string[];
  redirectPath?: string;
}): ReactNode => {
  const userRole = useAppSelector((state) => state.auth.role);
  console.log(userRole);
  return userRole && allowedUsers.includes(userRole) ? (
    children
  ) : (
    <Navigate to={redirectPath} />
  );
};

export default ProtectedRoute;
