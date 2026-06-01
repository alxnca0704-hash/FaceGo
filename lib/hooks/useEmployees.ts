import { employees as initialEmployees } from "@/constant/data";
import { useState, useMemo } from "react";
import { Alert } from "react-native";

export const useEmployees = () => {
  const [search, setSearch] = useState("");
  const [employeeList, setEmployeeList] = useState(initialEmployees);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const filteredEmployees = useMemo(() => {
    return employeeList.filter(
      (emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase())
    );
  }, [employeeList, search]);

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setIsModalVisible(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSaveEmployee = (data: Partial<Employee>) => {
    if (editingEmployee) {
      setEmployeeList((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id ? { ...emp, ...data } : emp
        )
      );
      Alert.alert("Success", "Employee updated successfully");
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: data.name!,
        employee_id: data.employee_id!,
        department: data.department!,
        time_in: null,
        time_out: null,
        status: "Inactive",
      };
      setEmployeeList((prev) => [newEmployee, ...prev]);
      Alert.alert("Success", "New employee added successfully");
    }
  };

  const deleteEmployee = (id: string) => {
    setEmployeeList((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    search,
    setSearch,
    filteredEmployees,
    isModalVisible,
    editingEmployee,
    handleOpenAddModal,
    handleEditEmployee,
    handleSaveEmployee,
    deleteEmployee,
    closeModal,
  };
};
