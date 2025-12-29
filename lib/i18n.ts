import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './locales/en/translation.json';
import he from './locales/he/translation.json';

const deviceLocales = getLocales();
const rawDeviceLanguage = deviceLocales?.[0]?.languageCode ?? 'en';
const deviceLanguage = rawDeviceLanguage === 'iw' ? 'he' : rawDeviceLanguage;

/**
 * Resolves the target language based on a preference string.
 * @param preference 'system' | 'en' | 'he'
 */
export function resolveLanguage(preference: string): string {
    if (preference === 'system') {
        return ['en', 'he'].includes(deviceLanguage) ? deviceLanguage : 'en';
    }
    return ['en', 'he'].includes(preference) ? preference : 'en';
}

const initialLanguage = resolveLanguage('system');

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            he: { translation: he },
        },
        lng: initialLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
export { deviceLanguage };
