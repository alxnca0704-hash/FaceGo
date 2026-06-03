import AttendanceLogItem from "@/components/AttendanceLogItem";
import Searchbar from "@/components/ui/Searchbar";
import { colors } from "@/constant/theme";
import { images } from "@/constant/images";
import { useAttendance } from "@/lib/hooks/useAttendance";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { styled } from "nativewind";
import React, { useState } from "react";
import { FlatList, Image, Platform, Pressable, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";

const SafeAreaView = styled(RNSafeAreaView);

const Attendance = () => {
  const { search, setSearch, filteredEmployees, selectedDate, setSelectedDate } = useAttendance();
  const [showPicker, setShowPicker] = useState(false);
  const [pendingDate, setPendingDate] = useState<Date | undefined>(selectedDate);


  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && date) {
        setSelectedDate(date);
      }
    } else {
      // On iOS, just update the pending date while scrolling
      if (date) {
        setPendingDate(date);
      }
    }
  };

  const handleConfirmDate = () => {
    if (pendingDate) {
      setSelectedDate(pendingDate);
    }
    setShowPicker(false);
  };

  const handleOpenPicker = () => {
    setPendingDate(selectedDate || new Date());
    setShowPicker(true);
  };

  const clearDate = () => {
    setSelectedDate(undefined);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

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

            <View style={{ marginBottom: vs(15) }}>
              <Searchbar value={search} onChangeText={setSearch} />
            </View>

            {/* Date Selector */}
            <View className="flex-row items-center justify-between" style={{ marginBottom: vs(25) }}>
              <Pressable 
                onPress={handleOpenPicker}
                className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4 py-3 flex-1 mr-2"
                style={{ height: vs(50) }}
              >
                <Ionicons name="calendar-outline" size={s(20)} color={colors.primary} />
                <Text className="ml-3 font-sans-medium text-gray-700">
                  {selectedDate ? formatDate(selectedDate) : "Select Date"}
                </Text>
              </Pressable>

              {selectedDate && (
                <Pressable 
                  onPress={clearDate}
                  className="bg-muted rounded-xl items-center justify-center"
                  style={{ width: s(50), height: vs(50) }}
                >
                  <Ionicons name="close-outline" size={s(24)} color={colors.accent} />
                </Pressable>
              )}
            </View>

            {showPicker && (
              <View className={Platform.OS === "ios" ? "bg-white rounded-2xl overflow-hidden mb-6 border border-gray-100" : ""}>
                {Platform.OS === "ios" && (
                  <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-100">
                    <TouchableOpacity onPress={() => setShowPicker(false)}>
                      <Text className="font-sans-medium text-gray-500">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleConfirmDate}>
                      <Text className="font-sans-bold text-primary">Done</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <DateTimePicker
                  value={pendingDate || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              </View>
            )}
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
              No activity records found for this selection.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Attendance;
