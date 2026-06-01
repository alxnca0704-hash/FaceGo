import { icons } from "./icons";

export const tabs: AppTab[] = [
  { name: "dashboard", title: "Home", icon: icons.home },
  { name: "employee", title: "Subscriptions", icon: icons.employee },
  { name: "attendance", title: "Insights", icon: icons.attendance },
];

export const STATS: Stats[] = [
  {
    id: "total-employees",
    icon: icons.person,
    name: "Total Employees",
    total: 5,
  },
  {
    id: "today-attendance",
    icon: icons.verified,
    name: "Today's Attendance",
    total: 12,
  },
  {
    id: "today-records",
    icon: icons.record,
    name: "Today's Records",
    total: 15,
  },
];

export const employees: Employee[] = [
  {
    id: "1",
    employee_id: "EMP-001",
    name: "Alice Johnson",
    time_in: "08:02 AM",
    time_out: "05:10 PM",
    status: "Present",
    date: "June 1, 2026",
  },
  {
    id: "2",
    employee_id: "EMP-002",
    name: "Bob Martinez",
    time_in: null,
    time_out: null,
    status: "Absent",
    date: "June 1, 2026",
  },
  {
    id: "3",
    employee_id: "EMP-003",
    name: "Carol White",
    time_in: "08:45 AM",
    time_out: "05:00 PM",
    status: "Present",
    date: "June 1, 2026",
  },
  {
    id: "4",
    employee_id: "EMP-004",
    name: "David Chen",
    time_in: null,
    time_out: null,
    status: "Absent",
    date: "May 31, 2026",
  },
  {
    id: "5",
    employee_id: "EMP-005",
    name: "Eva Nguyen",
    time_in: "07:58 AM",
    time_out: "04:55 PM",
    status: "Present",
    date: "May 31, 2026",
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "face-scan",
    title: "Face Scan Attendance",
    icon: icons.verified,
  },
  {
    id: "download-records",
    title: "Download Records",
    icon: icons.record,
  },
  {
    id: "add-employee",
    title: "Add Employee",
    icon: icons.person,
  },
];
