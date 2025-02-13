import Button from "@/components/Button";
import { APP, images } from "@/constants";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Main container with proper spacing */}
      <View className="flex-1 px-6 justify-between py-12">
        {/* Top section with branding */}
        <View className="flex-1 items-center justify-center space-y-8">
          <Image
            resizeMode="contain"
            source={images.landingPageBg}
            className="w-72 h-72" // More contained image size
          />

          {/* Text content with improved typography */}
          <View className="space-y-3">
            <Text className="text-3xl font-bold text-center text-gray-900">
              {APP.NAME}
            </Text>
            <Text className="text-base text-center text-gray-600 max-w-xs">
              {APP.DESC}
            </Text>
          </View>
        </View>

        <Button
          label="Dashboard"
          onPress={() => router.push("/dashboard")}
        />


        {/* Bottom section with CTA */}
        <View className="mt-auto px-4">
          <Button
            label="Get Started"
            onPress={() => router.push("/(auth)/auth")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}