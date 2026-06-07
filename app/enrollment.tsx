import { icons } from "@/constant/icons";
import { theme } from "@/constant/theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, Alert } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "react-native-size-matters";
import { useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { Camera as FaceDetectorCamera } from "react-native-vision-camera-face-detector";
import { useBiometricEngine, CAPTURE_STAGES } from "@/lib/hooks/useBiometricEngine";
import { FaceLandmarkMesh } from "@/components/FaceLandmarkMesh";
import { saveBiometricLedger, saveUserProfile } from "@/lib/services/database";

const SafeAreaView = styled(RNSafeAreaView);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const EnrollmentScreen = () => {
  const router = useRouter();
  const { name, employeeId, department } = useLocalSearchParams();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const device = useCameraDevice(facing);

  const [cameraLayout, setCameraLayout] = useState({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });

  const handleEnrollmentComplete = (finalProfiles: any[]) => {
    const ledgerResult = saveBiometricLedger(finalProfiles);
    if (ledgerResult.success) {
      if (name && employeeId && department) {
        const userResult = saveUserProfile(
          employeeId as string,
          name as string,
          department as string,
          ledgerResult.id!
        );
        if (userResult.success) {
          Alert.alert("Success", "Employee registered successfully.");
          router.replace("/(tabs)/employee");
          return;
        }
      }
      Alert.alert("Enrollment Complete", "Biometric data saved successfully.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } else {
      Alert.alert("Error", "Failed to save biometric data.");
    }
  };

  const {
    currentStageInfo,
    currentStageIndex,
    activeFaceFrame,
    handleFacesDetected,
    validateAngleGate,
    isProcessingLock,
    resetEnrollment
  } = useBiometricEngine(facing, handleEnrollmentComplete);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  const { isValid, feedback } = validateAngleGate();

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
          <Text className="text-white font-sans-bold text-lg">Enrollment</Text>
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
            isActive={!isProcessingLock}
            onFacesDetected={handleFacesDetected}
            onError={(error) => console.error('Camera Error:', error)}
            runLandmarks={true}
            performanceMode="accurate"
            windowWidth={cameraLayout.width}
            windowHeight={cameraLayout.height}
          />

          <FaceLandmarkMesh 
            face={activeFaceFrame} 
            isLocked={isProcessingLock} 
            windowWidth={cameraLayout.width}
            windowHeight={cameraLayout.height}
            facing={facing}
          />

          {/* Overlay Guideline */}
          <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
             <View 
               className="border-2 rounded-[40px]"
               style={{ 
                 width: s(260), 
                 height: s(320), 
                 borderColor: isValid 
                   ? theme.colors.accent 
                   : activeFaceFrame 
                     ? '#00b0ff' 
                     : 'rgba(255,255,255,0.3)',
                 borderStyle: activeFaceFrame ? 'solid' : 'dashed',
                 backgroundColor: activeFaceFrame ? 'rgba(0,176,255,0.05)' : 'transparent'
               }}
             />
          </View>

          {/* Feedback Overlay */}
          <View className="absolute top-10 left-6 right-6 bg-black/80 p-4 rounded-2xl border border-white/10 items-center">
            <Text className="text-accent font-sans-bold text-xs uppercase mb-1">
              {isProcessingLock ? "PROCESSING" : `STEP ${currentStageIndex + 1} OF ${CAPTURE_STAGES.length}`}
            </Text>
            <Text className="text-white font-sans-medium text-center">
              {isProcessingLock ? "Saving vectors..." : feedback}
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View className="px-10 pb-10 bg-black">
          <View className="bg-surface/10 p-4 rounded-2xl items-center border border-white/10 mb-6">
            <Text className="text-white font-sans-bold text-lg mb-1">{currentStageInfo.instruction}</Text>
            <Text className="text-gray-400 font-sans-medium text-sm text-center">
              Maintain the pose until the scanner locks your biometric signature.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setFacing(prev => prev === 'front' ? 'back' : 'front')}
            className="bg-white/10 py-4 rounded-3xl items-center border border-white/20"
          >
            <Text className="text-white font-sans-bold">Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default EnrollmentScreen;
