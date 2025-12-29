import { useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

export function useAPI() {
    const { token, refreshToken, logout } = useAuth();

    const request = useCallback(
        async (path: string, options: RequestOptions = {}) => {
            let currentToken = token;

            const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
            const endpoint = path.startsWith('/') ? path.slice(1) : path;
            const fullUrl = new URL(endpoint, baseUrl);

            if (options.params) {
                Object.entries(options.params).forEach(([key, value]) => {
                    fullUrl.searchParams.append(key, value);
                });
            }

            const fetchWithOptions = async (authToken: string | null) => {
                const headers = new Headers(options.headers);
                if (authToken) {
                    headers.set('Authorization', `Bearer ${authToken}`);
                }
                if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
                    headers.set('Content-Type', 'application/json');
                }

                return fetch(fullUrl.toString(), {
                    ...options,
                    headers,
                });
            };

            let response = await fetchWithOptions(currentToken);

            // Handle 401 Unauthorized - Attempt to refresh token once
            if (response.status === 401) {
                console.log('API returned 401, attempting token refresh...');
                const newToken = await refreshToken();
                if (newToken) {
                    console.log('Token refreshed successfully, retrying request...');
                    response = await fetchWithOptions(newToken);
                } else {
                    console.log('Token refresh failed, user will be logged out.');
                    await logout();
                    throw new Error('Unauthorized');
                }
            }

            if (!response.ok) {
                const errorBody = await response.text();
                let errorMessage = `API Error: ${response.status} ${response.statusText}`;
                try {
                    const parsedError = JSON.parse(errorBody);
                    errorMessage = parsedError.error || parsedError.message || errorMessage;
                } catch (e) {
                    // Fallback to raw text if not JSON
                    if (errorBody) errorMessage = errorBody;
                }
                throw new Error(errorMessage);
            }

            // Check if content type is JSON before parsing
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            }
            return response.text();
        },
        [token, refreshToken, logout]
    );

    const get = useCallback(
        (path: string, params?: Record<string, string>, options: RequestOptions = {}) =>
            request(path, { ...options, method: 'GET', params }),
        [request]
    );

    const post = useCallback(
        (path: string, body?: any, options: RequestOptions = {}) =>
            request(path, {
                ...options,
                method: 'POST',
                body: body instanceof FormData ? body : JSON.stringify(body),
            }),
        [request]
    );

    const put = useCallback(
        (path: string, body?: any, options: RequestOptions = {}) =>
            request(path, {
                ...options,
                method: 'PUT',
                body: body instanceof FormData ? body : JSON.stringify(body),
            }),
        [request]
    );

    const del = useCallback(
        (path: string, options: RequestOptions = {}) => request(path, { ...options, method: 'DELETE' }),
        [request]
    );

    return useMemo(() => ({
        request,
        get,
        post,
        put,
        delete: del,
    }), [request, get, post, put, del]);
}
