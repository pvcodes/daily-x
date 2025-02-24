import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeToggle } from '~/components/ThemeToggle';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dateToString, getDateInMMYYYY, queryClient } from '~/lib/utils';
import { format } from 'date-fns';


const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <QueryClientProvider client={queryClient}>

        {/* <ThemeProvider value={ LIGHT_THEME}> */}
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
        <Stack>
          <Stack.Screen
            name='index'
            options={{
              title: 'Starter Base',
              headerRight: () => <ThemeToggle />,
            }}
          />

          <Stack.Screen
            name='(tabs)'
            options={{
              headerShown: false,
              title: 'Dashboard'
            }}
          />

          <Stack.Screen
            name='oauthredirect'
            options={{
              headerShown: false
              // title: 'Welcome',
              // headerRight: () => <ThemeToggle />,
            }}
          />

          <Stack.Screen
            name='expense/[day]'
            options={({ route }) => {
              const day = route.params.day
              // headerShown: false,
              return {
                title: format(day, 'MMM dd'),
              }
              // headerRight: () => <ThemeToggle />,
            }}
          />

          <Stack.Screen
            name='profile'
            options={{
              // headerShown: false
              title: 'Profile',
              // headerRight: () => <ThemeToggle />,
            }}
          />



        </Stack>
        <PortalHost />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
