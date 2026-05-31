import { icons } from "@/constant/icons";
import { theme } from "@/constant/theme";
import React from "react";
import { Image, View } from "react-native";
import { s, vs } from "react-native-size-matters";
import { Input } from "./input";

interface SearchbarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const Searchbar = ({ value, onChangeText, placeholder = "Search employees..." }: SearchbarProps) => {
  return (
    <View 
      className="flex-row items-center bg-white rounded-2xl px-4 border border-gray-100"
      style={{ height: vs(45) }}
    >
      <Image
        source={icons.person}
        style={{ width: s(18), height: s(18), tintColor: theme.colors.mutedForeground }}
      />
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="flex-1 border-0 bg-transparent h-full font-sans-medium"
        style={{ fontSize: s(14) }}
        placeholderTextColor={theme.colors.mutedForeground}
      />
    </View>
  );
};

export default Searchbar;
