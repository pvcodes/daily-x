import { Redirect } from 'expo-router';
import * as React from 'react';
import { TextInput, View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { useAuthStore } from '~/hooks/useAuth';

// Memoize the Screen component to prevent unnecessary re-renders
const Screen = React.memo(() => {
    const [isEditing, setIsEditing] = React.useState(false);
    const user = useAuthStore(state => state.user);
    const signOut = useAuthStore(state => state.signOut);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const [name, setName] = React.useState(user?.name);

    if (!isAuthenticated) return <Redirect href='/oauthredirect' />

    // Move inline functions outside of the render method
    const handleNameChange = (val: string) => setName(val);
    const handleBlur = () => setIsEditing(false);
    const handleEditPress = () => setIsEditing(true);

    return (
        <View className='flex-1 justify-center items-center gap-5 p-6 bg-secondary/30'>
            <Card className='w-full max-w-sm p-6 rounded-2xl'>
                <CardHeader className='items-center'>
                    <Avatar alt="Rick Sanchez's Avatar" className='w-24 h-24'>
                        <AvatarImage source={{ uri: '' }} />
                        <AvatarFallback>
                            <Text>{user?.name[0].toLocaleUpperCase()}</Text>
                        </AvatarFallback>
                    </Avatar>
                    <View className='p-3' />
                    <CardTitle className='pb-2 text-center'>
                        {
                            isEditing ? <TextInput
                                value={name}
                                onChangeText={handleNameChange}
                                // autoFocus
                                onBlur={handleBlur}
                            /> :
                                <Text onPress={handleEditPress}>
                                    {user?.name}
                                </Text>
                        }
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Existing content */}
                </CardContent>
                <CardFooter className='flex-col gap-3 pb-0'>
                    <View className='flex-row items-center overflow-hidden'>
                        {/* Existing content */}
                    </View>
                    <View className='flex-row gap-2 justify-end w-full'>
                        <Button
                            variant='destructive'
                            className='shadow shadow-foreground/5'
                            onPress={signOut}
                        >
                            <Text>Sign Out</Text>
                        </Button>
                        <Button
                            variant='outline'
                            className='shadow shadow-foreground/5'
                        // onPress={updateProgressValue}
                        >
                            <Text>Update</Text>
                        </Button>
                    </View>
                </CardFooter>
            </Card>
        </View>
    );
});

export default Screen;