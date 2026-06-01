import AttendanceLogItem from "@/components/AttendanceLogItem";
import Searchbar from "@/components/ui/Searchbar";
import { employees } from "@/constant/data";
import { images } from "@/constant/images";
import { styled } from "nativewind";
import React, { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "react-native-size-matters";

const SafeAreaView = styled(RNSafeAreaView);

const Attendance = () => {
  const [search, setSearch] = useState("");

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: s(20),
          paddingBottom: s(20),
        }}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View
              className="flex-row items-center"
              style={{ marginBottom: vs(25), gap: s(10) }}
            >
              <Image
                source={images.denr}
                style={{ width: s(40), height: s(40) }}
                resizeMode="contain"
              />
              <Text className="text-black font-sans-extrabold text-4xl">
                Activity Log
              </Text>
            </View>

            <View style={{ marginBottom: vs(25) }}>
              <Searchbar value={search} onChangeText={setSearch} />
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <AttendanceLogItem
            {...item}
            isLast={index === filteredEmployees.length - 1}
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="font-sans-medium text-gray-500">
              No activity records found.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Attendance;
