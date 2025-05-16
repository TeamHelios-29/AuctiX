import { Switch } from '@/components/ui/switch';

interface NotificationCategorySectionProps {
  eventType: string;
  eventData: {
    title: string;
    description: string;
    categoryGroup: string;
    channelTypes: {
      [channelType: string]: boolean;
    };
  };
  onToggle: (channelType: string, enabled: boolean) => void;
}

export default function NotificationCategorySection({
  eventType,
  eventData,
  onToggle,
}: NotificationCategorySectionProps) {
  // Get all available channel types from the event data
  const channelTypes = Object.keys(eventData.channelTypes);

  return (
    <div className="mb-6 rounded-lg border">
      <div className="border-b p-4">
        <h3 className="text-lg font-medium">{eventData.title}</h3>
        {eventData.description && (
          <p className="text-sm text-gray-500">{eventData.description}</p>
        )}
      </div>

      <div className="flex flex-wrap">
        {channelTypes.map((channelType, index) => (
          <div
            key={channelType}
            className={`flex w-1/2 items-center justify-between p-4 ${
              index % 2 === 0 && index < channelTypes.length - 1
                ? 'border-r'
                : ''
            }`}
          >
            <span className="text-sm">
              {channelType === 'EMAIL'
                ? 'Email Notifications'
                : channelType === 'PUSH'
                  ? 'Push Notifications'
                  : `${channelType} Notifications`}
            </span>
            <Switch
              checked={eventData.channelTypes[channelType]}
              onCheckedChange={(checked) => onToggle(channelType, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
