import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Google from 'expo-auth-session/providers/google'
import { User } from "~/types/user"
import { userEndpoint } from "~/api"
import { AUTH_CONFIG } from "~/constants"
import React, { useEffect } from 'react'

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    signInWithEmail: (email: string, password: string) => Promise<void>
    signUpWithEmail: (name: string, email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    setUserAndToken: (user: User, token: string) => void
    setLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            setUserAndToken: (user: User, token: string) => {
                set({
                    user,
                    token,
                    isAuthenticated: true
                });
            },

            setLoading: (isLoading: boolean) => set({ isLoading }),

            signInWithEmail: async (email: string, password: string) => {
                try {
                    // set({ isLoading: true })
                    const userData = await userEndpoint.getAuthToken('basic', { email, password })

                    if (!userData) {
                        throw new Error('Failed to retrieve user data')
                    }

                    set({
                        user: userData,
                        token: userData.auth_token,
                        isAuthenticated: true,
                        isLoading: false
                    })
                } catch (error) {
                    console.error('Email sign-in error:', error)
                    // set({ isLoading: false })
                    throw error
                }
            },
            signUpWithEmail: async (name: string, email: string, password: string) => {
                try {
                    const userData = await userEndpoint.signUpAndGetToken(name, email, password)
                    if (!userData) {
                        throw new Error('Failed to retrieve user data')
                    }
                    set({
                        user: userData,
                        token: userData.auth_token,
                        isAuthenticated: true,
                        isLoading: false
                    })
                } catch (error) {
                    console.error('Email sign-in error:', error)
                    throw error
                }

            },
            signOut: async () => {
                try {
                    set({ isLoading: true })
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false
                    })
                } catch (error) {
                    console.error('Sign-out error:', error)
                    set({ isLoading: false })
                    throw error
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)

// Google Auth Hook
export const useGoogleSignIn = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        ...AUTH_CONFIG,
        selectAccount: true,
    });
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const setUserAndToken = useAuthStore(state => state.setUserAndToken);
    const setLoading = useAuthStore(state => state.setLoading);

    const startAuth = async () => {
        setLoading(true)
        await promptAsync()
    }

    useEffect(() => {
        const fetch = async () => {
            try {
                if (response?.type === 'success' && response.authentication?.accessToken) {
                    setLoading(true);
                    const userData = await userEndpoint.getAuthToken('google-oauth', response.authentication.accessToken);
                    setUserAndToken(userData, userData.auth_token);
                }
            } catch (error) {
                console.error('Google sign-in error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!isAuthenticated) fetch();
    }, [response]);

    return { promptAsync, response };
};