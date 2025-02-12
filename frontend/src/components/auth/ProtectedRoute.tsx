import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({
  children,
  allowedUsers,
  redirectPath,
}: {
  children: ReactNode;
  allowedUsers: string[];
  redirectPath: string;
}): ReactNode => {
  const { user } = useAuth();
  return user && allowedUsers.includes(user.role as string) ? (
    children
  ) : (
    <Navigate to={redirectPath ? redirectPath : '/login'} />
  );
};

export default ProtectedRoute;
