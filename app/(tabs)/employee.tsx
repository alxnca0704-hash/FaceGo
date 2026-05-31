import EmployeeCard from "@/components/EmployeeCard";
import Searchbar from "@/components/ui/Searchbar";
import { employees as initialEmployees } from "@/constant/data";
import { icons } from "@/constant/icons";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "react-native-size-matters";

const SafeAreaView = styled(RNSafeAreaView);

const EmployeeScreen = () => {
  const [search, setSearch] = useState("");
  const [employeeList, setEmployeeList] = useState(initialEmployees);

  const filteredEmployees = employeeList.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddEmployee = () => {
    // Basic implementation for now - in a real app this would open a form
    const newId = (employeeList.length + 1).toString();
    const newEmployee: Employee = {
      id: newId,
      employee_id: `EMP-00${newId}`,
      name: `New Employee ${newId}`,
      time_in: null,
      time_out: null,
      status: "Absent",
    };
    setEmployeeList([newEmployee, ...employeeList]);
    Alert.alert("Success", "New employee added (Placeholder data)");
  };

  const handleLongPress = (employee: Employee) => {
    Alert.alert(
      "Manage Employee",
      `What would you like to do with ${employee.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Edit",
          onPress: () => {
            // Placeholder for edit logic
            Alert.alert(
              "Edit",
              `Editing ${employee.name} (Logic not implemented yet)`,
            );
          },
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Delete",
              `Are you sure you want to delete ${employee.name}?`,
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    setEmployeeList(
                      employeeList.filter((e) => e.id !== employee.id),
                    );
                  },
                },
              ],
            );
          },
        },
      ],
    );
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
              className="flex-row items-center justify-between "
              style={{ marginBottom: vs(30) }}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-black font-sans-extrabold text-4xl">
                  Employees
                </Text>
                <TouchableOpacity onPress={handleAddEmployee}>
                  <Image
                    source={icons.person} // Using person icon as a substitute for "add" icon if not available
                    style={{ width: s(24), height: s(24), tintColor: "black" }}
                  />
                </TouchableOpacity>
              </View>
              <Image
                source={icons.burger}
                style={{ width: s(40), height: vs(40) }}
              />
            </View>

            <View style={{ marginBottom: vs(20) }}>
              <Searchbar value={search} onChangeText={setSearch} />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => handleLongPress(item)}
            delayLongPress={500}
            activeOpacity={0.6}
            style={{ marginBottom: vs(10) }}
          >
            <EmployeeCard {...item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 mt-5 font-sans-medium">
            No employees found
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default EmployeeScreen;
