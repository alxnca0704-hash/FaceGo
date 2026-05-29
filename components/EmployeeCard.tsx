import clsx from "clsx";
import React from "react";
import { Text, View } from "react-native";
import { vs } from "react-native-size-matters";

const EmployeeCard = ({
  name,
  employee_id,
  time_in,
  time_out,
  status,
}: Employee) => {
  return (
    <View className="border-b-2 border-gray-200 pb-3">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="font-sans-bold" style={{ fontSize: vs(12) }}>
          {name}
        </Text>
        <Text
          className={clsx(
            status === "Present" ? "text-green-700" : "text-red-700",
          )}
        >
          {status}
        </Text>
      </View>
      <Text className="text-gray-400 mb-1">{employee_id}</Text>
      <View className="flex-row justify-start gap-10">
        <Text>Time in: {time_in}</Text>
        <Text>Time out: {time_out}</Text>
      </View>
    </View>
  );
};

export default EmployeeCard;
