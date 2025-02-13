'use client';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

WebBrowser.maybeCompleteAuthSession();

const AuthPage = () => {
    const router = useRouter();
    const { user, signIn, signOut, isLoading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated]);

    const handleLogIn = async () => {
        try {
            await signIn();
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleLogOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            className="flex-1 items-center bg-white flex-col justify-evenly"
            edges={['top']}
        >
            <View>
                <Text className="text-xl font-bold mb-4">Authentication</Text>
                {user && (
                    <Text className="text-center px-4">
                        Hello, {user.name}!{'\n'}
                        Signed in as: {user.email}
                    </Text>
                )}
            </View>

            <View className="w-full px-4">
                <Button
                    onPress={user ? handleLogOut : handleLogIn}
                    label={user ? 'Sign Out' : 'Continue with Google'}
                    className="mb-4"
                    disabled={isLoading}
                />
            </View>
        </SafeAreaView>
    );
};

export default AuthPage;