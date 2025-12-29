import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUniwind } from 'uniwind';
import '@/lib/i18n';
import { resolveLanguage } from '@/lib/i18n';
import { AuthProvider } from '@/context/AuthContext';
import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import i18n from 'i18next';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const LANGUAGE_KEY = 'user-language-preference';

function RootLayoutNav() {
  const { theme } = useUniwind();
  useProtectedRoute();

  return (
    <ThemeProvider value={NAV_THEME[theme ?? 'light']}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
      <PortalHost />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  React.useEffect(() => {
    async function loadLanguage() {
      try {
        const saved = await SecureStore.getItemAsync(LANGUAGE_KEY);
        if (saved) {
          i18n.changeLanguage(resolveLanguage(saved));
        }
      } catch (error) {
        console.error('Failed to load language on layout init', error);
      }
    }
    loadLanguage();
  }, []);

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
