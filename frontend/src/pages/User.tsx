import UserDataTable from '@/components/organisms/UserDataTable';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import useAxiosRequest from '@/services/axiosInspector';

export default function User() {
  // TODO: fetch statistics from the backend
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCatagory, setSelectedCategory] = useState<string | null>(null);
  const { axiosInstance } = useAxiosRequest();

  // user statistics initialization
  const [userStats, setUserStats] = useState({
    all: 0,
    bidders: 0,
    sellers: 0,
    admins: 0,
    supperAdmins: 0,
  });

  return (
    <div className="bg-white">
      <div className="p-6 max-w-6xl mx-auto">
        <header className="mb-4">
          <h1 className="text-3xl font-bold mb-1">User management</h1>
          <p className="text-gray-500">View and manage users</p>
        </header>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4 border-none shadow-none bg-gray-100">
            <div className="text-4xl font-bold">{userStats.all}</div>
            <div className="text-sm font-semibold text-gray-500">ALL USERS</div>
          </Card>
          <Card className="p-4 shadow-none">
            <div className="text-4xl font-bold">{userStats.bidders}</div>
            <div className="text-sm text-gray-500">BIDDERS</div>
          </Card>
          <Card className="p-4 shadow-none">
            <div className="text-4xl font-bold">{userStats.sellers}</div>
            <div className="text-sm text-gray-500">SELLERS</div>
          </Card>
          <Card className="p-4 shadow-none">
            <div className="text-4xl font-bold">{userStats.admins}</div>
            <div className="text-sm text-gray-500">ADMINS</div>
          </Card>
        </div>

        <UserDataTable />
      </div>
    </div>
  );
}
