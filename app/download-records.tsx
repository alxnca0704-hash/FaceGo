import { icons } from "@/constant/icons";
import { theme, colors } from "@/constant/theme";
import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useState, useMemo } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "react-native-size-matters";
import { employees } from "@/constant/data";
import { Ionicons } from "@expo/vector-icons";

const SafeAreaView = styled(RNSafeAreaView);

const DownloadRecordsScreen = () => {
  const router = useRouter();
  const [selectedFormat, setSelectedFormat] = useState("PDF");
  const [selectedRange, setSelectedRange] = useState("This Week");
  const [exportType, setExportType] = useState<"All" | "Department" | "Individual">("All");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const formats = ["PDF", "CSV", "Excel"];
  const ranges = ["Today", "This Week", "This Month", "Custom Range"];
  
  const departments = useMemo(() => {
    return Array.from(new Set(employees.map(e => e.department))).sort();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 mb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white p-3 rounded-full shadow-sm border border-gray-100"
        >
          <Ionicons name="arrow-back" size={s(20)} color={colors.primary} />
        </TouchableOpacity>
        <Text className="text-black font-sans-extrabold text-3xl ml-4">
          Export Records
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: s(24),
          paddingBottom: vs(40),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Export Scope */}
        <View className="mb-8 mt-4">
          <Text className="font-sans-bold text-lg mb-4 text-primary">
            Export Scope
          </Text>
          <View className="flex-row bg-white rounded-3xl p-1 border border-gray-100 shadow-sm">
            {(["All", "Department", "Individual"] as const).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setExportType(type)}
                className={cn(
                  "flex-1 py-3 rounded-2xl items-center",
                  exportType === type ? "bg-black" : "bg-transparent",
                )}
              >
                <Text
                  className={cn(
                    "font-sans-bold",
                    exportType === type ? "text-white" : "text-gray-500",
                  )}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Conditional Selections */}
        {exportType === "Department" && (
          <View className="mb-8">
            <Text className="font-sans-bold text-lg mb-4 text-primary">
              Select Department
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {departments.map((dept) => (
                <TouchableOpacity
                  key={dept}
                  onPress={() => setSelectedDept(dept)}
                  className={cn(
                    "px-6 py-3 rounded-2xl border",
                    selectedDept === dept
                      ? "bg-accent border-accent"
                      : "bg-white border-gray-100",
                  )}
                >
                  <Text
                    className={cn(
                      "font-sans-semibold",
                      selectedDept === dept ? "text-white" : "text-gray-500",
                    )}
                  >
                    {dept}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {exportType === "Individual" && (
          <View className="mb-8">
            <Text className="font-sans-bold text-lg mb-4 text-primary">
              Select Employee
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="flex-row gap-3"
              contentContainerStyle={{ gap: s(12) }}
            >
              {employees.map((emp) => (
                <TouchableOpacity
                  key={emp.id}
                  onPress={() => setSelectedEmployee(emp.id)}
                  className={cn(
                    "px-5 py-4 rounded-3xl border items-center justify-center min-w-30",
                    selectedEmployee === emp.id
                      ? "bg-accent border-accent"
                      : "bg-white border-gray-100",
                  )}
                >
                  <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-2">
                    <Ionicons name="person" size={s(18)} color={selectedEmployee === emp.id ? colors.accent : colors.primary} />
                  </View>
                  <Text
                    className={cn(
                      "font-sans-bold text-center",
                      selectedEmployee === emp.id ? "text-white" : "text-gray-900",
                    )}
                  >
                    {(emp?.name || 'Unknown').split(' ')[0]}
                  </Text>
                  <Text
                    className={cn(
                      "font-sans-medium",
                      selectedEmployee === emp.id ? "text-white/70" : "text-gray-400",
                    )}
                    style={{ fontSize: vs(10) }}
                  >
                    {emp.employee_id}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Date Range Selection */}
        <View className="mb-8">
          <Text className="font-sans-bold text-lg mb-4 text-primary">
            Select Date Range
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {ranges.map((range) => (
              <TouchableOpacity
                key={range}
                onPress={() => setSelectedRange(range)}
                className={cn(
                  "px-6 py-3 rounded-2xl border",
                  selectedRange === range
                    ? "bg-black border-black"
                    : "bg-white border-gray-100",
                )}
              >
                <Text
                  className={cn(
                    "font-sans-semibold",
                    selectedRange === range ? "text-white" : "text-gray-500",
                  )}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Format Selection */}
        <View className="mb-8">
          <Text className="font-sans-bold text-lg mb-4 text-primary">
            File Format
          </Text>
          <View className="flex-row gap-4">
            {formats.map((format) => (
              <TouchableOpacity
                key={format}
                onPress={() => setSelectedFormat(format)}
                className={cn(
                  "flex-1 items-center py-5 rounded-3xl border",
                  selectedFormat === format
                    ? "bg-black border-black"
                    : "bg-white border-gray-100",
                )}
              >
                <View
                  className={cn(
                    "w-12 h-12 rounded-2xl items-center justify-center mb-2",
                    selectedFormat === format ? "bg-white/20" : "bg-gray-50",
                  )}
                >
                  <Image
                    source={icons.record}
                    style={{
                      width: s(20),
                      height: s(20),
                      tintColor:
                        selectedFormat === format
                          ? theme.colors.foreground
                          : theme.colors.primary,
                    }}
                  />
                </View>
                <Text
                  className={cn(
                    "font-sans-bold",
                    selectedFormat === format ? "text-white" : "text-gray-900",
                  )}
                >
                  {format}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          className="bg-black py-5 rounded-[30px] items-center shadow-xl mt-4"
          activeOpacity={0.8}
        >
          <Text className="text-white font-sans-extrabold text-lg">
            Generate {selectedFormat} Report
          </Text>
        </TouchableOpacity>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DownloadRecordsScreen;
