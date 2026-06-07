import * as Haptics from "expo-haptics";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useFeedback } from "./useFeedback";
import { getDbConnection, getLatestLedgerId, saveUserProfile } from "@/lib/services/database";
import { useFocusEffect, useRouter } from "expo-router";

export const useEmployees = () => {
  const router = useRouter();
  const db = getDbConnection();
  const [search, setSearch] = useState("");
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { feedbackProps, showFeedback } = useFeedback();

  const fetchEmployees = useCallback(() => {
    try {
      const records = db.getAllSync<any>(`
        SELECT u.id, u.employee_id, u.full_name as name, u.department, u.is_active, l.profile_data 
        FROM users u
        INNER JOIN enrollment_ledgers l ON u.ledger_id = l.id
        ORDER BY u.full_name ASC
      `);
      
      const formatted = records.map(r => ({
        id: r.id.toString(),
        employee_id: r.employee_id,
        name: r.name,
        department: r.department,
        status: r.is_active === 1 ? "Present" : "Inactive", // Using status mapping
        time_in: null,
        time_out: null
      }));
      setEmployeeList(formatted);
    } catch (error) {
      console.error("DB Fetch Error:", error);
    }
  }, [db]);

  const fetchDepartments = useCallback(() => {
    try {
      const records = db.getAllSync<any>('SELECT name FROM departments ORDER BY name ASC');
      setDepartments(records.map(r => r.name));
    } catch (error) {
      console.error("DB Dept Fetch Error:", error);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      fetchEmployees();
      fetchDepartments();
    }, [fetchEmployees, fetchDepartments])
  );

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

  const handleSaveEmployee = async (data: Partial<Employee>) => {
    if (editingEmployee) {
      try {
        db.runSync(
          'UPDATE users SET full_name = ?, department = ? WHERE id = ?',
          [data.name!, data.department!, editingEmployee.id]
        );
        fetchEmployees();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showFeedback("success", "Employee Updated");
      } catch (e) {
        showFeedback("error", "Update Failed");
      }
    } else {
      // For NEW employee, we need a ledger_id
      const latestLedgerId = getLatestLedgerId();
      if (!latestLedgerId) {
        router.push("/enrollment");
        showFeedback("error", "Capture face biometrics first");
        return;
      }

      try {
        saveUserProfile(data.employee_id!, data.name!, data.department!, latestLedgerId);
        fetchEmployees();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showFeedback("success", "Employee Created");
      } catch (e) {
        showFeedback("error", "Creation Failed");
      }
    }
  };

  const archiveEmployee = (id: string) => {
    try {
      db.runSync('UPDATE users SET is_active = 0 WHERE id = ?', [id]);
      fetchEmployees();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showFeedback("success", "Employee Archived");
    } catch (e) {
      showFeedback("error", "Archive Failed");
    }
  };

  const restoreEmployee = (id: string) => {
    try {
      db.runSync('UPDATE users SET is_active = 1 WHERE id = ?', [id]);
      fetchEmployees();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showFeedback("success", "Employee Restored");
    } catch (e) {
      showFeedback("error", "Restore Failed");
    }
  };

  const deleteEmployee = (id: string) => {
    try {
      db.runSync('DELETE FROM users WHERE id = ?', [id]);
      fetchEmployees();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      showFeedback("delete", "Employee Deleted");
    } catch (e) {
      showFeedback("error", "Delete Failed");
    }
  };

  const addDepartment = (name: string) => {
    try {
      db.runSync('INSERT INTO departments (name) VALUES (?)', [name]);
      fetchDepartments();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showFeedback("success", "Department Added");
    } catch (error) {
      showFeedback("error", "Department already exists");
    }
  };

  const deleteDepartment = (name: string) => {
    const affectedEmployees = employeeList.filter(emp => emp.department === name);
    if (affectedEmployees.length > 0) {
      showFeedback("error", `Cannot delete: Department is in use`);
      return;
    }
    try {
      db.runSync('DELETE FROM departments WHERE name = ?', [name]);
      fetchDepartments();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      showFeedback("delete", "Department Deleted");
    } catch (e) {
      showFeedback("error", "Delete Failed");
    }
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
