import { employees } from "@/constant/data";
import { useState, useMemo } from "react";

export const useAttendance = () => {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase());

      let matchesDate = true;
      if (selectedDate) {
        // Format: "June 1, 2026"
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(selectedDate);
        
        matchesDate = emp.date === formattedDate;
      }

      return matchesSearch && matchesDate;
    });
  }, [search, selectedDate]);

  return {
    search,
    setSearch,
    selectedDate,
    setSelectedDate,
    filteredEmployees,
  };
};
