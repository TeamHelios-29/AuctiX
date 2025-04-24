import { IAuthUser } from '@/types/IAuthUser';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/organisms/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { logout } from '@/store/slices/authSlice';
import { fetchCurrentUser } from '@/store/slices/userSlice';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Avatar } from '@radix-ui/react-avatar';

const Dashboard: React.FC = () => {
  const user: IAuthUser = useAppSelector((state) => state.auth as IAuthUser);
  const userData = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('fetching user data...');
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="dashboard">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage
          src={
            userData != null ? userData.profile_photo || undefined : undefined
          }
          alt={`${userData.username}'s profile photo`}
        />
        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
      </Avatar>
      <h1>{user.role}'s Dashboard</h1>
      <div className="dashboard-content">
        <p>Hello {user.username}, Welcome to the dashboard</p>
        {userData.loading ? (
          <p>Loading user data...</p>
        ) : userData.error ? (
          <p>Error: {userData.error}</p>
        ) : (
          <div>
            <p>Email: {userData.email}</p>
            <p>First Name: {userData.firstName}</p>
            <p>Last Name: {userData.lastName}</p>
          </div>
        )}
        <input
          type="button"
          onClick={handleLogout}
          style={{
            backgroundColor: 'green',
            cursor: 'pointer',
            borderRadius: '5px',
            color: 'white',
            padding: '5px',
            border: 'none',
          }}
          value="Logout"
        />
      </div>
    </div>
  );
};

export default Dashboard;
