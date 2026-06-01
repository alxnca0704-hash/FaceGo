import EmployeeCard from "@/components/EmployeeCard";
import EmployeeModal from "@/components/EmployeeModal";
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employeeList.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setIsModalVisible(true);
  };

  const handleSaveEmployee = (data: Partial<Employee>) => {
    if (editingEmployee) {
      // Edit logic
      setEmployeeList(
        employeeList.map((emp) =>
          emp.id === editingEmployee.id ? { ...emp, ...data } : emp,
        ),
      );
      Alert.alert("Success", "Employee updated successfully");
    } else {
      // Add logic
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: data.name!,
        employee_id: data.employee_id!,
        department: data.department!,
        time_in: null,
        time_out: null,
        status: "Inactive",
      };
      setEmployeeList([newEmployee, ...employeeList]);
      Alert.alert("Success", "New employee added successfully");
    }
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
            setEditingEmployee(employee);
            setIsModalVisible(true);
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
              <Text className="text-black font-sans-extrabold text-4xl">
                Employees
              </Text>
              <TouchableOpacity
                onPress={handleOpenAddModal}
                activeOpacity={0.7}
              >
                <Image
                  source={icons.add}
                  style={{ width: s(40), height: s(40) }}
                />
              </TouchableOpacity>
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

      <EmployeeModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
      />
    </SafeAreaView>
  );
};

export default EmployeeScreen;
