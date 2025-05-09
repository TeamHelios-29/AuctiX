'use client';

import React, { useEffect } from 'react';
import { Command } from 'lucide-react';
import { CollapsibleNavItem } from '../molecules/collapsible-navitem';

import { NavUser } from '@/components/molecules/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { IUser } from '@/types/IUser';
import { useAppSelector } from '@/hooks/hooks';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userData = useAppSelector((state) => state.user as IUser);
  const [data, setData] = React.useState({
    user: {
      name: '',
      email: '',
      avatar: '/defaultProfilePhoto.jpg',
    },

    navMain: [
      {
        title: 'Dashboard',
        items: [
          {
            title: 'Overview',
            url: '/dashboard',
            isActive: true,
          },
          {
            title: 'Auctions',
            items: [
              {
                title: 'Ongoing',
                url: '/auctions/ongoing',
              },
              {
                title: 'Upcoming',
                url: '/auctions/upcoming',
              },
              {
                title: 'Closed',
                url: '/auctions/closed',
              },
            ],
          },
          {
            title: 'Management',
            items: [
              {
                title: 'Delivery',
                url: '/delivery',
              },
              {
                title: 'Reports',
                url: '/Reports',
              },
              {
                title: 'Users',
                url: '/users',
              },
            ],
          },
          {
            title: 'Settings',
            items: [
              {
                title: 'Profile Settings',
                url: '/settings/profile',
              },
            ],
          },
        ],
      },
    ],
  });

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      user: {
        name: userData.username
          ? `${userData.firstName} ${userData?.lastName}`
          : '',
        email: userData.email || '',
        avatar: userData.profile_photo || '/defaultProfilePhoto.jpg',
      },
    }));
  }, [userData.username]);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="pl-4">
        <a href="#">
          <span className="text-black text-4xl font-normal font-productsans leading-normal">
            Aucti
          </span>
          <span className="text-[#ecb02d] text-4xl font-normal font-productsans leading-normal">
            X
          </span>
        </a>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <CollapsibleNavItem key={item.title} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
