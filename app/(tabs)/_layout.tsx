import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Text } from '@/components/ui/text';
import { HomeIcon, RssIcon, UserIcon } from 'lucide-react-native';
import { useUniwind } from 'uniwind';
import { useTranslation } from 'react-i18next';

const colors = {
    blue: '#3b82f6',
    black: '#000000',
    white: '#ffffff',
    gray: '#9ca3af',
};

export default function TabsLayout() {
    const { theme } = useUniwind();
    const currentTheme = theme ?? 'light';
    const { t } = useTranslation();

    const activeColor = colors.blue;
    const inactiveColor = currentTheme === 'dark' ? colors.gray : colors.black;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: Platform.OS === 'ios' ? 88 : 70,
                    backgroundColor: currentTheme === 'dark' ? '#000000' : 'white',
                    borderTopWidth: currentTheme === 'dark' ? 0.5 : 1,
                    borderTopColor: currentTheme === 'dark' ? '#27272a' : '#e5e7eb',
                    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
                    paddingTop: 12,
                    elevation: 0,
                    shadowOpacity: 0,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('tabs.home'),
                    tabBarButton: ({ onPress, accessibilityState }) => (
                        <TouchableOpacity
                            onPress={onPress}
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                            activeOpacity={0.7}
                        >
                            <HomeIcon size={24} color={accessibilityState?.selected ? activeColor : inactiveColor} />
                            <Text
                                style={{
                                    fontSize: 12,
                                    marginTop: 4,
                                    color: accessibilityState?.selected ? activeColor : inactiveColor
                                }}
                            >
                                {t('tabs.home')}
                            </Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tabs.Screen
                name="feed"
                options={{
                    title: t('tabs.feed'),
                    tabBarButton: ({ onPress, accessibilityState }) => (
                        <TouchableOpacity
                            onPress={onPress}
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                            activeOpacity={0.7}
                        >
                            <RssIcon size={24} color={accessibilityState?.selected ? activeColor : inactiveColor} />
                            <Text
                                style={{
                                    fontSize: 12,
                                    marginTop: 4,
                                    color: accessibilityState?.selected ? activeColor : inactiveColor
                                }}
                            >
                                {t('tabs.feed')}
                            </Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: t('tabs.profile'),
                    tabBarButton: ({ onPress, accessibilityState }) => (
                        <TouchableOpacity
                            onPress={onPress}
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                            activeOpacity={0.7}
                        >
                            <UserIcon size={24} color={accessibilityState?.selected ? activeColor : inactiveColor} />
                            <Text
                                style={{
                                    fontSize: 12,
                                    marginTop: 4,
                                    color: accessibilityState?.selected ? activeColor : inactiveColor
                                }}
                            >
                                {t('tabs.profile')}
                            </Text>
                        </TouchableOpacity>
                    ),
                }}
            />
        </Tabs>
    );
}
