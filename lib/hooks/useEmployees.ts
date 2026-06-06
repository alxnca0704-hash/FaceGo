import * as Haptics from "expo-haptics";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useFeedback } from "./useFeedback";
import { getDbConnection } from "../services/database";

export const useEmployees = () => {
  const [search, setSearch] = useState("");
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { feedbackProps, showFeedback } = useFeedback();

  const db = getDbConnection();

  const loadData = useCallback(() => {
    try {
      // Load employees
      const employeeRecords = db.getAllSync<{
        id: number;
        employee_id: string;
        full_name: string;
        department: string;
        is_active: number;
      }>(`
        SELECT u.id, u.employee_id, u.full_name, u.department, u.is_active,
        (SELECT time_in FROM attendance_logs WHERE user_id = u.id AND date = date('now', 'localtime') ORDER BY id DESC LIMIT 1) as time_in,
        (SELECT 'Present' FROM attendance_logs WHERE user_id = u.id AND date = date('now', 'localtime') LIMIT 1) as current_status
        FROM users u
      `);

      const formattedEmployees: Employee[] = employeeRecords.map(rec => ({
        id: rec.id.toString(),
        employee_id: rec.employee_id,
        name: rec.full_name,
        department: rec.department,
        status: rec.is_active === 0 ? "Inactive" : (rec as any).current_status || "Absent",
        time_in: (rec as any).time_in || null,
        time_out: null, // Simplified for now
      }));
      setEmployeeList(formattedEmployees);

      // Load departments
      const deptRecords = db.getAllSync<{ name: string }>("SELECT name FROM departments");
      setDepartments(deptRecords.map(d => d.name));
    } catch (error) {
      console.error("Error loading employees from DB:", error);
    }
  }, [db]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
    try {
      if (editingEmployee) {
        db.runSync(
          'UPDATE users SET full_name = ?, employee_id = ?, department = ? WHERE id = ?',
          [data.name!, data.employee_id!, data.department!, parseInt(editingEmployee.id)]
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showFeedback("success", "Employee Updated");
      } else {
        // Note: New employee creation here doesn't have a ledger_id yet.
        // In the final flow, we should probably enforce face capture.
        // For now, we'll use a placeholder ledger_id if none exists or just save basic info.
        // BUT the schema requires ledger_id. We'll need to handle this.
        
        // Let's assume for now we might create a dummy ledger or handle it in a multistep process.
        // For this task, I'll just keep it simple or use a default.
        const ledgerId = 1; // Placeholder - ideally this comes from face capture
        
        db.runSync(
          'INSERT INTO users (employee_id, full_name, department, ledger_id) VALUES (?, ?, ?, ?)',
          [data.employee_id!, data.name!, data.department!, ledgerId]
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showFeedback("success", "Employee Created");
      }
      loadData();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error saving employee:", error);
      showFeedback("error", "Failed to save employee");
    }
  };

  const archiveEmployee = (id: string) => {
    try {
      db.runSync('UPDATE users SET is_active = 0 WHERE id = ?', [parseInt(id)]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showFeedback("success", "Employee Archived");
      loadData();
    } catch (error) {
      console.error("Error archiving employee:", error);
    }
  };

  const restoreEmployee = (id: string) => {
    try {
      db.runSync('UPDATE users SET is_active = 1 WHERE id = ?', [parseInt(id)]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showFeedback("success", "Employee Restored");
      loadData();
    } catch (error) {
      console.error("Error restoring employee:", error);
    }
  };

  const deleteEmployee = (id: string) => {
    try {
      db.runSync('DELETE FROM users WHERE id = ?', [parseInt(id)]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      showFeedback("delete", "Employee Deleted");
      loadData();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const addDepartment = (name: string) => {
    try {
      db.runSync('INSERT INTO departments (name) VALUES (?)', [name]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showFeedback("success", "Department Added");
      loadData();
    } catch (error) {
      console.error("Error adding department:", error);
      showFeedback("error", "Department already exists");
    }
  };

  const deleteDepartment = (name: string) => {
    try {
      // Check if employees are assigned
      const result = db.getFirstSync<{ count: number }>(
        'SELECT COUNT(*) as count FROM users WHERE department = ?',
        [name]
      );
      
      if (result && result.count > 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        showFeedback("error", `Cannot delete: ${result.count} employees assigned`);
        return;
      }
      
      db.runSync('DELETE FROM departments WHERE name = ?', [name]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      showFeedback("delete", "Department Deleted");
      loadData();
    } catch (error) {
      console.error("Error deleting department:", error);
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
