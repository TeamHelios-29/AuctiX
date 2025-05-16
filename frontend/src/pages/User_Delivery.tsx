import { useState } from 'react';
import {
  Truck,
  Package,
  User,
  ShoppingBag,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  Box,
  Clock,
  CalendarClock,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define TypeScript interfaces
interface Delivery {
  id: number;
  auctionName: string;
  deliveryDate: string;
  status: 'shipping' | 'packing' | 'delivered';
  seller: string;
  createdOn: string;
  image?: string;
}

// Mock data - replace with your actual data source
const mockDeliveries: Delivery[] = [
  {
    id: 1,
    auctionName: 'Antique Wooden Chair',
    deliveryDate: '2025-05-10',
    status: 'shipping',
    seller: 'Saman Perera',
    createdOn: '2025-05-01',
    image: '/api/placeholder/100/100',
  },
  {
    id: 2,
    auctionName: 'Vintage Watch Collection',
    deliveryDate: '2025-05-12',
    status: 'packing',
    seller: 'Kamal Jayasinghe',
    createdOn: '2025-04-29',
    image: '/api/placeholder/100/100',
  },
  {
    id: 3,
    auctionName: 'Handcrafted Pottery Set',
    deliveryDate: '2025-05-03',
    status: 'delivered',
    seller: 'Anura Wijerathne',
    createdOn: '2025-04-25',
    image: '/api/placeholder/100/100',
  },
];

// Get status color and icon
const getStatusInfo = (status: Delivery['status']) => {
  switch (status) {
    case 'shipping':
      return {
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        bgColor: 'bg-blue-50',
        icon: <Truck className="w-4 h-4 mr-1" />,
        text: 'Shipping',
      };
    case 'packing':
      return {
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        bgColor: 'bg-amber-50',
        icon: <Package className="w-4 h-4 mr-1" />,
        text: 'Packing',
      };
    case 'delivered':
      return {
        color: 'text-green-600 bg-green-50 border-green-200',
        bgColor: 'bg-green-50',
        icon: <ShoppingBag className="w-4 h-4 mr-1" />,
        text: 'Delivered',
      };
    default:
      return {
        color: 'text-gray-600 bg-gray-100 border-gray-200',
        bgColor: 'bg-gray-50',
        icon: <Package className="w-4 h-4 mr-1" />,
        text: status,
      };
  }
};

// Calculate days remaining or days since delivered
const getDaysInfo = (deliveryDate: string, status: Delivery['status']) => {
  const today = new Date();
  const delivery = new Date(deliveryDate);

  const diffTime = delivery.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (status === 'delivered') {
    if (diffDays < 0) {
      return {
        text: `Delivered ${Math.abs(diffDays)} days ago`,
        isOverdue: false,
      };
    } else {
      return {
        text: 'Delivered today',
        isOverdue: false,
      };
    }
  } else {
    if (diffDays > 0) {
      return {
        text: `${diffDays} days remaining`,
        isOverdue: false,
      };
    } else if (diffDays < 0) {
      return {
        text: `${Math.abs(diffDays)} days overdue`,
        isOverdue: true,
      };
    } else {
      return {
        text: 'Due today',
        isOverdue: false,
      };
    }
  }
};

// Hero banner component for top of page
const DeliveryHeroBanner = () => {
  return (
    <div className="bg-[linear-gradient(to_right_bottom,#fbbf24,#fef3c7)] mb-8 py-8 px-6 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Track Your Deliveries
          </h2>
          <p className="text-gray-700 max-w-md">
            Stay updated with the status of your auction purchases and monitor
            their delivery progress.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Truck size={64} className="text-gray-800" />
        </div>
      </div>
    </div>
  );
};

const UserDeliveryPage = () => {
  const [deliveries] = useState<Delivery[]>(mockDeliveries);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Filter deliveries based on active tab
  const filteredDeliveries = deliveries.filter((delivery) => {
    if (activeTab === 'all') return true;
    return delivery.status === activeTab;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Deliveries</h1>
          <p className="text-gray-500">
            Track and manage your auction deliveries
          </p>
        </header>

        <DeliveryHeroBanner />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card
            className={`p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${activeTab === 'all' ? 'border-2 border-amber-300' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <ShoppingBag className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <div className="text-3xl font-bold">{deliveries.length}</div>
                <div className="text-sm text-gray-500">All Deliveries</div>
              </div>
            </div>
          </Card>
          <Card
            className={`p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${activeTab === 'shipping' ? 'border-2 border-amber-300' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {deliveries.filter((d) => d.status === 'shipping').length}
                </div>
                <div className="text-sm text-gray-500">Shipping</div>
              </div>
            </div>
          </Card>
          <Card
            className={`p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${activeTab === 'packing' ? 'border-2 border-amber-300' : ''}`}
            onClick={() => setActiveTab('packing')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-600">
                  {deliveries.filter((d) => d.status === 'packing').length}
                </div>
                <div className="text-sm text-gray-500">Packing</div>
              </div>
            </div>
          </Card>
          <Card
            className={`p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${activeTab === 'delivered' ? 'border-2 border-amber-300' : ''}`}
            onClick={() => setActiveTab('delivered')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {deliveries.filter((d) => d.status === 'delivered').length}
                </div>
                <div className="text-sm text-gray-500">Delivered</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Tabs
            defaultValue="all"
            className="w-full md:w-auto"
            onValueChange={(value) => setActiveTab(value)}
            value={activeTab}
          >
            <TabsList className="grid grid-cols-4 w-full md:w-auto bg-gray-100 p-1">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900"
              >
                Shipping
              </TabsTrigger>
              <TabsTrigger
                value="packing"
                className="data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900"
              >
                Packing
              </TabsTrigger>
              <TabsTrigger
                value="delivered"
                className="data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900"
              >
                Delivered
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search deliveries"
                className="pl-8 border-gray-300 focus-visible:ring-amber-300"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-1 border-amber-300 text-amber-600 hover:bg-amber-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        {/* Delivery Cards */}
        {filteredDeliveries.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800">
              No deliveries found
            </h3>
            <p className="text-gray-500 mt-2">
              {activeTab === 'all'
                ? "You don't have any deliveries yet."
                : `You don't have any ${activeTab} deliveries.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDeliveries.map((delivery) => {
              const statusInfo = getStatusInfo(delivery.status);
              const daysInfo = getDaysInfo(
                delivery.deliveryDate,
                delivery.status,
              );

              return (
                <Card
                  key={delivery.id}
                  className="p-5 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Image and basic info */}
                    <div className="flex gap-4 flex-grow">
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {delivery.image ? (
                          <img
                            src={delivery.image}
                            alt={delivery.auctionName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Box size={30} />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-between">
                        <div>
                          <h2 className="font-semibold text-lg text-gray-800">
                            {delivery.auctionName}
                          </h2>
                          <div className="text-gray-500 text-sm flex items-center mt-1">
                            <User className="w-3 h-3 mr-1" />
                            Seller: {delivery.seller}
                          </div>
                        </div>

                        <Badge
                          className={`w-fit flex items-center ${statusInfo.color} border`}
                        >
                          {statusInfo.icon}
                          {statusInfo.text}
                        </Badge>
                      </div>
                    </div>

                    {/* Delivery details */}
                    <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
                      <div className="flex flex-col justify-center px-4 py-2 bg-gray-50 rounded-md">
                        <span className="text-xs text-gray-500 flex items-center">
                          <CalendarClock className="w-3 h-3 mr-1" />
                          Delivery Date
                        </span>
                        <span className="font-medium">
                          {new Date(delivery.deliveryDate).toLocaleDateString(
                            undefined,
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            },
                          )}
                        </span>
                      </div>

                      <div className="flex flex-col justify-center px-4 py-2 bg-gray-50 rounded-md">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Timeline
                        </span>
                        <span
                          className={`font-medium ${daysInfo.isOverdue ? 'text-red-500' : ''}`}
                        >
                          {daysInfo.text}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        className="self-center whitespace-nowrap flex items-center border-amber-300 text-amber-600 hover:bg-amber-50"
                      >
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Warning for overdue deliveries */}
                  {daysInfo.isOverdue && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center text-sm">
                      <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                      This delivery is overdue. Contact the seller for more
                      information.
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <Button
                      className="bg-amber-300 hover:bg-amber-400 text-gray-900 flex items-center"
                      size="sm"
                    >
                      Contact Seller
                    </Button>
                    <Button
                      variant="outline"
                      className="border-amber-300 text-amber-600 hover:bg-amber-50 flex items-center"
                      size="sm"
                    >
                      Track Package
                    </Button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    Order placed on{' '}
                    {new Date(delivery.createdOn).toLocaleDateString(
                      undefined,
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      },
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredDeliveries.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-500">
              Showing {filteredDeliveries.length} of {deliveries.length}{' '}
              deliveries
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-amber-300 text-amber-600"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-amber-300 text-amber-600"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDeliveryPage;
