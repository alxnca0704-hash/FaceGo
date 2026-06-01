import { theme } from "@/constant/theme";
import { cn } from "@/lib/utils";
import React from "react";
import { Text, View } from "react-native";
import { vs } from "react-native-size-matters";

const EmployeeCard = ({
  name,
  employee_id,
  department,
  time_in,
  time_out,
  status,
}: Employee) => {
  return (
    <View
      className="border-b-2 pb-3"
      style={{ borderBottomColor: theme.colors.border }}
    >
      <View className="flex-row items-center justify-between mb-1">
        <Text
          className="font-sans-bold"
          style={{ fontSize: vs(12), color: theme.colors.primary }}
        >
          {name}
        </Text>
        <Text
          className={cn(
            status === "Present"
              ? "text-green-700"
              : status === "Absent"
              ? "text-red-700"
              : "text-gray-500"
          )}
          style={{
            color:
              status === "Present"
                ? theme.colors.success
                : status === "Absent"
                ? theme.colors.destructive
                : theme.colors.mutedForeground,
          }}
        >
          {status}
        </Text>
      </View>
      <View className="flex-row justify-between mb-1">
        <Text style={{ color: theme.colors.mutedForeground }}>
          {employee_id}
        </Text>
        <Text style={{ color: theme.colors.mutedForeground }}>
          {department}
        </Text>
      </View>
      <View className="flex-row justify-start gap-10">
        <Text style={{ color: theme.colors.primary }}>
          Time in: {time_in ?? "N/A"}
        </Text>
        <Text style={{ color: theme.colors.primary }}>
          Time out: {time_out ?? "N/A"}
        </Text>
      </View>
    </View>
  );
};

export default EmployeeCard;
