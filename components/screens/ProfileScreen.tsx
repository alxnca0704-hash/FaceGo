import React, { useState } from "react";
import { Text, View } from "react-native";
import { vs } from "react-native-size-matters";
import { darkColors, lightColors } from "@/constant/theme";

const ProfileScreen = () => {
  const [darkMode, setDarkMode] = useState(false); // Assuming dark mode state for demonstration
  const colors = darkMode ? darkColors : lightColors;

  // These values are fixed for an admin-only view as there's no authentication system implemented yet.
  const userName = "admin";
  const userEmail = "system administrator";

  return (
    <View className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
      <View style={{ marginBottom: vs(16) }}>
        <Text
          className="font-sans-semibold"
          style={{ fontSize: vs(18), color: colors.textPrimary }}
        >
          Name:
        </Text>
        <Text
          className="font-sans-regular"
          style={{ fontSize: vs(16), color: colors.textPrimary }}
        >
          {userName}
        </Text>
      </View>
      <View>
        <Text
          className="font-sans-semibold"
          style={{ fontSize: vs(18), color: colors.textPrimary }}
        >
          Email:
        </Text>
        <Text
          className="font-sans-regular"
          style={{ fontSize: vs(16), color: colors.textPrimary }}
        >
          {userEmail}
        </Text>
      </View>
    </View>
  );
};

export default ProfileScreen;
