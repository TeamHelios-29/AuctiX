export const NOTIFICATION_CHANNEL_LABELS = {
  EMAIL: 'Email Notifications',
  PUSH: 'Push Notifications',
} as const;

export type NotificationChannelLabel = keyof typeof NOTIFICATION_CHANNEL_LABELS;

export const NOTIFICATION_CATEGORY_GROUP_LABELS = {
  PROMO: 'Promotional',
  AUCTION: 'Auction',
  DEFAULT: 'General',
} as const;

export type NotificationGroupCategoryLabel =
  keyof typeof NOTIFICATION_CATEGORY_GROUP_LABELS;

export interface NotificationSettingsResponse {
  global: {
    [channelType: string]: {
      enabled: boolean;
      title: string;
      description: string;
      uiicon: string;
    };
  };
  events: {
    [category: string]: {
      [eventKey: string]: {
        title: string;
        description: string;
        categoryGroup: string;
        channelTypes: {
          [channelType: string]: boolean;
        };
      };
    };
  };
}

export interface NotificationSettingsUpdateRequest {
  global: {
    [channelType: string]: boolean;
  };
  events: {
    [eventKey: string]: {
      [channelType: string]: boolean;
    };
  };
}

export interface GlobalChannelSetting {
  enabled: boolean;
  title: string;
  description: string;
  uiicon: string;
}

export interface GlobalSettings {
  [key: string]: GlobalChannelSetting;
}

export interface ChannelTypes {
  [channelType: string]: boolean;
}

export interface EventData {
  title: string;
  description: string;
  categoryGroup: string;
  channelTypes: ChannelTypes;
}

export interface EventCategory {
  [eventType: string]: EventData;
}

export interface EventCategories {
  [categoryGroup: string]: EventCategory;
}

export interface NotificationPreferences {
  global: GlobalSettings;
  events: EventCategories;
}

// Types for saving notification preferences
export interface SaveEventCategories {
  [categoryGroup: string]: {
    [channelType: string]: boolean;
  };
}

export interface SaveNotificationPreferences {
  global: {
    [channelType: string]: boolean;
  };
  events: SaveEventCategories;
}
