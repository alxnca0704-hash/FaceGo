import { useState, useEffect } from "react";
import { Alert } from "react-native";

interface UseEmployeeFormProps {
  initialData?: Employee | null;
  isVisible: boolean;
  onSave: (employee: Partial<Employee>) => void;
  onClose: () => void;
}

export const useEmployeeForm = ({
  initialData,
  isVisible,
  onSave,
  onClose,
}: UseEmployeeFormProps) => {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmployeeId(initialData.employee_id);
      setDepartment(initialData.department);
    } else {
      setName("");
      setEmployeeId("");
      setDepartment("");
    }
  }, [initialData, isVisible]);

  const handleSave = () => {
    if (!name.trim() || !employeeId.trim() || !department.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter a name, employee ID, and department."
      );
      return;
    }
    onSave({
      name: name.trim(),
      employee_id: employeeId.trim(),
      department: department.trim(),
    });
    onClose();
  };

  return {
    name,
    setName,
    employeeId,
    setEmployeeId,
    department,
    setDepartment,
    handleSave,
  };
};
