import { getDbConnection } from "@/lib/services/database";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";

export const useDashboard = () => {
  const router = useRouter();
  const db = getDbConnection();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    todayAttendance: 0,
    totalRecords: 0
  });
  const [recentActivity, setRecentActivity] = useState<Employee[]>([]);

  const fetchDashboardData = useCallback(() => {
    try {
      // Get Total Employees
      const empCount = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM users WHERE is_active = 1');
      
      // Get Today's Attendance
      const today = new Date().toISOString().split('T')[0];
      const attCount = db.getFirstSync<{ count: number }>(
        'SELECT COUNT(DISTINCT user_id) as count FROM attendance_logs WHERE date = ?',
        [today]
      );

      // Get Total Records Today
      const recCount = db.getFirstSync<{ count: number }>(
        'SELECT COUNT(*) as count FROM attendance_logs WHERE date = ?',
        [today]
      );

      setStats({
        totalEmployees: empCount?.count || 0,
        todayAttendance: attCount?.count || 0,
        totalRecords: recCount?.count || 0
      });

      // Get Recent Activity
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
        ORDER BY l.id DESC
        LIMIT 5
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
      setRecentActivity(formatted);

    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
  );

  const handleQuickAction = (id: string) => {
    if (id === "face-scan") {
      router.push("/scanning");
    } else if (id === "download-records") {
      router.push("/download-records");
    } else if (id === "add-employee") {
      router.push("/(tabs)/employee");
    }
  };

  return {
    handleQuickAction,
    recentActivity,
    stats,
    router,
  };
};
