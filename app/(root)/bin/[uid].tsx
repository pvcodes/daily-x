import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Binpage = () => {
    const { uid } = useLocalSearchParams()
    return (
        <View>
            <Text>Binpage: {uid}</Text>
        </View>
    )
}

export default Binpage