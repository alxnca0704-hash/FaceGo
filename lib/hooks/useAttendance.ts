import { useState, useMemo, useEffect, useCallback } from "react";
import { getDbConnection } from "../services/database";

export const useAttendance = () => {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [logs, setLogs] = useState<any[]>([]);

  const db = getDbConnection();

  const loadLogs = useCallback(() => {
    try {
      let query = `
        SELECT u.full_name, u.employee_id, u.department, a.date, a.time_in, a.status
        FROM attendance_logs a
        JOIN users u ON a.user_id = u.id
      `;
      
      const records = db.getAllSync<any>(query);
      setLogs(records);
    } catch (error) {
      console.error("Error loading attendance logs:", error);
    }
  }, [db]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const filteredEmployees = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.full_name.toLowerCase().includes(search.toLowerCase()) ||
        log.employee_id.toLowerCase().includes(search.toLowerCase()) ||
        log.department.toLowerCase().includes(search.toLowerCase());

      let matchesDate = true;
      if (selectedDate) {
        // Format from DB is usually YYYY-MM-DD
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const formattedSelectedDate = `${year}-${month}-${day}`;
        
        matchesDate = log.date === formattedSelectedDate;
      }

      return matchesSearch && matchesDate;
    }).map(log => ({
        ...log,
        name: log.full_name, // Map back to UI expectations
    }));
  }, [logs, search, selectedDate]);

  return {
    search,
    setSearch,
    selectedDate,
    setSelectedDate,
    filteredEmployees,
    refreshLogs: loadLogs
  };
};
