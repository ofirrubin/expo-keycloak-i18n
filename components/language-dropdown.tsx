import * as React from 'react';
import { useTranslation } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    type Option,
} from '@/components/ui/select';
import { View } from 'react-native';
import { resolveLanguage } from '@/lib/i18n';

const LANGUAGE_KEY = 'user-language-preference';

export function LanguageDropdown() {
    const { i18n } = useTranslation();

    // Track theoretical preference: 'system' | 'en' | 'he'
    const [preference, setPreference] = React.useState<Option>({
        value: 'system',
        label: 'System'
    });

    const options: Option[] = [
        { label: 'System', value: 'system' },
        { label: 'English', value: 'en' },
        { label: 'עברית', value: 'he' },
    ];

    // Load persisted preference on mount
    React.useEffect(() => {
        async function loadPreference() {
            try {
                const saved = await SecureStore.getItemAsync(LANGUAGE_KEY);
                if (saved) {
                    const option = options.find((o) => o?.value === saved);
                    if (option) {
                        setPreference(option);
                        i18n.changeLanguage(resolveLanguage(saved));
                    }
                }
            } catch (error) {
                console.error('Failed to load language preference', error);
            }
        }
        loadPreference();
    }, []);

    const onValueChange = (option: Option | undefined) => {
        if (!option) return;
        setPreference(option);

        // Persist
        SecureStore.setItemAsync(LANGUAGE_KEY, option.value);

        // Apply
        i18n.changeLanguage(resolveLanguage(option.value));
    };

    return (
        <View className="flex-row items-center">
            <Select value={preference} onValueChange={onValueChange}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent sideOffset={5}>
                    <SelectItem label="System" value="system" />
                    <SelectItem label="English" value="en" />
                    <SelectItem label="עברית" value="he" />
                </SelectContent>
            </Select>
        </View>
    );
}
