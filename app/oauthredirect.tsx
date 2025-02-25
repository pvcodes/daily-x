import React from 'react';
import { Redirect } from 'expo-router';
import { View, Image, FlatList, TouchableOpacity } from 'react-native';
import Loader from '~/components/Loader';
import { useAuthStore } from '~/hooks/useAuth';
import { APP, images } from '~/constants';
import Container from '~/components/Container';
import { Text } from '~/components/ui/text';
import { H1, Muted, } from '~/components/ui/typography';
import SignIn from '~/components/Signin';
import { ThemeToggle } from '~/components/ThemeToggle';
import { handleLinkNavigation } from '~/utils';

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

    if (!isLoading && isAuthenticated) {
        return <Redirect href="/" />;
    }

    if (isLoading) <Loader />


    return (
        <Container className='items-center my-10 gap-5'>
            <View className='flex-1 w-full items-end px-10'>
                <ThemeToggle />
            </View>
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
                ListFooterComponent={
                    <View className='mt-4'>
                        {/* <Text>hello</Text> */}
                        <TouchableOpacity onPress={() => handleLinkNavigation(`${APP.WEBSITE_URL}/about`)}>
                            <Text className='text-center underline text-blue-700'> Learn more about us</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
            <SignIn />
        </Container>
    );
};
export default AuthPage;

const FeatureItem = ({ item }: { item: typeof features[number] }) => (
    <View className="px-1 py-4 border-b border-gray-200">
        <Text className="text-lg font-bold">{item.text}</Text>
        <Text className="text-base text-gray-600">{item.description}</Text>
    </View>
);
