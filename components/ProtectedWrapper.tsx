import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/auth');
        }
    }, [isLoading, isAuthenticated]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}