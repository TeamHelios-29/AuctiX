import { useState } from 'react';
import { Notification } from '@/types/notification';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};

const getCategoryStyle = (categoryGroup: string): string => {
  switch (categoryGroup) {
    case 'PROMO':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    case 'SYSTEM':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'AUCTION':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'TRANSACTION':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

export const NotificationCard = ({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
}: NotificationCardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleMarkAsRead = async () => {
    setIsLoading(true);
    try {
      await onMarkAsRead(notification.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsUnread = async () => {
    setIsLoading(true);
    try {
      await onMarkAsUnread(notification.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(notification.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={`transition-all duration-200 ${!notification.read ? 'border-l-4 border-l-brandGoldYellow' : ''}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center text-lg">
              {notification.title}
              {!notification.read && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-brandGoldYellow text-gray-800 hover:bg-brandGoldYellow/80"
                >
                  New
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Badge
                className={getCategoryStyle(
                  notification.notificationCategoryGroup,
                )}
              >
                {notification.notificationCategory.replace(
                  ' Notifications',
                  '',
                )}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(notification.createdAt)}
              </span>
            </CardDescription>
          </div>
          <div className="flex justify-end gap-2 pt-0">
            {!notification.read ? (
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                onClick={handleMarkAsRead}
                className="text-sm"
              >
                <Eye className="mr-1 h-4 w-4" />
                Mark as read
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                onClick={handleMarkAsUnread}
                className="text-sm"
              >
                <EyeOff className="mr-1 h-4 w-4" />
                Mark as unread
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={handleDelete}
              className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p
          className={
            notification.read ? 'text-muted-foreground' : 'text-foreground'
          }
        >
          {notification.content}
        </p>
      </CardContent>
    </Card>
  );
};
