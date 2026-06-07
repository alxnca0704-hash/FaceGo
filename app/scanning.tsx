import { FaceLandmarkMesh } from "@/components/FaceLandmarkMesh";
import { icons } from "@/constant/icons";
import { theme } from "@/constant/theme";
import { useVerificationEngine } from "@/lib/hooks/useVerificationEngine";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { s } from "react-native-size-matters";
import {
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { Camera as FaceDetectorCamera } from "react-native-vision-camera-face-detector";

const SafeAreaView = styled(RNSafeAreaView);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ScanningScreen = () => {
  const router = useRouter();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [facing, setFacing] = useState<"front" | "back">("front");
  const device = useCameraDevice(facing);

  const [cameraLayout, setCameraLayout] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });

  const {
    activeFaceFrame,
    isProcessingLock,
    matchedUser,
    verificationFeedback,
    handleFacesDetected,
    resetVerification,
  } = useVerificationEngine();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  useEffect(() => {
    if (matchedUser) {
      const timer = setTimeout(() => {
        resetVerification();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [matchedUser]);

  if (!device) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-gray-100/20 p-3 rounded-full"
          >
            <Image
              source={icons.home}
              style={{
                width: s(20),
                height: s(20),
                tintColor: "white",
              }}
            />
          </TouchableOpacity>
          <Text className="text-white font-sans-bold text-lg">
            Verification
          </Text>
          <View style={{ width: s(44) }} />
        </View>

        {/* Camera */}
        <View
          className="flex-1 relative overflow-hidden"
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setCameraLayout({ width, height });
          }}
        >
          <FaceDetectorCamera
            style={{ flex: 1 }}
            device={device}
            isActive={!matchedUser}
            onFacesDetected={handleFacesDetected}
            onError={(error) => console.error("Camera Error:", error)}
            runLandmarks={true}
            performanceMode="fast"
            windowWidth={cameraLayout.width}
            windowHeight={cameraLayout.height}
          />

          <FaceLandmarkMesh
            face={activeFaceFrame}
            isLocked={!!matchedUser}
            windowWidth={cameraLayout.width}
            windowHeight={cameraLayout.height}
            facing={facing}
          />

          {/* Overlay Guideline */}
          <View
            className="absolute inset-0 items-center justify-center"
            pointerEvents="none"
          >
            <View
              className="border-2 rounded-[40px]"
              style={{
                width: s(260),
                height: s(320),
                borderColor: matchedUser
                  ? theme.colors.accent
                  : activeFaceFrame 
                    ? '#00b0ff' // Blue when face is detected
                    : "rgba(255,255,255,0.3)",
                borderStyle: activeFaceFrame ? 'solid' : 'dashed',
                backgroundColor: activeFaceFrame ? 'rgba(0,176,255,0.05)' : 'transparent'
              }}
            />
          </View>

          {/* Feedback Overlay */}
          {!matchedUser && (
            <View className="absolute top-10 left-6 right-6 bg-black/80 p-4 rounded-2xl border border-white/10 items-center">
              <Text className="text-accent font-sans-bold text-xs uppercase mb-1">
                SCANNING
              </Text>
              <Text className="text-white font-sans-medium text-center">
                {verificationFeedback}
              </Text>
            </View>
          )}
        </View>

        {/* Result Overlay - Displayed when matchedUser is not null */}
        {matchedUser && (
          <View className="absolute inset-0 bg-black/90 items-center justify-center p-8 z-50">
            <View className="bg-white p-6 rounded-[32px] w-full items-center">
              <View className="bg-accent/10 p-4 rounded-full mb-4">
                <Image
                  source={icons.verified}
                  style={{
                    width: s(40),
                    height: s(40),
                    tintColor: theme.colors.accent,
                  }}
                />
              </View>
              <Text className="text-accent font-sans-bold text-xl mb-4">
                Attendance Recorded
              </Text>

              <View className="w-full gap-4 mb-6">
                <View>
                  <Text className="text-gray-400 text-xs uppercase font-sans-medium">
                    Employee
                  </Text>
                  <Text className="text-black text-lg font-sans-bold">
                    {matchedUser.fullName}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-400 text-xs uppercase font-sans-medium">
                    ID Number
                  </Text>
                  <Text className="text-primary font-sans-bold">
                    {matchedUser.employeeId}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-400 text-xs uppercase font-sans-medium">
                    Timestamp
                  </Text>
                  <Text className="text-black font-sans-medium">
                    {matchedUser.timestamp}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-500 font-sans-medium italic text-center">
                Step away to reset terminal...
              </Text>
            </View>
          </View>
        )}

        {/* Bottom Actions */}
        {!matchedUser && (
          <View className="px-10 pb-10">
            <TouchableOpacity
              onPress={() =>
                setFacing((prev) => (prev === "front" ? "back" : "front"))
              }
              className="bg-white/10 py-4 rounded-3xl items-center border border-white/20 mb-4"
            >
              <Text className="text-white font-sans-bold">Flip Camera</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default ScanningScreen;
