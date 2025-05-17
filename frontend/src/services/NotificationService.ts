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
    const channelStates: Record<string, boolean> = {};

    for (const eventKey in eventGroup) {
      const event = eventGroup[eventKey];
      for (const channelType in event.channelTypes) {
        if (!(channelType in channelStates)) {
          channelStates[channelType] = false;
        }

        if (event.channelTypes[channelType]) {
          channelStates[channelType] = true;
        }
      }
    }

    events[category] = channelStates;
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
