import { icons } from "@/constant/icons";
import { theme } from "@/constant/theme";
import { useVerificationEngine } from "@/lib/hooks/useVerificationEngine";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { s } from "react-native-size-matters";

const SafeAreaView = styled(RNSafeAreaView);

const ScanningScreen = () => {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const {
    matchedUser,
    verificationFeedback,
    handleFacesDetected,
    resetVerification,
  } = useVerificationEngine();

  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const isDetecting = useRef(false); // prevent overlapping detection calls
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Face detection loop ──────────────────────────────────────────────────
  const startDetectionLoop = useCallback(() => {
    intervalRef.current = setInterval(async () => {
      if (!cameraRef.current || isDetecting.current) return;

      try {
        isDetecting.current = true;

        const photo = await cameraRef.current.takePictureAsync({
          skipProcessing: true, // fastest capture
          shutterSound: false,
        });

        if (!photo?.uri) return;

        const result = await FaceDetector.detectFacesAsync(photo.uri, {
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
          minDetectionInterval: 100,
          tracking: true,
        });

        if (result.faces.length > 0) {
          handleFacesDetected(result.faces);
        }
      } catch (err) {
        // camera not ready yet — silently ignore
      } finally {
        isDetecting.current = false;
      }
    }, 350); // poll every 350ms — adjust lower if you need faster response
  }, [handleFacesDetected]);

  const stopDetectionLoop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isDetecting.current = false;
  }, []);

  // Start/stop loop with isScanning
  useEffect(() => {
    if (isScanning) {
      startDetectionLoop();
    } else {
      stopDetectionLoop();
    }
    return () => stopDetectionLoop();
  }, [isScanning, startDetectionLoop, stopDetectionLoop]);

  // ── Match found ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (matchedUser) {
      stopDetectionLoop();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Verification Successful",
        `Welcome back, ${matchedUser.full_name}!\nConfidence: ${matchedUser.confidenceScore}%`,
        [
          {
            text: "OK",
            onPress: () => {
              resetVerification();
              setIsScanning(false);
              router.back();
            },
          },
        ],
      );
    }
  }, [matchedUser]);

  // ── Permission gates ─────────────────────────────────────────────────────
  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-10">
        <Text className="text-center font-sans-bold text-lg mb-4">
          We need your permission to show the camera
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

  // ── UI ───────────────────────────────────────────────────────────────────
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

        {/* Scanning Area */}
        <View className="flex-1 items-center justify-center">
          <View
            className="border-2 border-gray-100 rounded-[40px] overflow-hidden bg-gray-50/50 relative"
            style={{ width: s(260), height: s(320) }}
          >
            {isScanning ? (
              <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                facing="front"
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

            {isScanning && !matchedUser && (
              <View
                className="absolute w-full h-0.5 z-10"
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
            )}
          </View>

          <View className="mt-10 px-10">
            <Text className="text-black text-center font-sans-bold text-xl mb-2">
              {isScanning ? verificationFeedback : "Position your face"}
            </Text>
            <Text className="text-gray-500 text-center font-sans-medium">
              {isScanning
                ? "Maintain your position for verification"
                : "Please make sure your face is within the frame for faster verification"}
            </Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View className="px-10 pb-10">
          {!isScanning ? (
            <TouchableOpacity
              onPress={() => setIsScanning(true)}
              className="bg-black py-4 rounded-3xl items-center shadow-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white font-sans-bold text-lg">
                Start Scanning
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setIsScanning(false);
                resetVerification();
              }}
              className="bg-gray-200 py-4 rounded-3xl items-center"
              activeOpacity={0.8}
            >
              <Text className="text-black font-sans-bold text-lg">Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ScanningScreen;
