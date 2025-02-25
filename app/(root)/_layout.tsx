
import { useAuthStore } from "~/hooks/useAuth";
import { Redirect, Stack } from "expo-router";
import { ThemeToggle } from "~/components/ThemeToggle";
import { format } from "date-fns";

export default function RootLayout() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    if (!isAuthenticated) return <Redirect href='/oauthredirect' />
    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name='index'
                options={{
                    headerRight: () => <ThemeToggle />,
                }}
            />

            <Stack.Screen
                name='(tabs)'
                options={{
                    title: 'Dashboard'
                }}
            />

            <Stack.Screen name='oauthredirect' />

            <Stack.Screen
                name='expense/[day]'
                options={({ route }) => {
                    const day = route.params.day
                    return {
                        headerShown: true,
                        title: format(day, 'MMM dd'),
                    }
                }}
            />
            <Stack.Screen
                name='bin/[uid]'
                options={({ route }) => {
                    const uid = route.params.uid
                    return {
                        headerShown: true,
                        title: uid,
                    }
                }}
            />

            <Stack.Screen
                name='profile'
                options={{
                    headerShown: true,
                    title: 'Profile',
                }}
            />

        </Stack>
    );
}
