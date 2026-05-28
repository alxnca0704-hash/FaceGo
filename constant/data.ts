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
