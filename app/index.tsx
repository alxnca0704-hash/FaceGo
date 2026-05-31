import { images } from "@/constant/images";
import { theme } from "@/constant/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { s, vs } from "react-native-size-matters";

const PIN_LENGTH = 4;
const CORRECT_PIN = "1234";

export default function Index() {
  const router = useRouter();
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      if (pin === CORRECT_PIN) {
        router.replace("/(tabs)/dashboard");
      } else {
        Alert.alert("Incorrect PIN", "Please try again.", [
          { text: "OK", onPress: () => setPin("") },
        ]);
      }
    }
  }, [pin, router]);

  const handlePress = (digit: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const KeypadButton = ({
    value,
    onPress,
    isDelete = false,
    isEmpty = false,
  }: {
    value?: string;
    onPress?: () => void;
    isDelete?: boolean;
    isEmpty?: boolean;
  }) => {
    if (isEmpty) return <View style={{ width: s(70), height: s(70) }} />;

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="items-center justify-center rounded-full"
        style={{
          width: s(70),
          height: s(70),
          backgroundColor: isDelete ? "transparent" : theme.colors.foreground,
        }}
      >
        {isDelete ? (
          <Ionicons
            name="close-circle-outline"
            size={vs(32)}
            color={theme.colors.destructive}
          />
        ) : (
          <Text
            className="text-primary font-sans-bold"
            style={{ fontSize: vs(24) }}
          >
            {value}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      className="flex-1 bg-background px-6 justify-center items-center"
      style={{ paddingTop: vs(40) }}
    >
      {/* Logo */}
      <View className="mb-6" style={{ width: s(120), height: s(120) }}>
        <Image
          source={images.denr}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>

      {/* Header */}
      <View className="items-center mb-10">
        <Text
          className="text-primary font-sans-extrabold text-center"
          style={{ fontSize: vs(28) }}
        >
          DENR Facego
        </Text>
        <Text
          className="text-primary font-sans-bold text-center mt-1"
          style={{ fontSize: vs(20) }}
        >
          Attendance
        </Text>
      </View>

      {/* PIN Indicators */}
      <View className="flex-row gap-5 mb-16">
        {[...Array(PIN_LENGTH)].map((_, i) => (
          <View
            key={i}
            className="rounded-full border-2 border-primary"
            style={{
              width: s(18),
              height: s(18),
              backgroundColor:
                i < pin.length ? theme.colors.primary : "transparent",
            }}
          />
        ))}
      </View>

      {/* Keypad */}
      <View className="w-full max-w-[320px]" style={{ gap: vs(15) }}>
        <View className="flex-row justify-between">
          {["1", "2", "3"].map((n) => (
            <KeypadButton key={n} value={n} onPress={() => handlePress(n)} />
          ))}
        </View>
        <View className="flex-row justify-between">
          {["4", "5", "6"].map((n) => (
            <KeypadButton key={n} value={n} onPress={() => handlePress(n)} />
          ))}
        </View>
        <View className="flex-row justify-between">
          {["7", "8", "9"].map((n) => (
            <KeypadButton key={n} value={n} onPress={() => handlePress(n)} />
          ))}
        </View>
        <View className="flex-row justify-between items-center">
          <KeypadButton isEmpty />
          <KeypadButton value="0" onPress={() => handlePress("0")} />
          <KeypadButton isDelete onPress={handleDelete} />
        </View>
      </View>
    </View>
  );
}
