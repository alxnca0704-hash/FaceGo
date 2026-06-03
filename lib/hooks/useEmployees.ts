import { employees as initialEmployees } from "@/constant/data";
import * as Haptics from "expo-haptics";
import { useState, useMemo } from "react";
import { useFeedback } from "./useFeedback";

export const useEmployees = () => {
  const [search, setSearch] = useState("");
  const [employeeList, setEmployeeList] = useState(initialEmployees);
  const [departments, setDepartments] = useState<string[]>([
    "Engineering",
    "Marketing",
    "Sales",
    "Human Resources",
    "Design",
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { feedbackProps, showFeedback } = useFeedback();

  const activeEmployees = useMemo(() => {
    return employeeList.filter((emp) => emp.status !== "Inactive" && (
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase())
    ));
  }, [employeeList, search]);

  const archivedEmployees = useMemo(() => {
    return employeeList.filter((emp) => emp.status === "Inactive" && (
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase())
    ));
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showFeedback("success", "Employee Updated");
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: data.name!,
        employee_id: data.employee_id!,
        department: data.department!,
        time_in: null,
        time_out: null,
        status: "Absent", // Default to Absent/Active
      };
      setEmployeeList((prev) => [newEmployee, ...prev]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showFeedback("success", "Employee Created");
    }
  };

  const archiveEmployee = (id: string) => {
    setEmployeeList((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, status: "Inactive" } : emp
      )
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showFeedback("success", "Employee Archived");
  };

  const restoreEmployee = (id: string) => {
    setEmployeeList((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, status: "Absent" } : emp
      )
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showFeedback("success", "Employee Restored");
  };

  const deleteEmployee = (id: string) => {
    setEmployeeList((prev) => prev.filter((e) => e.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showFeedback("delete", "Employee Deleted");
  };

  const addDepartment = (name: string) => {
    if (!departments.includes(name)) {
      setDepartments((prev) => [...prev, name]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showFeedback("success", "Department Added");
    }
  };

  const deleteDepartment = (name: string) => {
    setDepartments((prev) => prev.filter((d) => d !== name));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showFeedback("delete", "Department Deleted");
  };

  return {
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
  };
};
