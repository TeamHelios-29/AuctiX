import type {
  NotificationFetchParams,
  NotificationPaginatedResponse,
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

export async function fetchNotifications(
  params: NotificationFetchParams,
  axiosInstance: AxiosInstance,
): Promise<NotificationPaginatedResponse> {
  const {
    page = 0,
    size = 10,
    readStatus = 'all',
    categoryGroup = 'all',
  } = params;

  const response = await axiosInstance.get<NotificationPaginatedResponse>(
    '/notification/',
    {
      params: { page, size, readStatus, categoryGroup },
    },
  );

  return response.data;
}

export async function fetchCategoryGroups(
  axiosInstance: AxiosInstance,
): Promise<string[]> {
  const response = await axiosInstance.get<string[]>(
    '/notification/category-groups',
  );
  return response.data;
}

export async function markNotificationRead(
  id: string,
  axiosInstance: AxiosInstance,
): Promise<void> {
  await axiosInstance.post(`/notification/${id}/read`);
}

export async function markNotificationUnread(
  id: string,
  axiosInstance: AxiosInstance,
): Promise<void> {
  await axiosInstance.post(`/notification/${id}/unread`);
}

export async function deleteNotification(
  id: string,
  axiosInstance: AxiosInstance,
): Promise<void> {
  await axiosInstance.delete(`/notification/${id}`);
}

export async function markAllNotificationsRead(
  axiosInstance: AxiosInstance,
): Promise<void> {
  await axiosInstance.post('/notification/mark-all-read');
}
