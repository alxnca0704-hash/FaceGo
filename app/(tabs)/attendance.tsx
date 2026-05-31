import { images } from "@/constant/images";
import { styled } from "nativewind";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "react-native-size-matters";

const SafeAreaView = styled(RNSafeAreaView);

const attendance = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View
        className="flex-row items-center"
        style={{ paddingHorizontal: s(20), marginBottom: vs(30), gap: s(10) }}
      >
        <Image
          source={images.denr}
          style={{ width: s(40), height: s(40) }}
          resizeMode="contain"
        />
        <Text className="text-black font-sans-extrabold text-4xl">
          Attendance
        </Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="font-sans-medium text-gray-500">
          Attendance tracking records will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default attendance;
