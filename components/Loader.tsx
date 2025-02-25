import { View, Text, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withSpring, Easing } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';

export default function LoaderScreen() {
    // Shared values for animations
    const loaderOpacity = useSharedValue(0);
    const loaderScale = useSharedValue(0.8); // For a pulsing loader effect
    const cardOpacity = useSharedValue(0);
    const [fact, setFact] = useState('No Fact')

    useEffect(() => {
        const fetchFact = async () => {

            try {
                const response = await fetch(`https://uselessfacts.jsph.pl/api/v2/facts/random`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json()
                setFact(data.text)
            } catch (error) {

            }
        }
        fetchFact()
    }, [])


    // Animation effect on mount
    useEffect(() => {
        // Loader animation: Quick fade-in with a subtle pulse
        loaderOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
        loaderScale.value = withSequence(
            withTiming(1, { duration: 300 }),
            withSpring(1.1, { damping: 15, stiffness: 150 }),
            withTiming(1, { duration: 300 })
        );

        // Card animation: Delayed fade-in to keep focus on loader
        cardOpacity.value = withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease), delay: 400 });
    }, []);

    // Animated styles
    const animatedLoaderStyle = useAnimatedStyle(() => ({
        opacity: loaderOpacity.value,
        transform: [{ scale: loaderScale.value }],
    }));

    const animatedCardStyle = useAnimatedStyle(() => ({
        opacity: cardOpacity.value,
    }));

    return (
        <View className="flex-1  items-center justify-center px-6">
            {/* Loader as the star */}
            <Animated.View style={[animatedLoaderStyle, { alignItems: 'center' }]} className="mb-1">
                <ActivityIndicator size='large' color="#4F46E5" />
                <Text className="mt-4 text-lg font-semibold text-center pl-2">
                    Loading...
                </Text>
            </Animated.View>

            {/* Fact as a secondary element */}
            <Animated.View style={animatedCardStyle} className="mt-4">
                <Card className="w-72  shadow-md rounded-xl border border-gray-100">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-base text-indigo-700 font-medium text-center">
                            Fun Fact
                        </CardTitle>
                        <CardDescription className="text-xs  text-center">
                            Something to pass the time
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3">
                        <Text className="text-sm text-center leading-5 dark:text-white">
                            {fact}
                        </Text>
                    </CardContent>
                </Card>
            </Animated.View>
        </View>
    );
}