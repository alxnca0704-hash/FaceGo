import { icons } from "@/constant/icons";
import { theme } from "@/constant/theme";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { s } from "react-native-size-matters";

const SafeAreaView = styled(RNSafeAreaView);

const ScanningScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-gray-100 p-3 rounded-full"
          >
            <Image
              source={icons.home}
              style={{
                width: s(20),
                height: s(20),
                tintColor: theme.colors.primary,
              }}
            />
          </TouchableOpacity>
          <Text className="text-black font-sans-bold text-lg">Face Scan</Text>
          <View style={{ width: s(44) }} />
        </View>

        {/* Scanning Overlay */}
        <View className="flex-1 items-center justify-center">
          <View
            className="border-2 border-gray-100 rounded-[40px] items-center justify-center bg-gray-50/50"
            style={{ width: s(260), height: s(320) }}
          >
            {/* Corner Markers */}
            <View
              className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 rounded-tl-3xl"
              style={{ borderColor: theme.colors.accent }}
            />
            <View
              className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 rounded-tr-3xl"
              style={{ borderColor: theme.colors.accent }}
            />
            <View
              className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 rounded-bl-3xl"
              style={{ borderColor: theme.colors.accent }}
            />
            <View
              className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 rounded-br-3xl"
              style={{ borderColor: theme.colors.accent }}
            />

            {/* Scanning Line Animation Mockup */}
            <View
              className="absolute w-full h-[2px]"
              style={{
                top: "30%",
                backgroundColor: theme.colors.accent,
                shadowColor: theme.colors.accent,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 15,
                elevation: 5,
              }}
            />

            <Image
              source={icons.person}
              style={{
                width: s(120),
                height: s(120),
                opacity: 0.1,
                tintColor: theme.colors.primary,
              }}
            />
          </View>

          <View className="mt-10 px-10">
            <Text className="text-black text-center font-sans-bold text-xl mb-2">
              Position your face
            </Text>
            <Text className="text-gray-500 text-center font-sans-medium">
              Please make sure your face is within the frame for faster
              verification
            </Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View className="px-10 pb-10">
          <TouchableOpacity
            className="bg-black py-4 rounded-3xl items-center shadow-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white font-sans-bold text-lg">
              Start Scanning
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ScanningScreen;
