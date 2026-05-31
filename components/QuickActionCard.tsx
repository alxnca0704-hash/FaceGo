import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { s, vs } from "react-native-size-matters";
import { theme } from "@/constant/theme";

const QuickActionCard = ({ title, icon, onPress, backgroundColor }: QuickAction) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="rounded-2xl items-center justify-center"
      style={{
        backgroundColor: backgroundColor || theme.colors.foreground,
        width: s(100),
        height: s(100),
        padding: s(8),
        // Adding a subtle shadow for elevation
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View 
        className="rounded-full items-center justify-center mb-2"
        style={{ 
          width: s(40), 
          height: s(40),
          backgroundColor: theme.colors.background 
        }}
      >
        <Image
          source={icon}
          style={{ width: s(20), height: s(20) }}
          resizeMode="contain"
        />
      </View>
      <Text 
        className="font-sans-semibold text-center text-primary"
        style={{ fontSize: s(11), lineHeight: s(14) }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default QuickActionCard;
