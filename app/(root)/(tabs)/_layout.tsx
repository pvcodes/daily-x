
import MyTabBar from "~/components/TabBar";
import { useAuthStore } from "~/hooks/useAuth";
import { Redirect, Tabs } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export default function TabLayout() {
    return (


        <Tabs
            tabBar={props => <MyTabBar {...props} />}
        >
            <Tabs.Screen
                name="expense"
                options={{
                    title: "Expense",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="bin"
                options={{
                    title: "Bin",
                    headerShown: false,
                }}
            />
        </Tabs >

    );
}
