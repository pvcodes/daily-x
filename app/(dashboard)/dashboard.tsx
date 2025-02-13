import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { SafeAreaView } from 'react-native-safe-area-context'

const Dashboard = () => {
    const { user, token } = useAuth()
    return (
        <SafeAreaView>
            <Text>Dashboard</Text>
            <Text>{JSON.stringify(user)}</Text>
            <Text>{token}</Text>
        </SafeAreaView>
    )
}

export default Dashboard