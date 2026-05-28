import StatsCard from "@/components/StatsCard";
import { STATS } from "@/constant/data";
import { icons } from "@/constant/icons";
import { styled } from "nativewind";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "react-native-size-matters";
const SafeAreaView = styled(RNSafeAreaView);

const dashboard = () => {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <View className="flex-1">
        <View
          className="flex-row items-center justify-between"
          style={{ marginBottom: vs(30) }}
        >
          <Text className="text-accent font-sans-extrabold text-4xl">
            Dashboard
          </Text>
          <Image
            source={icons.burger}
            style={{ width: s(40), height: vs(40) }}
          />
        </View>

        <View>
          <FlatList
            data={STATS}
            renderItem={({ item }) => <StatsCard {...item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={
              <Text className="home-empty-state">No upcoming renewals yet</Text>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default dashboard;
