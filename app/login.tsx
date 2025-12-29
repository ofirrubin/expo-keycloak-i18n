import React, { useState } from 'react';
import { View, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Label } from '@/components/ui/label';
import { useUniwind } from 'uniwind';
import { Loader2 } from 'lucide-react-native';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { loginWithCredentials } = useAuth();
    const router = useRouter();
    const { theme } = useUniwind();

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await loginWithCredentials(username, password);
            router.replace('/(tabs)');
        } catch (err: any) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-background"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View className="mx-auto w-full max-w-[400px] flex-1 justify-center p-6 md:p-8">
                    <View className="mb-8 items-center space-y-2">
                        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                            {/* Placeholder for App Logo */}
                            <Text className="text-3xl font-bold text-primary">R</Text>
                        </View>
                        <Text className="text-3xl font-semibold tracking-tight text-center text-foreground">
                            Welcome back
                        </Text>
                        <Text className="text-sm text-muted-foreground text-center max-w-xs">
                            Enter your credentials to access your account
                        </Text>
                    </View>

                    <View className="space-y-4">
                        <View className="space-y-2">
                            <Label className="text-foreground">Username</Label>
                            <Input
                                placeholder="name@example.com"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                className="bg-background"
                            />
                        </View>
                        <View className="space-y-2">
                            <Label className="text-foreground">Password</Label>
                            <Input
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                className="bg-background"
                            />
                        </View>

                        {error && (
                            <Text className="text-sm font-medium text-destructive text-center">
                                {error}
                            </Text>
                        )}

                        <Button
                            onPress={handleLogin}
                            disabled={loading}
                            className="mt-4 active:scale-[0.98] transition-all"
                        >
                            {loading ? (
                                <View className="flex-row items-center gap-2">
                                    <Loader2 className="animate-spin text-primary-foreground" size={18} />
                                    <Text className="text-primary-foreground">Signing in...</Text>
                                </View>
                            ) : (
                                <Text className="text-primary-foreground font-semibold">Sign In</Text>
                            )}
                        </Button>
                    </View>

                    <View className="mt-8">
                        <Text className="text-center text-xs text-muted-foreground">
                            Protected by Microsoft Fluent Design
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
