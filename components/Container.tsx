import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { cn } from '~/utils'

type ContainerProps = {
    children: React.ReactNode
    className?: string
}

export default function Container({ children, className }: ContainerProps) {
    return (
        <SafeAreaView
            className={cn(
                "flex-1 px-1", className as string
            )}
            edges={['top']}
        >
            {children}
        </SafeAreaView>
    )
}