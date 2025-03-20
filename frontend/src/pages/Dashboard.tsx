import { logout } from '@/components/auth/authSlice';
import { IAuthUser } from '@/Interfaces/IAuthUser';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const Dashboard: React.FC = () => {
  const user: IAuthUser = useAppSelector((state) => state.auth as IAuthUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="dashboard">
        <h1>{user.role}'s Dashboard</h1>
        <div className="dashboard-content">
          <p>Hello {user.username} Welcome to the dashboard</p>

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
    </SidebarProvider>
  );
};

export default Dashboard;
