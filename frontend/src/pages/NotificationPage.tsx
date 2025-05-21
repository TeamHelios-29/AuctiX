import React, { useEffect, useMemo, useCallback } from 'react';
import {
  selectNotifications,
  fetchNotifications,
  markNotificationRead,
  markNotificationUnread,
  removeNotification,
  markAllNotificationsRead,
  selectCurrentPage,
  selectTotalPages,
  selectNotificationLoading,
  selectUnreadCount,
  fetchUnreadCount,
} from '@/store/slices/notificationSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { NotificationCard } from '@/components/molecules/NotificationCard';
import {
  Bell,
  Filter,
  RefreshCw,
  CheckCircle,
  Loader2,
  Settings,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Link } from 'react-router-dom';

const NotificationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages) || 1;
  const isLoading = useAppSelector(selectNotificationLoading);
  const unreadCount = useAppSelector(selectUnreadCount);

  const [filter, setFilter] = React.useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [refreshing, setRefreshing] = React.useState(false);
  const [markAllSuccess, setMarkAllSuccess] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(10);

  const categoryGroups = useMemo(
    () => [
      'all',
      ...new Set(notifications.map((n) => n.notificationCategoryGroup)),
    ],
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (
        categoryFilter !== 'all' &&
        notification.notificationCategoryGroup !== categoryFilter
      ) {
        return false;
      }
      if (filter === 'unread' && notification.read) return false;
      if (filter === 'read' && !notification.read) return false;
      return true;
    });
  }, [notifications, categoryFilter, filter]);

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(
        fetchNotifications({
          page: currentPage - 1,
          size: pageSize,
          onlyUnread: filter === 'unread',
        }),
      ),
      dispatch(fetchUnreadCount()),
    ]);
    setRefreshing(false);
  }, [dispatch, currentPage, pageSize, filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        dispatch(
          fetchNotifications({
            page: newPage - 1,
            size: pageSize,
            onlyUnread: filter === 'unread',
          }),
        );
      }
    },
    [dispatch, totalPages, pageSize, filter],
  );

  const handleMarkAsRead = useCallback(
    (id: string) => {
      dispatch(markNotificationRead(id)).then(() =>
        dispatch(fetchUnreadCount()),
      );
    },
    [dispatch],
  );

  const handleMarkAsUnread = useCallback(
    (id: string) => {
      dispatch(markNotificationUnread(id)).then(() =>
        dispatch(fetchUnreadCount()),
      );
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(removeNotification(id)).then(() => {
        dispatch(fetchUnreadCount());
        if (notifications.length === 1 && currentPage > 1) {
          dispatch(
            fetchNotifications({
              page: currentPage - 2,
              size: pageSize,
              onlyUnread: filter === 'unread',
            }),
          );
        } else if (notifications.length > 1) {
          dispatch(
            fetchNotifications({
              page: currentPage - 1,
              size: pageSize,
              onlyUnread: filter === 'unread',
            }),
          );
        }
      });
    },
    [dispatch, notifications.length, currentPage, pageSize, filter],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    setRefreshing(true);
    await dispatch(markAllNotificationsRead());
    await dispatch(fetchUnreadCount());
    setRefreshing(false);
    setMarkAllSuccess(true);
    setTimeout(() => setMarkAllSuccess(false), 3000);
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const handleFilterChange = useCallback(
    (newFilter: 'all' | 'unread' | 'read') => {
      setFilter(newFilter);
      if (currentPage !== 1) {
        dispatch(
          fetchNotifications({
            page: 0,
            size: pageSize,
            onlyUnread: newFilter === 'unread',
          }),
        );
      }
    },
    [dispatch, currentPage, pageSize],
  );

  const handleCategoryFilterChange = useCallback(
    (newCategory: string) => {
      setCategoryFilter(newCategory);
      if (currentPage !== 1) {
        dispatch(
          fetchNotifications({
            page: 0,
            size: pageSize,
            onlyUnread: filter === 'unread',
          }),
        );
      }
    },
    [dispatch, currentPage, pageSize, filter],
  );

  const handlePageSizeChange = useCallback(
    (newSize: string) => {
      const size = parseInt(newSize);
      setPageSize(size);
      dispatch(
        fetchNotifications({
          page: 0,
          size,
          onlyUnread: filter === 'unread',
        }),
      );
    },
    [dispatch, filter],
  );

  const renderPaginationItems = useCallback(() => {
    const items: JSX.Element[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = totalPages > 5 && currentPage < totalPages - 2;

    items.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );

    if (showEllipsisStart) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === totalPages) continue;
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (showEllipsisEnd) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  }, [currentPage, totalPages, handlePageChange]);

  return (
    <div className="py-6 max-w-6xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-7 w-7 text-brandGoldYellow" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-brandGoldYellow hover:bg-brandGoldYellow/80 text-gray-900 ml-2">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-gray-500 mt-1">
            Stay updated with your latest alerts and information
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing || isLoading}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>

          {unreadCount > 0 && (
            <Button
              variant="default"
              className="bg-brandGoldYellow text-gray-800 hover:bg-brandGoldYellow/80"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={refreshing || isLoading || markAllSuccess}
            >
              {markAllSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marked all as read
                </>
              ) : (
                'Mark all as read'
              )}
            </Button>
          )}
          <Link to="/notifications/preferences">
            <Button
              variant="outline"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <Tabs
            value={filter}
            className="w-full"
            onValueChange={(value) =>
              handleFilterChange(value as 'all' | 'unread' | 'read')
            }
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread
                  {unreadCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-brandGoldYellow/70 text-gray-900 hover:bg-brandGoldYellow/60"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="read">Read</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-gray-500" />
                  <Select
                    value={categoryFilter}
                    onValueChange={handleCategoryFilterChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categoryGroups
                        .filter((g) => g !== 'all')
                        .map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() +
                              category.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-500">Show:</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={handlePageSizeChange}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Tabs>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-end mt-4 gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">
                No notifications found
              </h3>
              <p className="text-gray-500 mt-2">
                {filter === 'all' && categoryFilter === 'all'
                  ? "You don't have any notifications yet."
                  : 'No notifications match your current filters.'}
              </p>
              {(filter !== 'all' || categoryFilter !== 'all') && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    handleFilterChange('all');
                    handleCategoryFilterChange('all');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAsUnread={handleMarkAsUnread}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {!isLoading && filteredNotifications.length > 0 && (
          <div className="border-t p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={
                          currentPage === totalPages
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
