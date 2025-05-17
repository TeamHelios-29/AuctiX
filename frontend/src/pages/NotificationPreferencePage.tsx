'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalNotificationSettingsSection from '@/components/organisms/GlobalNotificationSettingsSection';
import NotificationSettingsCategorySection from '@/components/organisms/NotificationSettingsCategorySection';
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  extractEditableSettings,
} from '@/services/NotificationService';
import {
  type NotificationSettingsResponse,
  type NotificationSettingsUpdateRequest,
  type NotificationGroupCategoryLabel,
  NOTIFICATION_CATEGORY_GROUP_LABELS,
} from '@/types/notification';
import AxiosRequest from '@/services/axiosInspector';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] =
    useState<NotificationSettingsResponse | null>(null);
  const [editableSettings, setEditableSettings] =
    useState<NotificationSettingsUpdateRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const axiosInstance = AxiosRequest().axiosInstance;
  const { toast } = useToast();

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const data = await getNotificationPreferences(axiosInstance);
        setPreferences(data);
        setEditableSettings(extractEditableSettings(data));
      } catch (error: unknown) {
        console.error('Failed to fetch notification preferences:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to fetch notification preferences!',
          description:
            error instanceof Error
              ? error.message
              : 'An error occurred when fetching notification preferences.',
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
    // No need to add axiosInstance to the dependancy array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGlobalToggle = (channelType: string, enabled: boolean) => {
    if (!preferences || !editableSettings) return;

    // Update the UI state for preferences
    setPreferences({
      ...preferences,
      global: {
        ...preferences.global,
        [channelType]: {
          ...preferences.global[channelType],
          enabled,
        },
      },
    });

    // Update the editable settings that will be sent to the API
    setEditableSettings({
      ...editableSettings,
      global: {
        ...editableSettings.global,
        [channelType]: enabled,
      },
    });
  };

  const handleEventToggle = (
    categoryGroup: string,
    eventType: string,
    channelType: string,
    enabled: boolean,
  ) => {
    if (!preferences || !editableSettings) return;

    // Update the UI state for preferences
    setPreferences({
      ...preferences,
      events: {
        ...preferences.events,
        [categoryGroup]: {
          ...preferences.events[categoryGroup],
          [eventType]: {
            ...preferences.events[categoryGroup][eventType],
            channelTypes: {
              ...preferences.events[categoryGroup][eventType].channelTypes,
              [channelType]: enabled,
            },
          },
        },
      },
    });

    // Update the editable settings that will be sent to the API
    setEditableSettings({
      ...editableSettings,
      events: {
        ...editableSettings.events,
        [eventType]: {
          ...editableSettings.events[eventType],
          [channelType]: enabled,
        },
      },
    });
  };

  const handleSave = async () => {
    if (!editableSettings) return;

    try {
      setSaving(true);
      await saveNotificationPreferences(editableSettings, axiosInstance);
      toast({
        title: 'Notification Preferences Saved!',
        description: 'Your notification preferences saved successfully.',
      });
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to save notification preferences!',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred when saving notification preferences.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setSaving(false);
    }
  };

  const renderEventsForCategory = (categoryGroup: string) => {
    if (!preferences || !preferences.events[categoryGroup]) {
      return;
    }

    return Object.keys(preferences.events[categoryGroup]).map((eventType) => (
      <NotificationSettingsCategorySection
        key={`${categoryGroup}-${eventType}`}
        eventData={preferences.events[categoryGroup][eventType]}
        globalData={preferences.global}
        onToggle={(channel, enabled) =>
          handleEventToggle(categoryGroup, eventType, channel, enabled)
        }
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // Get unique category groups for tabs
  const categoryGroups = preferences ? Object.keys(preferences.events) : [];

  const getCategoryDisplayName = (category: string) => {
    if (category in NOTIFICATION_CATEGORY_GROUP_LABELS) {
      return NOTIFICATION_CATEGORY_GROUP_LABELS[
        category as NotificationGroupCategoryLabel
      ];
    }
    return category;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="mx-auto max-w-4xl bg-white">
        <div className="flex items-center justify-between border-b p-6">
          <h1 className="text-2xl font-bold">Notification Preferences</h1>
          <Button
            className="bg-gray-900 text-white hover:bg-gray-800"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="p-6">
          <h2 className="mb-1 text-xl font-semibold">Global Settings</h2>
          <p className="mb-3">
            This controls enabling or disabling notifications globally for all
            methods of delivery
          </p>

          {preferences ? (
            <GlobalNotificationSettingsSection
              globalSettings={preferences.global || {}}
              onToggle={handleGlobalToggle}
            />
          ) : (
            <p className="text-center text-gray-500">
              Failed to load notification preferecnes
            </p>
          )}

          <div className="mb-4 mt-8">
            <h2 className="mb-1 text-xl font-semibold">
              Notification for Event Types
            </h2>
            <p className="mb-3">
              Use these settings to choose which specific event types you want
              to receive notifications from
            </p>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                {categoryGroups.map((group) => (
                  <TabsTrigger key={group} value={group}>
                    {getCategoryDisplayName(group)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {preferences ? (
                <>
                  <TabsContent value="all" className="mt-4">
                    {categoryGroups.map((categoryGroup) => (
                      <div key={categoryGroup}>
                        {renderEventsForCategory(categoryGroup)}
                      </div>
                    ))}
                  </TabsContent>

                  {categoryGroups.map((categoryGroup) => (
                    <TabsContent
                      key={categoryGroup}
                      value={categoryGroup}
                      className="mt-4"
                    >
                      {renderEventsForCategory(categoryGroup)}
                    </TabsContent>
                  ))}
                </>
              ) : (
                <p className="text-center mt-3 text-gray-500">
                  Failed to load notification preferecnes
                </p>
              )}
            </Tabs>
          </div>
        </div>
      </Card>
    </div>
  );
}
