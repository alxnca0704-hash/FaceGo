import { icons } from "@/constant/icons";
import { theme } from "@/constant/theme";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { s } from "react-native-size-matters";
import { Camera } from "expo-camera";
import { useCameraPermissions } from "expo-camera";
import { useBiometricEngine } from "@/lib/hooks/useBiometricEngine";
import { saveBiometricLedger, getLatestLedgerId } from "@/lib/services/database";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

const SafeAreaView = styled(RNSafeAreaView);

const EnrollmentScreen = () => {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);

  const onComplete = (profiles: any[]) => {
    const result = saveBiometricLedger(profiles);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Enrollment Complete",
        "Facial biometrics have been successfully captured.",
        [{ text: "OK", onPress: () => {
          router.back();
        }}]
      );
    } else {
      Alert.alert("Error", "Failed to save biometric data.");
      setIsCapturing(false);
    }
  };

  const {
    currentStageIndex,
    currentStageInfo, 
    capturedProfiles,
    handleFacesDetected,
  } = useBiometricEngine('front', onComplete);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-10">
        <Text className="text-center font-sans-bold text-lg mb-4">
          Camera permission is required for enrollment
        </Text>
        <TouchableOpacity 
          onPress={requestPermission}
          className="bg-primary px-8 py-4 rounded-2xl"
        >
          <Text className="text-white font-sans-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-gray-100 p-3 rounded-full"
          >
            <Ionicons name="close" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text className="text-black font-sans-bold text-lg">Enroll Face</Text>
          <View style={{ width: s(44) }} />
        </View>

        {/* Enrollment Area */}
        <View className="flex-1 items-center justify-center">
          <View
            className="border-2 border-gray-100 rounded-[40px] overflow-hidden bg-gray-50/50 relative"
            style={{ width: s(260), height: s(320) }}
          >
            {isCapturing ? (
              <Camera
                style={StyleSheet.absoluteFill}
                type="front"
                onFacesDetected={({ faces }: any) => {
                  handleFacesDetected(faces);
                }}
                faceDetectorSettings={{
                  mode: 'fast',
                  detectLandmarks: 'all',
                  runClassifications: 'none',
                  minDetectionInterval: 100,
                  tracking: true,
                }}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
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
            )}

            {/* Stage Indicators */}
            <View className="absolute top-4 left-0 right-0 flex-row justify-center gap-2 z-20">
              {[0, 1, 2, 3, 4].map((i) => (
                <View 
                  key={i}
                  className={`w-2 h-2 rounded-full ${i <= currentStageIndex && capturedProfiles.length > i ? 'bg-accent' : 'bg-gray-300'}`}
                />
              ))}
            </View>

            {/* Corner Markers */}
            <View
              className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 rounded-tl-3xl z-10"
              style={{ borderColor: theme.colors.accent }}
            />
            <View
              className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 rounded-tr-3xl z-10"
              style={{ borderColor: theme.colors.accent }}
            />
            <View
              className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 rounded-bl-3xl z-10"
              style={{ borderColor: theme.colors.accent }}
            />
            <View
              className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 rounded-br-3xl z-10"
              style={{ borderColor: theme.colors.accent }}
            />
          </View>

          <View className="mt-10 px-10">
            <Text className="text-black text-center font-sans-bold text-2xl mb-2">
              {isCapturing ? currentStageInfo.instruction : "Ready to start?"}
            </Text>
            <Text className="text-gray-500 text-center font-sans-medium">
              {isCapturing 
                ? "Follow the instruction to capture all angles"
                : "Position your face in the frame and press start"}
            </Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View className="px-10 pb-10">
          {!isCapturing ? (
            <TouchableOpacity
              onPress={() => setIsCapturing(true)}
              className="bg-primary py-4 rounded-3xl items-center shadow-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white font-sans-bold text-lg">
                Start Enrollment
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setIsCapturing(false);
              }}
              className="bg-gray-200 py-4 rounded-3xl items-center"
              activeOpacity={0.8}
            >
              <Text className="text-black font-sans-bold text-lg">
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default EnrollmentScreen;
