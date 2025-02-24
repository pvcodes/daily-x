import React, { useState, useCallback } from 'react';
import { Modal, Dimensions, Animated, Text, View, useColorScheme, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { cn } from '~/lib/utils';
import { Card, CardContent, CardFooter } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { AlertCircle, Cross, CrossIcon, X } from 'lucide-react-native';
import { Checkbox } from './ui/checkbox';
import { H4 } from './ui/typography';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore, useGoogleSignIn } from '~/hooks/useAuth';


WebBrowser.maybeCompleteAuthSession();


const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * (2 / 3);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

type ErrorField = 'email' | 'password' | 'name' | 'confirmPassword' | 'terms' | null;

const AuthModal = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
    const [signInData, setSignInData] = useState({ email: '', password: '' });
    const [signUpData, setSignUpData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState<{ message: string; field: ErrorField }>({ message: '', field: null });
    const [isLoading, setIsLoading] = useState({ signIn: false, signUp: false });

    const colorScheme = useColorScheme();
    const slideAnim = useState(new Animated.Value(SCREEN_HEIGHT))[0];

    // const 
    const { promptAsync } = useGoogleSignIn();
    const { signInWithEmail, signUpWithEmail } = useAuthStore();


    // Animation functions
    const showModal = useCallback(() => {
        setModalVisible(true);
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
    }, [slideAnim]);

    const hideModal = useCallback(() => {
        Animated.timing(slideAnim, { toValue: MODAL_HEIGHT, duration: 300, useNativeDriver: true }).start(() => {
            setModalVisible(false);
            resetForms();
        });
    }, [slideAnim]);

    const resetForms = useCallback(() => {
        setSignInData({ email: '', password: '' });
        setSignUpData({ name: '', email: '', password: '', confirmPassword: '' });
        setAcceptedTerms(false);
        setError({ message: '', field: null });
        setIsLoading({ signIn: false, signUp: false });
    }, []);

    // Validation functions with ordered single-error display tied to fields
    const validateSignIn = useCallback(() => {
        setError({ message: '', field: null }); // Clear previous error
        if (!signInData.email) {
            setError({ message: 'Email is required', field: 'email' });
            return false;
        }
        if (!EMAIL_REGEX.test(signInData.email)) {
            setError({ message: 'Invalid email format', field: 'email' });
            return false;
        }
        if (!signInData.password) {
            setError({ message: 'Password is required', field: 'password' });
            return false;
        }
        return true;
    }, [signInData]);

    const validateSignUp = useCallback(() => {
        setError({ message: '', field: null }); // Clear previous error
        if (!signUpData.name.trim()) {
            setError({ message: 'Name is required', field: 'name' });
            return false;
        }
        if (!signUpData.email) {
            setError({ message: 'Email is required', field: 'email' });
            return false;
        }
        if (!EMAIL_REGEX.test(signUpData.email)) {
            setError({ message: 'Invalid email format', field: 'email' });
            return false;
        }
        if (!signUpData.password) {
            setError({ message: 'Password is required', field: 'password' });
            return false;
        }
        if (!PASSWORD_REGEX.test(signUpData.password)) {
            setError({ message: 'Password must be at least 8 characters with letters and numbers', field: 'password' });
            return false;
        }
        if (!signUpData.confirmPassword) {
            setError({ message: 'Please confirm your password', field: 'confirmPassword' });
            return false;
        }
        if (signUpData.password !== signUpData.confirmPassword) {
            setError({ message: 'Passwords do not match', field: 'confirmPassword' });
            return false;
        }
        if (!acceptedTerms) {
            setError({ message: 'You must accept the terms and conditions', field: 'terms' });
            return false;
        }
        return true;
    }, [signUpData, acceptedTerms]);

    // Handlers
    const handleSignIn = useCallback(async () => {
        if (!validateSignIn()) return;
        setIsLoading(prev => ({ ...prev, signIn: true }));
        try {
            // await new Promise(resolve => setTimeout(resolve, 1500));
            await signInWithEmail(signInData.email, signInData.password)
            hideModal(); // Close modal on successful sign-in
        } catch (error) {
            console.error(error);
            setError({ message: 'An error occurred during sign-in', field: null });
        } finally {
            setIsLoading(prev => ({ ...prev, signIn: false }));
        }
    }, [validateSignIn, hideModal, signInWithEmail]);

    const handleSignUp = useCallback(async () => {
        if (!validateSignUp()) return;
        setIsLoading(prev => ({ ...prev, signUp: true }));
        try {
            // await new Promise(resolve => setTimeout(resolve, 1500));
            await signUpWithEmail(signUpData.name, signUpData.email, signUpData.password)
            hideModal(); // Close modal on successful sign-up
        } catch (error) {
            console.error(error);
            setError({ message: 'An error occurred during sign-up', field: null });
        } finally {
            setIsLoading(prev => ({ ...prev, signUp: false }));
        }
    }, [validateSignUp, hideModal, signUpWithEmail]);

    const handleGoogleSignIn = useCallback(async () => {
        try {
            await promptAsync()
            // Add Google sign-in logic
            // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate Google sign-in
            hideModal(); // Close modal on successful Google sign-in
        } catch (error) {
            console.error(error);
            setError({ message: 'An error occurred with Google sign-in', field: null });
        }
    }, [promptAsync, hideModal]);

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 justify-center items-center">
                <Modal
                    transparent
                    visible={modalVisible}
                    onRequestClose={() => { }} // Disable hardware back button closing
                    statusBarTranslucent
                >
                    <Pressable className="flex-1 bg-gray-900/50 dark:bg-black/50" onPress={hideModal}>
                        <Animated.ScrollView
                            className={cn('absolute bottom-0 w-full rounded-t-3xl', colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white')}
                            style={{
                                height: MODAL_HEIGHT,
                                transform: [{ translateY: slideAnim }],
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: -2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}
                            onStartShouldSetResponder={() => true} // Prevent presses inside modal from bubbling to Pressable
                        >
                            <SafeAreaView className="flex-1">
                                <View className="items-center pt-2">
                                    <View className={cn('w-16 h-1 rounded-full', colorScheme === 'dark' ? 'bg-gray-600' : 'bg-gray-300')} />
                                </View>
                                <View className="flex-1 px-4 pt-4">
                                    {/* <Text>hello</Text> */}
                                    <View className='my-4 flex justify-between items-center flex-row'>
                                        <H4>Let get Started</H4>
                                        <Button variant='ghost' onPress={hideModal}>
                                            <X color={colorScheme === 'dark' ? 'white' : 'black'} />
                                        </Button>
                                    </View>
                                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                                        <TabsList className="flex-row w-full mb-4">
                                            <TabsTrigger value="signin" className="flex-1">
                                                <Text className={cn('text-base font-semibold', colorScheme === 'dark' ? 'text-white' : 'text-black')}>
                                                    Sign In
                                                </Text>
                                            </TabsTrigger>
                                            <TabsTrigger value="signup" className="flex-1">
                                                <Text className={cn('text-base font-semibold', colorScheme === 'dark' ? 'text-white' : 'text-black')}>
                                                    Sign Up
                                                </Text>
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="signin">
                                            <Card >
                                                <CardContent className="mt-4 gap-4 native:gap-2">
                                                    <View className="gap-1">
                                                        <Label nativeID="signin-email">Email</Label>
                                                        <Input
                                                            aria-labelledby="signin-email"
                                                            value={signInData.email}
                                                            onChangeText={text => setSignInData(prev => ({ ...prev, email: text }))}
                                                            keyboardType="email-address"
                                                            autoCapitalize="none"
                                                            placeholder="pvcodes@gmail.com"
                                                        />
                                                        {error.field === 'email' && <ErrorMessage message={error.message} />}
                                                    </View>
                                                    <View className="gap-1">
                                                        <Label nativeID="signin-password">Password</Label>
                                                        <Input
                                                            aria-labelledby="signin-password"
                                                            value={signInData.password}
                                                            onChangeText={text => setSignInData(prev => ({ ...prev, password: text }))}
                                                            secureTextEntry
                                                            placeholder="*********"
                                                        />
                                                        {error.field === 'password' && <ErrorMessage message={error.message} />}
                                                    </View>
                                                    {error.field === null && error.message && <ErrorMessage message={error.message} />}
                                                </CardContent>
                                                <CardFooter className="flex-col gap-4">
                                                    <Button
                                                        onPress={handleSignIn}
                                                        disabled={isLoading.signIn}
                                                        className="w-full"
                                                    >
                                                        {isLoading.signIn ? (
                                                            <ActivityIndicator color="white" />
                                                        ) : (
                                                            <Text className="font-bold text-center text-white dark:text-black">Sign In</Text>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        onPress={handleGoogleSignIn}
                                                        variant="outline"
                                                        className="w-full flex-row justify-center items-center gap-2"
                                                    >
                                                        <Text className="font-semibold dark:text-white">Continue with Google</Text>
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="signup">
                                            <Card>
                                                <CardContent className="mt-4 gap-4 native:gap-2">
                                                    <View className="gap-1">
                                                        <Label nativeID="signup-name">Name</Label>
                                                        <Input
                                                            aria-labelledby="signup-name"
                                                            value={signUpData.name}
                                                            onChangeText={text => setSignUpData(prev => ({ ...prev, name: text }))}
                                                            placeholder="John Doe"
                                                        />
                                                        {error.field === 'name' && <ErrorMessage message={error.message} />}
                                                    </View>
                                                    <View className="gap-1">
                                                        <Label nativeID="signup-email">Email</Label>
                                                        <Input
                                                            aria-labelledby="signup-email"
                                                            value={signUpData.email}
                                                            onChangeText={text => setSignUpData(prev => ({ ...prev, email: text }))}
                                                            keyboardType="email-address"
                                                            autoCapitalize="none"
                                                            placeholder="pvcodes@gmail.com"
                                                        />
                                                        {error.field === 'email' && <ErrorMessage message={error.message} />}
                                                    </View>
                                                    <View className="gap-1">
                                                        <Label nativeID="signup-password">Password</Label>
                                                        <Input
                                                            aria-labelledby="signup-password"
                                                            value={signUpData.password}
                                                            onChangeText={text => setSignUpData(prev => ({ ...prev, password: text }))}
                                                            secureTextEntry
                                                            placeholder="*********"
                                                        />
                                                        {error.field === 'password' && <ErrorMessage message={error.message} />}
                                                    </View>
                                                    <View className="gap-1">
                                                        <Label nativeID="signup-confirm-password">Confirm Password</Label>
                                                        <Input
                                                            aria-labelledby="signup-confirm-password"
                                                            value={signUpData.confirmPassword}
                                                            onChangeText={text => setSignUpData(prev => ({ ...prev, confirmPassword: text }))}
                                                            secureTextEntry
                                                            placeholder="*********"
                                                        />
                                                        {error.field === 'confirmPassword' && <ErrorMessage message={error.message} />}
                                                    </View>
                                                </CardContent>
                                                <CardFooter className="flex-col gap-4">
                                                    <View className="flex-row items-center gap-3">
                                                        <Checkbox
                                                            checked={acceptedTerms}
                                                            onCheckedChange={setAcceptedTerms}
                                                            className={cn('mt-1', error.field === 'terms' && 'border-red-500')}
                                                        />
                                                        <TermsText colorScheme={colorScheme} />
                                                    </View>
                                                    {error.field === 'terms' && <ErrorMessage message={error.message} />}
                                                    {error.field === null && error.message && <ErrorMessage message={error.message} />}
                                                    <Button
                                                        onPress={handleSignUp}
                                                        disabled={isLoading.signUp}
                                                        className="w-full"

                                                    // 
                                                    >
                                                        {isLoading.signUp ? (
                                                            <ActivityIndicator color="white" />
                                                        ) : (
                                                            <Text
                                                                className={cn(
                                                                    'font-bold text-center text-white dark:text-black',
                                                                    // colorScheme === 'dark' ? 'text-white' : 'text-black'
                                                                )}
                                                            >
                                                                Sign Up
                                                            </Text>
                                                        )}
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </TabsContent>
                                    </Tabs>
                                </View>
                                {/* Removed the Close button */}
                            </SafeAreaView>
                        </Animated.ScrollView>
                    </Pressable>
                </Modal>
                <Button className="rounded-2xl p-2" onPress={showModal}>
                    <Text className="font-bold text-center text-white">Let's Get Started</Text>
                </Button>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

// Helper components
const ErrorMessage = ({ message }: { message: string }) => (
    <View className="flex-row items-center gap-1">
        <AlertCircle className="w-4 h-4" color="red" />
        <Text className="text-red-500 text-sm">{message}</Text>
    </View>
);

const TermsText = ({ colorScheme }: { colorScheme: 'light' | 'dark' | null }) => (
    <Text className={cn('text-sm flex-wrap', colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
        I agree to the{' '}
        <Text className="text-primary underline" onPress={() => console.log('Navigate to terms')}>
            Terms of Service
        </Text>{' '}
        and{' '}
        <Text className="text-primary underline" onPress={() => console.log('Navigate to privacy policy')}>
            Privacy Policy
        </Text>
    </Text>
);

export default AuthModal;