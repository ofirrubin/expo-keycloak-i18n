import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import * as AuthSession from 'expo-auth-session';
import { KEYCLOAK_CONFIG, getKeycloakEndpoints } from '@/config/keycloak';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface User {
    id: string;
    username: string;
    firstName?: string;
    email?: string;
    roles?: string[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (authResponse: any) => Promise<void>;
    loginWithCredentials: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const saveTokens = async (accessToken: string, refreshToken: string) => {
        await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    };

    const clearTokens = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    };

    const setUserFromToken = (token: string) => {
        try {
            const decoded: any = jwtDecode(token);
            setUser({
                id: decoded.sub || '',
                username: decoded.preferred_username || '',
                firstName: decoded.given_name || decoded.name || '',
                email: decoded.email,
                roles: decoded.realm_access?.roles || [],
            });
        } catch (error) {
            console.error('Failed to decode token', error);
            setUser(null);
        }
    };

    const loadStoredAuth = useCallback(async () => {
        try {
            const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
            if (storedToken) {
                setToken(storedToken);
                setUserFromToken(storedToken);
            }
        } catch (error) {
            console.error('Failed to load stored auth', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStoredAuth();
    }, [loadStoredAuth]);

    const login = async (authResponse: any) => {
        if (authResponse?.params?.access_token) {
            const accessToken = authResponse.params.access_token;
            const refreshToken = authResponse.params.refresh_token;

            setToken(accessToken);
            setUserFromToken(accessToken);
            await saveTokens(accessToken, refreshToken);
        }
    };

    const loginWithCredentials = async (username: string, password: string) => {
        const discovery = getKeycloakEndpoints();
        const params = new URLSearchParams();
        params.append('client_id', KEYCLOAK_CONFIG.clientId);
        params.append('grant_type', 'password');
        params.append('username', username);
        params.append('password', password);
        params.append('scope', 'openid profile email');

        const response = await fetch(discovery.tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error_description || 'Login failed');
        }

        const data = await response.json();
        setToken(data.access_token);
        setUserFromToken(data.access_token);
        await saveTokens(data.access_token, data.refresh_token);
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
        await clearTokens();
    };

    const refreshAuthToken = async (): Promise<string | null> => {
        const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        if (!storedRefreshToken) {
            await logout();
            return null;
        }

        try {
            const discovery = getKeycloakEndpoints();
            const tokenResult = await AuthSession.refreshAsync(
                {
                    clientId: KEYCLOAK_CONFIG.clientId,
                    refreshToken: storedRefreshToken,
                },
                discovery
            );

            if (tokenResult.accessToken) {
                setToken(tokenResult.accessToken);
                setUserFromToken(tokenResult.accessToken);
                await saveTokens(tokenResult.accessToken, tokenResult.refreshToken || storedRefreshToken);
                return tokenResult.accessToken;
            }
        } catch (error) {
            console.error('Failed to refresh token', error);
            await logout();
        }
        return null;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                isLoading,
                login,
                loginWithCredentials,
                logout,
                refreshToken: refreshAuthToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
