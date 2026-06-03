import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  runOnJS,
  interpolate,
  Extrapolate
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { s } from "react-native-size-matters";

export type FeedbackType = "success" | "delete" | "info" | "error";

interface FeedbackOverlayProps {
  visible: boolean;
  type: FeedbackType;
  message: string;
  onFinished: () => void;
}

const Dot = ({ index, color, progress }: { index: number; color: string; progress: Animated.SharedValue<number> }) => {
  const angle = (index * 45) * (Math.PI / 180);
  const distance = s(45);
  
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = interpolate(progress.value, [0, 1], [0.5, 1.2]);
    const translate = progress.value * distance;

    return {
      opacity,
      transform: [
        { translateX: Math.cos(angle) * translate },
        { translateY: Math.sin(angle) * translate },
        { scale }
      ],
    };
  });

  return (
    <Animated.View 
      style={[
        animatedStyle,
        {
          position: 'absolute',
          width: s(6),
          height: s(6),
          borderRadius: s(3),
          backgroundColor: color,
        }
      ]}
    />
  );
};

const FeedbackOverlay = ({ visible, type, message, onFinished }: FeedbackOverlayProps) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const burstProgress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Show animation
      opacity.value = withTiming(1, { duration: 150 });
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      burstProgress.value = withTiming(1, { duration: 600 });

      const timer = setTimeout(() => {
        // Hide animation
        opacity.value = withTiming(0, { duration: 150 }, (finished) => {
          if (finished) {
            runOnJS(onFinished)();
          }
        });
        scale.value = withTiming(0.8, { duration: 150 });
      }, 800); // Shorter duration for "less animation"

      return () => {
        clearTimeout(timer);
        burstProgress.value = 0;
      };
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible && opacity.value === 0) return null;

  const config = {
    success: {
      icon: "checkmark" as const,
      color: "#16a34a",
      bg: "#dcfce7",
    },
    delete: {
      icon: "trash-outline" as const,
      color: "#dc2626",
      bg: "#fee2e2",
    },
    info: {
      icon: "information-circle-outline" as const,
      color: "#2563eb",
      bg: "#dbeafe",
    },
    error: {
      icon: "alert-circle-outline" as const,
      color: "#dc2626",
      bg: "#fee2e2",
    },
  }[type];

  return (
    <View 
      className="absolute inset-0 flex-1 items-center justify-center z-[100]" 
      pointerEvents="none"
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            backgroundColor: "white",
            padding: s(20),
            borderRadius: s(28),
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
            minWidth: s(140),
          }
        ]}
      >
        <View className="items-center justify-center">
          {/* Burst Dots Effect */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Dot key={i} index={i} color={config.color} progress={burstProgress} />
          ))}
          
          <View 
            style={{ 
              backgroundColor: config.bg,
              width: s(54),
              height: s(54),
              borderRadius: s(27),
              alignItems: "center",
              justifyContent: "center",
              marginBottom: s(10),
              zIndex: 10,
            }}
          >
            <Ionicons name={config.icon} size={s(28)} color={config.color} />
          </View>
        </View>
        <Text className="font-sans-bold text-base text-gray-800 text-center">
          {message}
        </Text>
      </Animated.View>
    </View>
  );
};

export default FeedbackOverlay;
