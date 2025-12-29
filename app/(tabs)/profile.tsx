import React from 'react';
import { View, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { LanguageDropdown } from '@/components/language-dropdown';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useUniwind } from 'uniwind';
import { LogOut, User as UserIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { theme } = useUniwind();
    const { t } = useTranslation();

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    return (
        <View className="flex-1 bg-background p-6">
            <Stack.Screen options={{ title: t('profile.title'), headerShown: true }} />

            <View className="items-center mt-10 mb-8">
                <View className="h-24 w-24 rounded-full bg-secondary items-center justify-center mb-4">
                    <UserIcon size={48} className="text-secondary-foreground" />
                </View>
                <Text className="text-2xl font-bold text-foreground">
                    {user?.firstName}
                </Text>
                <Text className="text-sm text-muted-foreground mt-1">
                    {user?.email}
                </Text>
            </View>

            <View className="bg-card rounded-lg p-4 space-y-6">
                <View className="flex-row items-center justify-between">
                    <Text className="text-base font-medium text-foreground">{t('profile.language')}</Text>
                    <LanguageDropdown />
                </View>

                <View className="h-[1px] bg-border" />

                <View className="flex-row items-center justify-between">
                    <Text className="text-base font-medium text-foreground">{t('profile.appearance')}</Text>
                    <ThemeToggle />
                </View>
            </View>

            <View className="flex-1 justify-end mb-8">
                <Button
                    variant="destructive"
                    className="w-full flex-row gap-2"
                    onPress={handleLogout}
                >
                    <LogOut size={18} className="text-destructive-foreground" />
                    <Text className="text-destructive-foreground font-semibold">{t('profile.sign_out')}</Text>
                </Button>
            </View>
        </View>
    );
}
