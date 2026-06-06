import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { vs, s } from "react-native-size-matters";
import { useEmployeeForm } from "@/lib/hooks/useEmployeeForm";
import { Input } from "./ui/input";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constant/theme";
import { getLatestLedgerId } from "@/lib/services/database";

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
  const router = useRouter();
  const [hasCapturedFace, setHasCapturedFace] = useState(false);
  
  const {
    name,
    setName,
    employeeId,
    setEmployeeId,
    department,
    setDepartment,
    handleSave,
    isSaving,
  } = useEmployeeForm({ initialData, isVisible, onSave, onClose });

  // Check for face capture status
  useEffect(() => {
    if (initialData) {
      // In a real app, check if user.ledger_id is set
      setHasCapturedFace(true);
    } else {
      setHasCapturedFace(false);
    }
  }, [initialData, isVisible]);

  const handleCaptureFace = () => {
    // Navigate to enrollment screen
    router.push("/enrollment" as any);
    // We'll assume the user completes capture and returns
    setHasCapturedFace(true); 
  };

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

                <View className="mb-6">
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

                {/* Face Biometrics Section */}
                <View className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <View className="flex-row justify-between items-center mb-4">
                    <View>
                      <Text className="font-sans-bold text-gray-900">Face Biometrics</Text>
                      <Text className="font-sans-medium text-xs text-gray-500">
                        {hasCapturedFace ? "Face data enrolled" : "No face data captured"}
                      </Text>
                    </View>
                    {hasCapturedFace ? (
                      <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    ) : (
                      <Ionicons name="alert-circle" size={24} color="#F59E0B" />
                    )}
                  </View>
                  
                  <TouchableOpacity
                    onPress={handleCaptureFace}
                    className={`py-3 rounded-xl flex-row items-center justify-center gap-2 ${
                      hasCapturedFace ? "bg-gray-200" : "bg-accent"
                    }`}
                  >
                    <Ionicons 
                      name="scan-outline" 
                      size={18} 
                      color={hasCapturedFace ? theme.colors.primary : "white"} 
                    />
                    <Text className={`font-sans-bold ${
                      hasCapturedFace ? "text-primary" : "text-white"
                    }`}>
                      {hasCapturedFace ? "Recapture Face" : "Capture Face"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={handleSave}
                  disabled={isSaving}
                  className="bg-primary h-14 rounded-2xl items-center justify-center shadow-lg"
                  activeOpacity={0.8}
                >
                  {isSaving ? (
                    <View className="flex-row items-center justify-center gap-2">
                      <View className="w-2 h-2 rounded-full bg-white opacity-40" />
                      <View className="w-2 h-2 rounded-full bg-white opacity-70" />
                      <View className="w-2 h-2 rounded-full bg-white" />
                    </View>
                  ) : (
                    <Text className="text-white font-sans-bold text-lg">
                      {initialData ? "Save Changes" : "Create Employee"}
                    </Text>
                  )}
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
