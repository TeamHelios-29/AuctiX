import { Switch } from '@/components/ui/switch';
import {
  NOTIFICATION_CHANNEL_LABELS,
  NotificationChannelLabel,
} from '@/types/notification';

interface NotificationCategorySectionProps {
  eventData: {
    title: string;
    description: string;
    categoryGroup: string;
    channelTypes: {
      [channelType: string]: boolean;
    };
  };
  globalData: {
    [channelType: string]: {
      enabled: boolean;
      title: string;
      description: string;
      uiicon: string;
    };
  };
  onToggle: (channelType: string, enabled: boolean) => void;
}

const getChannelLabel = (channelType: string) => {
  if (channelType in NOTIFICATION_CHANNEL_LABELS) {
    return NOTIFICATION_CHANNEL_LABELS[channelType as NotificationChannelLabel];
  }
  return `${channelType} Notifications`;
};

export default function NotificationCategorySection({
  eventData,
  globalData,
  onToggle,
}: NotificationCategorySectionProps) {
  const channelTypes = Object.keys(eventData.channelTypes);

  const getChannelMeta = (channelType: string, index: number) => {
    const isChannelGloballyEnabled = globalData[channelType].enabled;
    const checked = eventData.channelTypes[channelType];
    const label = getChannelLabel(channelType);
    const showRightBorder = index % 2 === 0 && index < channelTypes.length - 1;

    return { label, isChannelGloballyEnabled, checked, showRightBorder };
  };

  return (
    <div className="mb-6 rounded-lg border">
      <div className="border-b p-4">
        <h3 className="text-lg font-medium">{eventData.title}</h3>
        {eventData.description && (
          <p className="text-sm text-gray-500">{eventData.description}</p>
        )}
      </div>

      <div className="flex flex-wrap">
        {channelTypes.map((channelType, index) => {
          const { label, isChannelGloballyEnabled, checked, showRightBorder } =
            getChannelMeta(channelType, index);

          return (
            <div
              key={channelType}
              className={`flex w-1/2 items-center justify-between p-4 ${
                showRightBorder ? 'border-r' : ''
              }`}
            >
              <span className="text-sm">{label}</span>
              {!isChannelGloballyEnabled && (
                <p className="mt-1 text-xs text-gray-500 italic">
                  Globally disabled
                </p>
              )}
              <Switch
                checked={checked}
                onCheckedChange={(checked) => onToggle(channelType, checked)}
                disabled={!isChannelGloballyEnabled}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
