import EmployeeCard from "@/components/EmployeeCard";
import QuickActionCard from "@/components/QuickActionCard";
import StatsCard from "@/components/StatsCard";
import { employees, QUICK_ACTIONS, STATS } from "@/constant/data";
import { icons } from "@/constant/icons";
import { images } from "@/constant/images";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "react-native-size-matters";

const SafeAreaView = styled(RNSafeAreaView);

const dashboard = () => {
  const router = useRouter();

  const handleQuickAction = (id: string) => {
    if (id === "face-scan") {
      router.push("/scanning");
    } else if (id === "download-records") {
      router.push("/download-records");
    } else if (id === "add-employee") {
      router.push("/(tabs)/employee");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background pb-1" edges={["top"]}>
      <FlatList
        data={employees.slice(0, 5)}
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
              className="flex-row items-center justify-between"
              style={{ marginBottom: vs(30) }}
            >
              <View className="flex-row items-center" style={{ gap: s(10) }}>
                <Image
                  source={images.denr}
                  style={{ width: s(40), height: s(40) }}
                  resizeMode="contain"
                />
                <Text className="text-black font-sans-extrabold text-4xl">
                  Dashboard
                </Text>
              </View>
              <Image
                source={icons.burger}
                style={{ width: s(40), height: vs(40) }}
              />
            </View>

            {/* Stats Cards */}
            <View className="mb-8">
              <FlatList
                data={STATS}
                renderItem={({ item }) => <StatsCard {...item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No Registered Account
                  </Text>
                }
              />
            </View>

            {/* Quick Actions */}
            <View className="mb-8">
              <Text className="font-extrabold mb-4" style={{ fontSize: s(20) }}>
                Quick Actions
              </Text>
              <View className="flex-row justify-between">
                {QUICK_ACTIONS.map((action) => (
                  <QuickActionCard
                    key={action.id}
                    {...action}
                    onPress={() => handleQuickAction(action.id)}
                  />
                ))}
              </View>
            </View>

            {/* Recent Activity Header */}
            <View className="flex-row justify-between items-center mb-5">
              <Text className="font-extrabold" style={{ fontSize: s(20) }}>
                Recent Activity
              </Text>
              <TouchableOpacity
                className="bg-black justify-between items-center"
                style={{
                  paddingVertical: vs(5),
                  paddingHorizontal: s(15),
                  borderRadius: s(30),
                }}
              >
                <Text
                  className="text-background font-bold"
                  style={{ fontSize: vs(12) }}
                >
                  See All
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={{ marginBottom: vs(10) }}>
            <EmployeeCard {...item} />
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 mt-5">
            No employees found
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default dashboard;
