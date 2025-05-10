'use client';

import React, { useEffect } from 'react';
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
  SidebarRail,
} from '@/components/ui/sidebar';
import { IUser } from '@/types/IUser';
import { useAppSelector } from '@/hooks/hooks';

interface NavItem {
  title: string;
  url: string;
  isActive: boolean;
  items?: NavItem[];
}

interface SidebarData {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: {
    title: string;
    items: NavItem[];
  }[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userData = useAppSelector((state) => state.user as IUser);
  const [data, setData] = React.useState<SidebarData>({
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
            isActive: false,
          },
          {
            title: 'Auctions',
            url: '',
            isActive: false,
            items: [
              {
                title: 'Ongoing',
                url: '/auctions/ongoing',
                isActive: false,
              },
              {
                title: 'Upcoming',
                url: '/auctions/upcoming',
                isActive: false,
              },
              {
                title: 'Closed',
                url: '/auctions/closed',
                isActive: false,
              },
            ],
          },
          {
            title: 'Management',
            url: '',
            isActive: false,
            items: [
              {
                title: 'Delivery',
                url: '/delivery',
                isActive: false,
              },
              {
                title: 'Reports',
                url: '/Reports',
                isActive: false,
              },
              {
                title: 'Users',
                url: '/users',
                isActive: false,
              },
              {
                title: 'Admin Management',
                url: '/admin-management',
                isActive: false,
              },
            ],
          },
          {
            title: 'Settings',
            url: '',
            isActive: false,
            items: [
              {
                title: 'Profile Settings',
                url: '/settings/profile',
                isActive: false,
              },
            ],
          },
        ],
      },
    ],
  });

  useEffect(() => {
    const currentPath = window.location.pathname;

    setData((prevData) => ({
      ...prevData,
      navMain: prevData.navMain.map((group) => ({
        ...group,
        items: group.items.map((item) => ({
          ...item,
          isActive: item.url === currentPath,
          items: item.items?.map((subItem) => ({
            ...subItem,
            isActive: subItem.url === currentPath,
          })),
        })),
      })),
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
