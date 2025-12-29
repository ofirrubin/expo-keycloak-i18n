import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import { StarIcon } from 'lucide-react-native';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';
import { useTranslation } from 'react-i18next';
import { LanguageDropdown } from '@/components/language-dropdown';
import { ThemeToggle } from '@/components/ThemeToggle';

const LOGO = {
    light: require('@/assets/images/react-native-reusables-light.png'),
    dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const IMAGE_STYLE: ImageStyle = {
    height: 76,
    width: 76,
};

export default function HomeScreen() {
    const { theme } = useUniwind();
    const { t } = useTranslation();

    return (
        <View
            className="flex-1 items-center justify-center gap-8 p-4 bg-background"
            style={{
                backgroundColor: theme === 'dark' ? '#000000' : undefined
            }}
        >
            <Stack.Screen
                options={{
                    title: t('home.title'),
                    headerTransparent: true,
                    headerRight: () => (
                        <View className="flex-row items-center gap-4 px-4">
                            <LanguageDropdown />
                            <ThemeToggle />
                        </View>
                    ),
                    headerShown: true,
                }}
            />
            <Image source={LOGO[theme ?? 'light']} style={IMAGE_STYLE} resizeMode="contain" />
            <View className="gap-2 p-4">
                <Text className="ios:text-foreground text-muted-foreground font-mono text-sm text-center">
                    {t('home.description')}
                </Text>
                <Text className="ios:text-foreground text-muted-foreground font-mono text-sm text-center">
                    {t('home.dark_mode_status')}
                </Text>
            </View>
            <View className="flex-row gap-2">
                <Link href="https://reactnativereusables.com" asChild>
                    <Button variant="outline">
                        <Text>{t('home.browse_docs')}</Text>
                    </Button>
                </Link>
                <Link href="https://github.com/founded-labs/react-native-reusables" asChild>
                    <Button variant="ghost">
                        <Text>{t('home.star_repo')}</Text>
                        <Icon as={StarIcon} />
                    </Button>
                </Link>
            </View>
        </View>
    );
}

