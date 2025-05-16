import type {
  NotificationSettingsResponse,
  NotificationSettingsUpdateRequest,
} from '@/types/notification';

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

export async function getNotificationPreferences(): Promise<NotificationSettingsResponse> {
  // mock until we fix the the axios instance

  return {
    global: {
      EMAIL: {
        enabled: false,
        title: 'Email Notifications',
        description: 'Receive notifications via email',
        uiicon: 'email',
      },
      PUSH: {
        enabled: false,
        title: 'Push Notifications',
        description:
          'Receive notifications on web or device when the browser is open',
        uiicon: 'bell',
      },
    },
    events: {
      PROMO: {
        PROMO: {
          title: 'Promotional Notifications',
          description: 'Marketing notifications about promotions, discounts',
          categoryGroup: 'PROMO',
          channelTypes: {
            EMAIL: false,
            PUSH: false,
          },
        },
        PROMO_NEW: {
          title: 'Promotional Notifications',
          description: 'Marketing notifications about promotions, discounts',
          categoryGroup: 'PROMO',
          channelTypes: {
            EMAIL: false,
            PUSH: false,
          },
        },
      },
      AUCTION: {
        AUCTION_START_SOON: {
          title: 'Auction Start soon',
          description: 'Get notified 10 minutes before auction starts',
          categoryGroup: 'AUCTION',
          channelTypes: {
            EMAIL: false,
            PUSH: false,
          },
        },
      },
      DEFAULT: {
        DEFAULT: {
          title: 'Default Notifications',
          description: 'All other notifications',
          categoryGroup: 'DEFAULT',
          channelTypes: {
            EMAIL: false,
            PUSH: false,
          },
        },
      },
    },
  };
}

export async function saveNotificationPreferences(
  data: NotificationSettingsUpdateRequest,
): Promise<void> {}
