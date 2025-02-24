import { View, Platform, StyleSheet, LayoutChangeEvent, Alert } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { House, Banknote, NotepadText } from 'lucide-react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useEffect, useState, useMemo } from 'react';

const Icons = {
    home: House,
    expense: Banknote,
    bin: NotepadText
};

export default function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { buildHref } = useLinkBuilder();
    const [dimensions, setDimensions] = useState({ height: 50, width: 100 });
    const tabPositionX = useSharedValue(0);

    const translateY = useSharedValue(0);

    const buttonWidth = useMemo(() => dimensions.width / state.routes.length, [dimensions.width, state.routes.length]);

    // Handle tab position animation
    useEffect(() => {
        tabPositionX.value = withSpring(buttonWidth * state.index, { stiffness: 200, damping: 15 });
    }, [state.index, buttonWidth]);

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }]
    }));

    const tabAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: tabPositionX.value }]
    }));

    const onTabbarLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width
        });
    };

    return (
        <Animated.View style={[styles.tabContainer, containerAnimatedStyle]} onLayout={onTabbarLayout} >
            <Animated.View
                style={[
                    styles.focusedBackground,
                    tabAnimatedStyle,
                    {
                        height: dimensions.height - 15,
                        width: buttonWidth - (Platform.OS === 'android' ? 30 : 25),
                    }
                ]}
            />
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel ?? options.title ?? route.name;
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key
                    });
                };

                const scale = useSharedValue(isFocused ? 1 : 0);
                useEffect(() => {
                    scale.value = withSpring(isFocused ? 1 : 0, { stiffness: 250, damping: 20 });
                }, [isFocused]);

                const animatedTextStyle = useAnimatedStyle(() => ({
                    opacity: interpolate(scale.value, [0, 1], [1, 0])
                }));

                const animatedIconStyle = useAnimatedStyle(() => ({
                    transform: [{ scale: interpolate(scale.value, [0, 1], [1, 1.2]) }],
                    top: interpolate(scale.value, [0, 1], [0, 9])
                }));

                const Icon = Icons[label.toLowerCase()] || Icons.home;

                return (
                    <PlatformPressable
                        key={route.name}
                        href={buildHref(route.name, route.params)}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabButton}
                        android_ripple={{ color: null, borderless: false, radius: 0, foreground: false }}
                    >
                        <View style={styles.iconLabelContainer}>
                            <Animated.View style={animatedIconStyle}>
                                <Icon size={20} color={isFocused ? '#ffffff' : '#696969'} />
                            </Animated.View>
                            <Animated.Text
                                style={[styles.label, { color: isFocused ? '#ffffff' : '#696969' }, animatedTextStyle]}
                            >
                                {label}
                            </Animated.Text>
                        </View>
                    </PlatformPressable>
                );
            })}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: Platform.select({ ios: 80, android: 40 }),
        paddingVertical: 15,
        borderRadius: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        shadowOpacity: 0.1,
        elevation: 5,
    },
    focusedBackground: {
        position: 'absolute',
        backgroundColor: '#723FEB',
        borderRadius: 30,
        marginHorizontal: Platform.select({ ios: 12, android: 15 })
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconLabelContainer: {
        alignItems: 'center'
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        opacity: 0.7,
    }
});