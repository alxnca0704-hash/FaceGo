import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { vs } from "react-native-size-matters";
import { useEmployeeForm } from "@/lib/hooks/useEmployeeForm";
import { Input } from "./ui/input";

interface EmployeeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (employee: Partial<Employee>) => void;
  initialData?: Employee | null;
}

const EmployeeModal = ({
  isVisible,
  onClose,
  onSave,
  initialData,
}: EmployeeModalProps) => {
  const {
    name,
    setName,
    employeeId,
    setEmployeeId,
    department,
    setDepartment,
    handleSave,
  } = useEmployeeForm({ initialData, isVisible, onSave, onClose });

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      {/* Backdrop — pressing it closes the modal */}
      <TouchableOpacity
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        activeOpacity={1}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Stop press events from bubbling up to the backdrop */}
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View
              className="bg-background rounded-t-[30px] p-6"
              style={{ paddingBottom: vs(40) }}
            >
              <View className="flex-row justify-between items-center mb-6">
                <Text className="font-sans-extrabold text-2xl text-primary">
                  {initialData ? "Edit Employee" : "Add New Employee"}
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Text className="font-sans-semibold text-gray-500">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="mb-4">
                  <Text className="font-sans-semibold mb-2 text-gray-700">
                    Full Name
                  </Text>
                  <Input
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter employee name"
                    className="bg-white border-gray-200 h-12 rounded-xl"
                  />
                </View>

                <View className="mb-4">
                  <Text className="font-sans-semibold mb-2 text-gray-700">
                    Employee ID
                  </Text>
                  <Input
                    value={employeeId}
                    onChangeText={setEmployeeId}
                    placeholder="e.g. EMP-001"
                    className="bg-white border-gray-200 h-12 rounded-xl"
                  />
                </View>

                <View className="mb-8">
                  <Text className="font-sans-semibold mb-2 text-gray-700">
                    Department
                  </Text>
                  <Input
                    value={department}
                    onChangeText={setDepartment}
                    placeholder="e.g. Engineering"
                    className="bg-white border-gray-200 h-12 rounded-xl"
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSave}
                  className="bg-primary h-14 rounded-2xl items-center justify-center shadow-lg"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-sans-bold text-lg">
                    {initialData ? "Save Changes" : "Create Employee"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

export default EmployeeModal;
