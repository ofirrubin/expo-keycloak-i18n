import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import { useUniwind } from 'uniwind';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function FeedScreen() {
    const { theme } = useUniwind();
    const { t } = useTranslation();

    return (
        <View
            className="flex-1 items-center justify-center gap-4 bg-background"
            style={{
                backgroundColor: theme === 'dark' ? '#000000' : undefined
            }}
        >
            <Stack.Screen options={{ title: t('feed.title'), headerShown: true, headerTransparent: true }} />
            <Text className="text-2xl font-bold">{t('feed.content')}</Text>
            <Text className="text-muted-foreground">{t('feed.description')}</Text>
        </View>
    );
}
