import { icons } from "@/constant/icons";
import { theme } from "@/constant/theme";
import { cn } from "@/lib/utils";
import React from "react";
import { Image, Text, View } from "react-native";
import { s, vs } from "react-native-size-matters";

interface AttendanceLogItemProps extends Employee {
  isLast?: boolean;
}

const AttendanceLogItem = ({
  name,
  employee_id,
  department,
  time_in,
  time_out,
  status,
  date,
  isLast,
}: AttendanceLogItemProps) => {
  return (
    <View className="flex-row">
      {/* Timeline Left */}
      <View className="items-center" style={{ width: s(40) }}>
        <View
          className={cn(
            "w-3 h-3 rounded-full z-10",
            status === "Present"
              ? "bg-green-500"
              : status === "Absent"
              ? "bg-red-400"
              : "bg-gray-300"
          )}
          style={{ marginTop: vs(8) }}
        />
        {!isLast && (
          <View
            className="w-px bg-gray-200 flex-1"
            style={{ marginTop: vs(-2) }}
          />
        )}
      </View>

      {/* Content Right */}
      <View className="flex-1 pb-8">
        <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-center mb-3">
            <Text
              className="font-sans-bold text-gray-400"
              style={{ fontSize: vs(10) }}
            >
              {date ?? "Today"}
            </Text>
            <View
              className={cn(
                "px-3 py-1 rounded-full",
                status === "Present"
                  ? "bg-green-100"
                  : status === "Absent"
                  ? "bg-red-100"
                  : "bg-gray-100"
              )}
            >
              <Text
                className={cn(
                  "font-sans-semibold",
                  status === "Present"
                    ? "text-green-700"
                    : status === "Absent"
                    ? "text-red-700"
                    : "text-gray-500"
                )}
                style={{ fontSize: vs(10) }}
              >
                {status}
              </Text>
            </View>
          </View>

          <Text className="font-sans-extrabold text-xl mb-1 text-primary">
            {name}
          </Text>
          <View className="flex-row justify-between mb-4">
            <Text
              className="font-sans-medium text-gray-500"
              style={{ fontSize: vs(11) }}
            >
              {employee_id}
            </Text>
            <Text
              className="font-sans-medium text-gray-500"
              style={{ fontSize: vs(11) }}
            >
              {department}
            </Text>
          </View>

          <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-2xl">
            <View className="flex-row items-center" style={{ gap: s(10) }}>
              <View className="bg-green-100 p-2 rounded-xl">
                <Image
                  source={icons.record}
                  style={{
                    width: s(14),
                    height: s(14),
                    tintColor: theme.colors.success,
                  }}
                />
              </View>
              <View>
                <Text
                  className="text-gray-400 font-sans-medium"
                  style={{ fontSize: vs(9) }}
                >
                  TIME IN
                </Text>
                <Text className="font-sans-bold text-black">
                  {time_in ?? "--:--"}
                </Text>
              </View>
            </View>

            <View className="w-px h-8 bg-gray-200 mx-2" />

            <View className="flex-row items-center" style={{ gap: s(10) }}>
              <View className="bg-orange-100 p-2 rounded-xl">
                <Image
                  source={icons.record}
                  style={{
                    width: s(14),
                    height: s(14),
                    tintColor: theme.colors.accent,
                  }}
                />
              </View>
              <View>
                <Text
                  className="text-gray-400 font-sans-medium"
                  style={{ fontSize: vs(9) }}
                >
                  TIME OUT
                </Text>
                <Text className="font-sans-bold text-black">
                  {time_out ?? "--:--"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AttendanceLogItem;
