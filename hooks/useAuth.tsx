import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { AUTH_CONFIG, STORAGE_KEYS } from '@/constants';

interface User {
    email: string;
    name: string;
    // Add other user properties as needed
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
}

interface UseAuth {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

async function getUserInfo(token: string): Promise<User> {
    try {
        const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const user = await response.json();
        if (user?.error) {
            throw new Error(user.error.message || "Failed to fetch user info");
        }
        return user;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}

export function useAuth(): UseAuth {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isLoading: true // Start with loading true
    });

    const [_, response, promptAsync] = Google.useAuthRequest(AUTH_CONFIG);

    const loadStoredAuth = useCallback(async () => {
        try {
            const [storedUser, storedToken] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.USER),
                AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
            ]);

            if (storedToken && storedUser) {
                setAuthState({
                    user: JSON.parse(storedUser),
                    token: storedToken,
                    isLoading: false
                });
            } else {
                setAuthState(prev => ({ ...prev, isLoading: false }));
            }
        } catch (error) {
            console.error('Error loading stored auth:', error);
            setAuthState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const syncAuthState = useCallback(async () => {
        try {
            const currentToken = response?.authentication?.accessToken;
            if (!currentToken) return;

            setAuthState(prev => ({ ...prev, isLoading: true }));
            const user = await getUserInfo(currentToken);

            await Promise.all([
                AsyncStorage.setItem(STORAGE_KEYS.TOKEN, currentToken),
                AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
            ]);

            setAuthState({ user, token: currentToken, isLoading: false });
        } catch (error) {
            console.error('Error syncing auth state:', error);
            setAuthState(prev => ({ ...prev, isLoading: false }));
        }
    }, [response]);

    useEffect(() => {
        loadStoredAuth();
    }, []);

    useEffect(() => {
        if (response?.type === 'success') {
            syncAuthState();
        }
    }, [response, syncAuthState]);

    const signIn = async () => {
        try {
            setAuthState(prev => ({ ...prev, isLoading: true }));
            await promptAsync();
        } catch (error) {
            console.error('Sign in error:', error);
            setAuthState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    const signOut = async () => {
        try {
            setAuthState(prev => ({ ...prev, isLoading: true }));

            if (authState.token) {
                await AuthSession.revokeAsync(
                    {
                        token: authState.token,
                        tokenTypeHint: AuthSession.TokenTypeHint.AccessToken
                    },
                    Google.discovery
                );
            }

            await Promise.all([
                AsyncStorage.removeItem(STORAGE_KEYS.USER),
                AsyncStorage.removeItem(STORAGE_KEYS.TOKEN)
            ]);

            setAuthState({ user: null, token: null, isLoading: false });
        } catch (error) {
            console.error('Sign out error:', error);
            setAuthState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    return {
        user: authState.user,
        token: authState.token,
        isAuthenticated: !!authState.user && !!authState.token,
        isLoading: authState.isLoading,
        signIn,
        signOut,
        refreshUser: syncAuthState
    };
}