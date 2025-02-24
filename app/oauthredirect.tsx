import React from 'react';
import { Redirect } from 'expo-router';
import { View, Image, FlatList } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Loader from '~/components/Loader';
// import Container from '~/components/Container';
import { useAuthStore } from '~/hooks/useAuth';
import { APP, images } from '~/constants';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogClose, DialogTitle, DialogOverlay, DialogTrigger, DialogDescription, DialogFooter } from '~/components/ui/dialog'; // Using your custom Dialog
// import SignInForm from '~/components/sign-in';
import { handleLinkNavigation } from '~/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import Container from '~/components/Container';
import { Text } from '~/components/ui/text';
import { H1, H3, H4, Muted, Small } from '~/components/ui/typography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import SigninForm from '~/components/Signin';

const features = [
    {
        text: "Quick Add",
        description: "Add expenses instantly"
    },
    {
        text: "Daily Budgets",
        description: "Control your spending"
    },
    {
        text: "Smart Insights",
        description: "Visualize your habits"
    }
];

const AuthPage = () => {
    const { isLoading, isAuthenticated } = useAuthStore();
    const [showDialog, setShowDialog] = React.useState(true);

    if (!isLoading && isAuthenticated) {
        return <Redirect href="/" />;
    }

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <View className="flex-1 justify-center items-center gap-6">
                    <Text className="text-2xl text-foreground font-semibold">
                        Loading...
                    </Text>
                    <Loader />
                </View>
            </SafeAreaView>
        );
    }


    return (
        <Container className='items-center my-10 gap-5'>
            <FlatList
                data={features}
                ListHeaderComponent={
                    <View className='mt-5 items-center'>
                        <Image
                            source={images.landingPageBg2}
                            className="w-96 h-96 rounded-full border-2 mb-10"
                            resizeMode="cover"
                            alt="App Logo"
                        />
                        <H1>
                            {APP.NAME}
                        </H1>
                        <Muted>
                            Simplify your life. Track expenses. Gain insights.
                        </Muted>
                    </View>
                }
                renderItem={({ item }) => <FeatureItem item={item} />}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            // ListFooterComponent={
            // <View>
            // </View>
            // }
            />
            {/* <SignInForm /> */}
            <SigninForm />
        </Container>
    );
};
export default AuthPage;



const FeatureItem = ({ item }) => (
    <View className="px-1 py-4 border-b border-gray-200">
        <Text className="text-lg font-bold">{item.text}</Text>
        <Text className="text-base text-gray-600">{item.description}</Text>
    </View>
);
