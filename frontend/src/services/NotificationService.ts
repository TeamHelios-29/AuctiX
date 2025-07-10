import type {
  NotificationSettingsResponse,
  NotificationSettingsUpdateRequest,
} from '@/types/notification';
import { AxiosInstance } from 'axios';

export function extractEditableSettings(
  response: NotificationSettingsResponse,
): NotificationSettingsUpdateRequest {
  const global: Record<string, boolean> = {};
  const events: Record<string, Record<string, boolean>> = {};

  for (const channelType in response.global) {
    global[channelType] = response.global[channelType].enabled;
  }

  for (const category in response.events) {
    const eventGroup = response.events[category];

    for (const eventKey in eventGroup) {
      const event = eventGroup[eventKey];
      const eventChannelTypePreferences: Record<string, boolean> =
        event.channelTypes;

      events[eventKey] = eventChannelTypePreferences;
    }
  }
  return { global, events };
}

export async function getNotificationPreferences(
  axiosInstance: AxiosInstance,
): Promise<NotificationSettingsResponse> {
  return axiosInstance
    .get('/notification/settings/preferences')
    .then((response) => {
      return response.data;
    })
    .catch((e: Error) => {
      throw e;
    });
}

export async function saveNotificationPreferences(
  data: NotificationSettingsUpdateRequest,
  axiosInstance: AxiosInstance,
): Promise<void> {
  await axiosInstance.post('/notification/settings/preferences', data);
}

// todo after fixing the AxiosInstance bug use the service

// export async function getNotifications(
// ): Promise<Notification[]> {
//   const baseURL = import.meta.env.VITE_API_URL

//   const response = await axios.get(`${baseURL}/notification`, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${authUser?.token}`,
//     },
//   });
//   console.log("Getting notificaiotns: " + response.data)
//   return response.data;
// }

// export async function markAsRead(
//   id: string,
//   axiosInstance: AxiosInstance,
// ): Promise<void> {
//   await axiosInstance.patch(`/notification/${id}/read`, { read: true });
// }

// export async function markAsUnread(
//   id: string,
//   axiosInstance: AxiosInstance,
// ): Promise<void> {
//   await axiosInstance.patch(`/notification/${id}/read`, { read: false });
// }

// export async function deleteNotification(
//   id: string,
//   axiosInstance: AxiosInstance,
// ): Promise<void> {
//   await axiosInstance.delete(`/notification/${id}`);
// }

// export async function markAllAsRead(
//   axiosInstance: AxiosInstance,
// ): Promise<void> {
//   await axiosInstance.patch('/notification/mark-all-read');
// }

// export function getNotificationCategories(
//   notifications: Notification[],
// ): string[] {
//   const categories = new Set<string>();
//   notifications.forEach((notification) => {
//     categories.add(notification.notificationCategory);
//   });
//   return Array.from(categories);
// }

// export function getNotificationCategoryGroups(
//   notifications: Notification[],
// ): string[] {
//   const categoryGroups = new Set<string>();
//   notifications.forEach((notification) => {
//     categoryGroups.add(notification.notificationCategoryGroup);
//   });
//   return Array.from(categoryGroups);
// }
