import { useState } from 'react';
import {
  Truck,
  Package,
  Calendar,
  ShoppingBag,
  Check,
  AlertCircle,
  Plus,
  Search,
  ArrowLeft,
  ArrowRight,
  Filter,
  Loader2,
  User,
  MapPin,
  BookOpen,
  MessageCircle,
  Box,
  CalendarClock,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Define TypeScript interfaces
interface Delivery {
  id: number;
  auctionName: string;
  deliveryDate: string;
  status: 'shipping' | 'packing' | 'delivered';
  createdOn: string;
  buyerName: string;
  buyerLocation: string;
  image?: string;
  category?: string;
  price?: number;
}

// Mock data - this would be replaced with data from your backend
const mockDeliveries: Delivery[] = [
  {
    id: 1,
    auctionName: 'Antique Wooden Chair',
    deliveryDate: '2025-05-10',
    status: 'shipping',
    createdOn: '2025-05-01',
    buyerName: 'Tishan Dias',
    buyerLocation: 'Colombo, Sri Lanka',
    image: '/api/placeholder/100/100',
    category: 'Furniture',
    price: 35000,
  },
  {
    id: 2,
    auctionName: 'Vintage Watch Collection',
    deliveryDate: '2025-05-12',
    status: 'packing',
    createdOn: '2025-04-29',
    buyerName: 'Rahul Perera',
    buyerLocation: 'Kandy, Sri Lanka',
    image: '/api/placeholder/100/100',
    category: 'Collectibles',
    price: 75000,
  },
  {
    id: 3,
    auctionName: 'Handcrafted Pottery Set',
    deliveryDate: '2025-05-03',
    status: 'delivered',
    createdOn: '2025-04-25',
    buyerName: 'Amaya Fernando',
    buyerLocation: 'Galle, Sri Lanka',
    image: '/api/placeholder/100/100',
    category: 'Home Decor',
    price: 12500,
  },
];

// Helper function to get item icon based on category
const getItemIcon = (category?: string) => {
  switch (category?.toLowerCase()) {
    case 'furniture':
      return <ShoppingBag size={30} className="text-amber-700" />;
    case 'collectibles':
      return <BookOpen size={30} className="text-blue-700" />;
    case 'electronics':
      return <Box size={30} className="text-gray-700" />;
    case 'home decor':
      return <Box size={30} className="text-green-700" />;
    default:
      return <Box size={30} className="text-gray-700" />;
  }
};

// Get status color and icon
const getStatusInfo = (status: Delivery['status']) => {
  switch (status) {
    case 'shipping':
      return {
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        bgColor: 'bg-blue-50',
        buttonColor: 'bg-blue-500 hover:bg-blue-600 text-white',
        icon: <Truck className="w-4 h-4 mr-1" />,
        text: 'Shipping',
      };
    case 'packing':
      return {
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        bgColor: 'bg-amber-50',
        buttonColor: 'bg-amber-400 hover:bg-amber-500 text-gray-900',
        icon: <Package className="w-4 h-4 mr-1" />,
        text: 'Packing',
      };
    case 'delivered':
      return {
        color: 'text-green-600 bg-green-50 border-green-200',
        bgColor: 'bg-green-50',
        buttonColor: 'bg-green-500 hover:bg-green-600 text-white',
        icon: <Check className="w-4 h-4 mr-1" />,
        text: 'Delivered',
      };
    default:
      return {
        color: 'text-gray-600 bg-gray-100 border-gray-200',
        bgColor: 'bg-gray-50',
        buttonColor: 'bg-gray-500 hover:bg-gray-600 text-white',
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

// Format currency
const formatCurrency = (amount: number = 0) => {
  return `LKR ${amount.toLocaleString()}`;
};

// Hero banner component for top of page
const DeliveryHeroBanner = () => {
  return (
    <div className="bg-[linear-gradient(to_right_bottom,#fbbf24,#fef3c7)] mb-8 py-8 px-6 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Manage Your Deliveries
          </h2>
          <p className="text-gray-700 max-w-md">
            Track and manage deliveries for your auction items. Keep your buyers
            updated with accurate delivery information.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Truck size={64} className="text-gray-800" />
        </div>
      </div>
    </div>
  );
};

// Seller Delivery Page Component
const SellerDeliveryPage = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<number | null>(
    null,
  );
  const [newDate, setNewDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null,
  );

  // Filter deliveries based on active tab
  const filteredDeliveries = deliveries.filter((delivery) => {
    if (activeTab === 'all') return true;
    return delivery.status === activeTab;
  });

  // Update delivery status
  const updateStatus = (id: number, newStatus: Delivery['status']) => {
    setIsLoading(true);
    // Simulate API call with setTimeout
    setTimeout(() => {
      setDeliveries(
        deliveries.map((delivery) =>
          delivery.id === id ? { ...delivery, status: newStatus } : delivery,
        ),
      );
      setIsLoading(false);
    }, 800);
  };

  // Update delivery date
  const updateDeliveryDate = (id: number, newDate: string) => {
    if (!newDate || !isValidDate(newDate)) return;

    setIsLoading(true);
    // Simulate API call with setTimeout
    setTimeout(() => {
      setDeliveries(
        deliveries.map((delivery) =>
          delivery.id === id
            ? { ...delivery, deliveryDate: newDate }
            : delivery,
        ),
      );
      setIsDatePickerOpen(false);
      setSelectedDeliveryId(null);
      setNewDate('');
      setIsLoading(false);
    }, 800);
  };

  // Validate date format
  const isValidDate = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  // Open date picker dialog
  const openDatePicker = (id: number, currentDate: string) => {
    setSelectedDeliveryId(id);
    setNewDate(currentDate);
    setIsDatePickerOpen(true);
  };

  // Open delivery details
  const viewDeliveryDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Delivery Management</h1>
          <p className="text-gray-500">
            Track and manage your auction deliveries to buyers
          </p>
        </header>

        <DeliveryHeroBanner />

        {/* Loading indicator */}
        {isLoading && (
          <div className="fixed top-4 right-4 bg-white shadow-md rounded-md p-3 flex items-center z-50">
            <Loader2 className="animate-spin mr-2 text-amber-500" size={20} />
            <span>Processing...</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card
            className={`p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${activeTab === 'all' ? 'border-2 border-amber-300' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <Box className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <div className="text-3xl font-bold">{deliveries.length}</div>
                <div className="text-sm text-gray-500">All Deliveries</div>
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
                value="packing"
                className="data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900"
              >
                Packing
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900"
              >
                Shipping
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
            <Button className="bg-amber-300 hover:bg-amber-400 text-gray-900 flex items-center">
              <Plus className="mr-1 h-4 w-4" />
              New Delivery
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
            <Button className="mt-6 bg-amber-300 hover:bg-amber-400 text-gray-900">
              <Plus className="mr-2 h-4 w-4" />
              Create New Delivery
            </Button>
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
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
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
                          getItemIcon(delivery.category)
                        )}
                      </div>

                      <div className="flex flex-col justify-between">
                        <div>
                          <h2 className="font-semibold text-lg text-gray-800">
                            {delivery.auctionName}
                          </h2>
                          <div className="flex flex-col sm:flex-row sm:gap-4">
                            <div className="text-gray-500 text-sm flex items-center mt-1">
                              <User className="w-3 h-3 mr-1" />
                              Buyer: {delivery.buyerName}
                            </div>
                            <div className="text-gray-500 text-sm flex items-center mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {delivery.buyerLocation}
                            </div>
                          </div>
                          {delivery.price && (
                            <div className="text-amber-600 text-sm font-semibold flex items-center mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              Created:{' '}
                              {new Date(
                                delivery.createdOn,
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        <Badge
                          className={`w-fit flex items-center ${statusInfo.color} border mt-2 sm:mt-0`}
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
                          <Calendar className="w-3 h-3 mr-1" />
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
                        onClick={() => viewDeliveryDetails(delivery)}
                      >
                        View Details
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Warning for overdue deliveries */}
                  {daysInfo.isOverdue && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center text-sm">
                      <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                      This delivery is overdue. Please update the status or
                      change the delivery date.
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                    <Button
                      onClick={() => updateStatus(delivery.id, 'packing')}
                      disabled={delivery.status === 'packing' || isLoading}
                      className={`flex items-center ${
                        delivery.status === 'packing'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed hover:bg-gray-100'
                          : 'bg-amber-300 hover:bg-amber-400 text-gray-900'
                      }`}
                      size="sm"
                    >
                      <Package className="mr-1.5" size={16} />
                      Mark as Packing
                    </Button>

                    <Button
                      onClick={() => updateStatus(delivery.id, 'shipping')}
                      disabled={delivery.status === 'shipping' || isLoading}
                      className={`flex items-center ${
                        delivery.status === 'shipping'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed hover:bg-gray-100'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                      size="sm"
                    >
                      <Truck className="mr-1.5" size={16} />
                      Mark as Shipping
                    </Button>

                    <Button
                      onClick={() => updateStatus(delivery.id, 'delivered')}
                      disabled={delivery.status === 'delivered' || isLoading}
                      className={`flex items-center ${
                        delivery.status === 'delivered'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed hover:bg-gray-100'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                      size="sm"
                    >
                      <Check className="mr-1.5" size={16} />
                      Mark as Delivered
                    </Button>

                    <Button
                      onClick={() =>
                        openDatePicker(delivery.id, delivery.deliveryDate)
                      }
                      disabled={isLoading}
                      className="flex items-center border-amber-300 text-amber-600 hover:bg-amber-50 ml-auto"
                      variant="outline"
                      size="sm"
                    >
                      <Calendar className="mr-1.5" size={16} />
                      Change Date
                    </Button>
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
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-amber-300 text-amber-600"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Date picker dialog */}
      <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Delivery Date</DialogTitle>
            <DialogDescription>
              Choose a new delivery date for this order.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Delivery Date
            </label>
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full"
            />
            {newDate && !isValidDate(newDate) && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                Please enter a valid date format (YYYY-MM-DD)
              </p>
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setIsDatePickerOpen(false);
                setSelectedDeliveryId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                selectedDeliveryId &&
                updateDeliveryDate(selectedDeliveryId, newDate)
              }
              disabled={!newDate || !isValidDate(newDate) || isLoading}
              className={`bg-amber-300 hover:bg-amber-400 text-gray-900 ${
                !newDate || !isValidDate(newDate) || isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Date'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delivery Details Dialog */}
      {selectedDelivery && (
        <Dialog
          open={!!selectedDelivery}
          onOpenChange={(open) => !open && setSelectedDelivery(null)}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Delivery Details</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {selectedDelivery.image ? (
                    <img
                      src={selectedDelivery.image}
                      alt={selectedDelivery.auctionName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    getItemIcon(selectedDelivery.category)
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedDelivery.auctionName}
                  </h3>
                  {selectedDelivery.category && (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 mt-1">
                      {selectedDelivery.category}
                    </Badge>
                  )}
                  {selectedDelivery.price && (
                    <p className="mt-1 font-medium">
                      {formatCurrency(selectedDelivery.price)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Buyer Information
                  </h4>
                  <p className="font-medium">{selectedDelivery.buyerName}</p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedDelivery.buyerLocation}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <CalendarClock className="w-4 h-4 mr-1" />
                    Delivery Timeline
                  </h4>
                  <p className="font-medium">
                    {new Date(selectedDelivery.deliveryDate).toLocaleDateString(
                      undefined,
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      },
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {
                      getDaysInfo(
                        selectedDelivery.deliveryDate,
                        selectedDelivery.status,
                      ).text
                    }
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 p-3 rounded-md">
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  Status Information
                </h4>
                <div className="flex items-center">
                  <Badge
                    className={`${getStatusInfo(selectedDelivery.status).color} border`}
                  >
                    {getStatusInfo(selectedDelivery.status).icon}
                    {getStatusInfo(selectedDelivery.status).text}
                  </Badge>
                  <span className="text-sm text-gray-500 ml-2">
                    Last updated: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              {getDaysInfo(
                selectedDelivery.deliveryDate,
                selectedDelivery.status,
              ).isOverdue && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center text-sm">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  This delivery is overdue. Please update the status or change
                  the delivery date.
                </div>
              )}
            </div>
            <DialogFooter>
              <div className="flex flex-wrap gap-2 w-full justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-300 text-amber-600 hover:bg-amber-50"
                  onClick={() => setSelectedDelivery(null)}
                >
                  Close
                </Button>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-amber-300 hover:bg-amber-400 text-gray-900 flex items-center"
                  >
                    <MessageCircle className="mr-1.5" size={16} />
                    Contact Buyer
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      openDatePicker(
                        selectedDelivery.id,
                        selectedDelivery.deliveryDate,
                      )
                    }
                    className="border-amber-300 text-amber-600 hover:bg-amber-50 flex items-center"
                    variant="outline"
                  >
                    <Calendar className="mr-1.5" size={16} />
                    Update Date
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SellerDeliveryPage;
