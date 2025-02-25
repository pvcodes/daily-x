import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { APP } from '~/constants';
import { handleLinkNavigation } from '~/utils';
import { Lead, Muted } from './ui/typography';
import { SafeAreaView } from 'react-native-safe-area-context';

const ComingSoon = () => {
    return (
        <SafeAreaView className='flex-1 justify-center items-center px-1'>
            <Lead>Coming Soon</Lead>
            <Muted>Till then, visit our web app to access all the features,
            </Muted>
            <TouchableOpacity onPress={() => handleLinkNavigation(APP.WEBSITE_URL)}>
                <Text className='underline text-blue-700'>{APP.NAME}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ComingSoon;