import { Switch } from '@/components/ui/switch';
interface NotificationCategorySectionProps {
  eventData: {
    title: string;
    description: string;
    categoryGroup: string;
    channelTypes: {
      [channelType: string]: boolean;
    };
    editable: boolean;
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

export default function NotificationCategorySection({
  eventData,
  globalData,
  onToggle,
}: NotificationCategorySectionProps) {
  const channelTypes = Object.keys(eventData.channelTypes);

  const getChannelMeta = (channelType: string, index: number) => {
    const isChannelGloballyEnabled = globalData[channelType].enabled;
    const checked = eventData.channelTypes[channelType];
    const showRightBorder = index % 2 === 0 && index < channelTypes.length - 1;

    return { isChannelGloballyEnabled, checked, showRightBorder };
  };

  return (
    <div className="mb-6 mx-2 rounded-lg border">
      <div className="border-b p-4">
        <h3 className="text-lg font-medium">{eventData.title}</h3>
        {eventData.description && (
          <p className="text-sm text-gray-500">{eventData.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {channelTypes.map((channelType, index) => {
          const { isChannelGloballyEnabled, checked } = getChannelMeta(
            channelType,
            index,
          );

          const isEnabled = isChannelGloballyEnabled && eventData.editable;

          return (
            <div
              key={channelType}
              className="flex items-center justify-between p-4 border-b md:border-b-0 md:border-r last:border-r-0"
            >
              <div>
                <span className="text-sm">{globalData[channelType].title}</span>
                {/* {!isChannelGloballyEnabled && (
                  <p className="text-xs text-gray-500 italic">
                    Globally disabled
                  </p>
                )} */}
              </div>
              <div
                title={
                  !isChannelGloballyEnabled
                    ? 'This channel is disabled globally.'
                    : !eventData.editable
                      ? 'You don’t have permission to edit this.'
                      : ''
                }
              >
                <Switch
                  checked={checked}
                  onCheckedChange={(checked) => onToggle(channelType, checked)}
                  disabled={!isEnabled}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
