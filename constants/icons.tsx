import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useColorScheme } from '~/lib/useColorScheme';

// ... existing code ...

const Icons = {
    Google: () => {
        const { isDarkColorScheme } = useColorScheme();
        return (
            <Ionicons
                name='logo-google'
                color={isDarkColorScheme ? 'white' : 'black'}
            />
        );
    }
};

export default Icons
// ... existing code ...