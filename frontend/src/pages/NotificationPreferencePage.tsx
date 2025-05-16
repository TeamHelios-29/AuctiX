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
import type {
  NotificationSettingsResponse,
  NotificationSettingsUpdateRequest,
} from '@/types/notification';

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] =
    useState<NotificationSettingsResponse | null>(null);
  const [editableSettings, setEditableSettings] =
    useState<NotificationSettingsUpdateRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const data = await getNotificationPreferences();
        setPreferences(data);
        setEditableSettings(extractEditableSettings(data));
      } catch (error) {
        console.error('Failed to fetch notification preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
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
        [categoryGroup]: {
          ...editableSettings.events[categoryGroup],
          [channelType]: enabled,
        },
      },
    });
  };

  const handleSave = async () => {
    if (!editableSettings) return;

    try {
      setSaving(true);
      await saveNotificationPreferences(editableSettings);
      // Show success message or handle success case
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!preferences || !editableSettings) {
    return (
      <div className="flex h-screen items-center justify-center">
        Failed to load preferences
      </div>
    );
  }

  // Get unique category groups for tabs
  const categoryGroups = Object.keys(preferences.events);

  // Map category group IDs to display names
  const getCategoryDisplayName = (categoryGroup: string) => {
    const displayNames: Record<string, string> = {
      PROMO: 'Promotional',
      AUCTION: 'Auction',
      DEFAULT: 'General',
    };
    return displayNames[categoryGroup] || categoryGroup;
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
          <h2 className="mb-4 text-xl font-semibold">Global Settings</h2>
          <GlobalNotificationSettingsSection
            globalSettings={preferences.global}
            onToggle={handleGlobalToggle}
          />

          <div className="mb-4 mt-8">
            <h2 className="mb-4 text-xl font-semibold">Notification Types</h2>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                {categoryGroups.map((group) => (
                  <TabsTrigger key={group} value={group}>
                    {getCategoryDisplayName(group)}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="mt-4">
                {categoryGroups.map((categoryGroup) => (
                  <div key={categoryGroup}>
                    {Object.keys(preferences.events[categoryGroup]).map(
                      (eventType) => (
                        <NotificationSettingsCategorySection
                          key={`${categoryGroup}-${eventType}`}
                          eventType={eventType}
                          eventData={
                            preferences.events[categoryGroup][eventType]
                          }
                          onToggle={(channel, enabled) =>
                            handleEventToggle(
                              categoryGroup,
                              eventType,
                              channel,
                              enabled,
                            )
                          }
                        />
                      ),
                    )}
                  </div>
                ))}
              </TabsContent>

              {categoryGroups.map((categoryGroup) => (
                <TabsContent
                  key={categoryGroup}
                  value={categoryGroup}
                  className="mt-4"
                >
                  {Object.keys(preferences.events[categoryGroup]).map(
                    (eventType) => (
                      <NotificationSettingsCategorySection
                        key={`${categoryGroup}-${eventType}`}
                        eventType={eventType}
                        eventData={preferences.events[categoryGroup][eventType]}
                        onToggle={(channel, enabled) =>
                          handleEventToggle(
                            categoryGroup,
                            eventType,
                            channel,
                            enabled,
                          )
                        }
                      />
                    ),
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </Card>
    </div>
  );
}
