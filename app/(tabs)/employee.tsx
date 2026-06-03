import EmployeeCard from "@/components/EmployeeCard";
import EmployeeModal from "@/components/EmployeeModal";
import Searchbar from "@/components/ui/Searchbar";
import FeedbackOverlay from "@/components/ui/FeedbackOverlay";
import { icons } from "@/constant/icons";
import { useEmployees } from "@/lib/hooks/useEmployees";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";

const SafeAreaView = styled(RNSafeAreaView);

type TabType = "users" | "archive" | "departments";

const EmployeeScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [newDeptName, setNewDeptName] = useState("");

  const {
    search,
    setSearch,
    activeEmployees,
    archivedEmployees,
    departments,
    isModalVisible,
    editingEmployee,
    handleOpenAddModal,
    handleEditEmployee,
    handleSaveEmployee,
    archiveEmployee,
    restoreEmployee,
    deleteEmployee,
    addDepartment,
    deleteDepartment,
    closeModal,
    feedbackProps,
  } = useEmployees();

  const handleLongPressActive = (employee: Employee) => {
    Alert.alert(
      "Manage Employee",
      `What would you like to do with ${employee.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Edit", onPress: () => handleEditEmployee(employee) },
        { 
          text: "Archive", 
          onPress: () => archiveEmployee(employee.id) 
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert("Delete", `Are you sure?`, [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: () => deleteEmployee(employee.id) },
            ]);
          },
        },
      ]
    );
  };

  const handleLongPressArchived = (employee: Employee) => {
    Alert.alert(
      "Manage Archived Employee",
      `What would you like to do with ${employee.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Restore", onPress: () => restoreEmployee(employee.id) },
        {
          text: "Delete Permanent",
          style: "destructive",
          onPress: () => deleteEmployee(employee.id),
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={{ paddingHorizontal: s(20), paddingTop: vs(10) }}>
      <View className="flex-row items-center justify-between" style={{ marginBottom: vs(20) }}>
        <Text className="text-black font-sans-extrabold text-4xl">
          Employees
        </Text>
        {activeTab === "users" && (
          <TouchableOpacity onPress={handleOpenAddModal} activeOpacity={0.7}>
            <Image source={icons.add} style={{ width: s(40), height: s(40) }} />
          </TouchableOpacity>
        )}
      </View>

      {/* Custom Tab Bar */}
      <View className="flex-row bg-gray-100 p-1 rounded-2xl mb-6">
        {(["users", "archive", "departments"] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-xl items-center ${
              activeTab === tab ? "bg-white shadow-sm" : ""
            }`}
          >
            <Text
              className={`font-sans-bold text-xs capitalize ${
                activeTab === tab ? "text-primary" : "text-gray-500"
              }`}
            >
              {tab === "users" ? "Add Users" : tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab !== "departments" && (
        <View style={{ marginBottom: vs(20) }}>
          <Searchbar value={search} onChangeText={setSearch} />
        </View>
      )}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <FlatList
            data={activeEmployees}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: s(20), paddingBottom: s(100) }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onLongPress={() => handleLongPressActive(item)}
                delayLongPress={500}
                activeOpacity={0.6}
                style={{ marginBottom: vs(10) }}
              >
                <EmployeeCard {...item} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text className="text-center text-gray-400 mt-5 font-sans-medium">
                No active employees found
              </Text>
            }
          />
        );
      case "archive":
        return (
          <FlatList
            data={archivedEmployees}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: s(20), paddingBottom: s(100) }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onLongPress={() => handleLongPressArchived(item)}
                delayLongPress={500}
                activeOpacity={0.6}
                style={{ marginBottom: vs(10) }}
              >
                <EmployeeCard {...item} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text className="text-center text-gray-400 mt-5 font-sans-medium">
                No archived employees
              </Text>
            }
          />
        );
      case "departments":
        return (
          <View style={{ paddingHorizontal: s(20) }}>
            <View className="flex-row gap-2 mb-6">
              <TextInput
                className="flex-1 bg-white border border-gray-200 h-12 rounded-xl px-4 font-sans-medium"
                placeholder="New department name"
                value={newDeptName}
                onChangeText={setNewDeptName}
              />
              <TouchableOpacity
                onPress={() => {
                  if (newDeptName.trim()) {
                    addDepartment(newDeptName.trim());
                    setNewDeptName("");
                  }
                }}
                className="bg-primary px-6 rounded-xl items-center justify-center"
              >
                <Text className="text-white font-sans-bold">Add</Text>
              </TouchableOpacity>
            </View>

            <View>
              {departments.map((dept) => (
                <View
                  key={dept}
                  className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 border border-gray-100"
                >
                  <Text className="font-sans-bold text-lg text-primary">{dept}</Text>
                  <TouchableOpacity onPress={() => deleteDepartment(dept)}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {renderHeader()}
      {renderContent()}

      <EmployeeModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
      />

      <FeedbackOverlay {...feedbackProps} />
    </SafeAreaView>
  );
};

export default EmployeeScreen;
