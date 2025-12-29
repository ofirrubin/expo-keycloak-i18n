import { useAuth } from '@/context/AuthContext';
import { useSegments, useRouter } from 'expo-router';
import { useEffect } from 'react';

export function useProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(tabs)';

        if (
            // If the user is not signed in and the initial segment is not anything in the auth group.
            !isAuthenticated &&
            inAuthGroup
        ) {
            // Redirect to the sign-in page.
            router.replace('/login');
        } else if (isAuthenticated && segments[0] === 'login') {
            // Redirect away from the sign-in page.
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, isLoading, segments]);
}
