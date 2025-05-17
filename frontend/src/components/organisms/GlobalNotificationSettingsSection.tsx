import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, AlertCircle } from 'lucide-react';

interface GlobalNotificationSettingsSectionProps {
  globalSettings: {
    [channelType: string]: {
      enabled: boolean;
      title: string;
      description: string;
      uiicon: string;
    };
  };
  onToggle: (channelType: string, enabled: boolean) => void;
}

export default function GlobalNotificationSettingsSection({
  globalSettings,
  onToggle,
}: GlobalNotificationSettingsSectionProps) {
  const getIcon = (iconType: string) => {
    switch (iconType.toLowerCase()) {
      case 'email':
        return <Mail className="h-5 w-5 text-gray-600" />;
      case 'bell':
        return <Bell className="h-5 w-5 text-gray-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Card className="mb-8">
      {Object.entries(globalSettings).map(([channelType, setting], index) => (
        <div
          key={channelType}
          className={`flex items-center justify-between p-4 ${index !== 0 ? 'border-t' : ''}`}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              {getIcon(setting.uiicon)}
            </div>
            <div>
              <h3 className="font-medium">{setting.title}</h3>
              <p className="text-sm text-gray-500">{setting.description}</p>
            </div>
          </div>
          <Switch
            checked={setting.enabled}
            onCheckedChange={(checked) => onToggle(channelType, checked)}
          />
        </div>
      ))}
    </Card>
  );
}
