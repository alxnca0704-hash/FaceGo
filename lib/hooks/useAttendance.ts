import { employees } from "@/constant/data";
import { useState, useMemo } from "react";

export const useAttendance = () => {
  const [search, setSearch] = useState("");

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return {
    search,
    setSearch,
    filteredEmployees,
  };
};
