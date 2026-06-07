import { useState, useMemo, useCallback } from "react";
import { getDbConnection } from "@/lib/services/database";
import { useFocusEffect } from "expo-router";

export const useAttendance = () => {
  const db = getDbConnection();
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [logs, setLogs] = useState<Employee[]>([]);

  const fetchLogs = useCallback(() => {
    try {
      const records = db.getAllSync<any>(`
        SELECT 
          l.id,
          u.full_name as name,
          u.employee_id,
          u.department,
          l.date,
          l.time_in,
          l.status
        FROM attendance_logs l
        INNER JOIN users u ON l.user_id = u.id
        ORDER BY l.date DESC, l.time_in DESC
      `);
      
      const formatted = records.map(r => ({
        id: r.id.toString(),
        employee_id: r.employee_id,
        name: r.name,
        department: r.department,
        status: r.status as any,
        time_in: r.time_in,
        time_out: null,
        date: r.date
      }));
      setLogs(formatted);
    } catch (error) {
      console.error("Fetch Logs Error:", error);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      fetchLogs();
    }, [fetchLogs])
  );

  const filteredEmployees = useMemo(() => {
    return logs.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase());

      let matchesDate = true;
      if (selectedDate) {
        // Format: "2026-06-01" matches the DB format
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        matchesDate = emp.date === formattedDate;
      }

      return matchesSearch && matchesDate;
    });
  }, [search, selectedDate, logs]);

  return {
    search,
    setSearch,
    selectedDate,
    setSelectedDate,
    filteredEmployees,
  };
};
