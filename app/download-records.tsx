import { icons } from "@/constant/icons";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "react-native-size-matters";

const SafeAreaView = styled(RNSafeAreaView);

const DownloadRecordsScreen = () => {
  const router = useRouter();
  const [selectedFormat, setSelectedFormat] = useState("PDF");
  const [selectedRange, setSelectedRange] = useState("This Week");

  const formats = ["PDF", "CSV", "Excel"];
  const ranges = ["Today", "This Week", "This Month", "Custom Range"];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 mb-6">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-white p-3 rounded-full shadow-sm border border-gray-100"
        >
          <Image 
            source={icons.home} 
            style={{ width: s(20), height: s(20), tintColor: 'black' }} 
          />
        </TouchableOpacity>
        <Text className="text-black font-sans-extrabold text-3xl ml-4">Export Records</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: s(24), paddingBottom: vs(40) }}>
        {/* Date Range Selection */}
        <View className="mb-8">
          <Text className="font-sans-bold text-lg mb-4 text-primary">Select Date Range</Text>
          <View className="flex-row flex-wrap gap-3">
            {ranges.map((range) => (
              <TouchableOpacity
                key={range}
                onPress={() => setSelectedRange(range)}
                className={`px-6 py-3 rounded-2xl border ${
                  selectedRange === range 
                    ? "bg-black border-black" 
                    : "bg-white border-gray-100"
                }`}
              >
                <Text className={`font-sans-semibold ${
                  selectedRange === range ? "text-white" : "text-gray-500"
                }`}>
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Format Selection */}
        <View className="mb-8">
          <Text className="font-sans-bold text-lg mb-4 text-primary">File Format</Text>
          <View className="flex-row gap-4">
            {formats.map((format) => (
              <TouchableOpacity
                key={format}
                onPress={() => setSelectedFormat(format)}
                className={`flex-1 items-center py-5 rounded-3xl border ${
                  selectedFormat === format 
                    ? "bg-black border-black" 
                    : "bg-white border-gray-100"
                }`}
              >
                <View className={`w-12 h-12 rounded-2xl items-center justify-center mb-2 ${
                   selectedFormat === format ? "bg-white/20" : "bg-gray-50"
                }`}>
                  <Image 
                    source={icons.record} 
                    style={{ 
                      width: s(20), 
                      height: s(20), 
                      tintColor: selectedFormat === format ? 'white' : 'black' 
                    }} 
                  />
                </View>
                <Text className={`font-sans-bold ${
                  selectedFormat === format ? "text-white" : "text-gray-900"
                }`}>
                  {format}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Downloads Section */}
        <View className="mb-10">
          <Text className="font-sans-bold text-lg mb-4 text-primary">Recent Exports</Text>
          {[1, 2].map((i) => (
            <View key={i} className="flex-row items-center bg-white p-4 rounded-3xl border border-gray-50 mb-3">
              <View className="bg-green-50 p-3 rounded-2xl mr-4">
                <Image source={icons.record} style={{ width: s(18), height: s(18), tintColor: '#15803d' }} />
              </View>
              <View className="flex-1">
                <Text className="font-sans-bold text-gray-900">Attendance_Report_May.pdf</Text>
                <Text className="font-sans-medium text-gray-400" style={{ fontSize: vs(10) }}>2.4 MB • May 28, 2026</Text>
              </View>
              <TouchableOpacity className="p-2">
                <Image source={icons.verified} style={{ width: s(20), height: s(20), tintColor: '#000' }} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          className="bg-black py-5 rounded-[30px] items-center shadow-xl"
          activeOpacity={0.8}
        >
          <Text className="text-white font-sans-extrabold text-lg">Download Records</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DownloadRecordsScreen;
