import React from "react";
import { Text, View } from "react-native";

const ProfileScreen = () => {
  const userName = "admin";
  const userEmail = "system administrator";

  return (
    <View className="flex-1 p-4">
      <View className="mb-4">
        <Text className="text-lg font-sans-semibold">Name:</Text>
        <Text className="text-base font-sans-regular">{userName}</Text>
      </View>
      <View>
        <Text className="text-lg font-sans-semibold">Email:</Text>
        <Text className="text-base font-sans-regular">{userEmail}</Text>
      </View>
    </View>
  );
};

export default ProfileScreen;
