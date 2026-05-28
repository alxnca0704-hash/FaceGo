import attendance from "@/assets/icons/attendance.png";
import burger from "@/assets/icons/burger.png";
import employee from "@/assets/icons/employee.png";
import home from "@/assets/icons/home.png";
import person from "@/assets/icons/person.png";
import record from "@/assets/icons/record.png";
import verified from "@/assets/icons/verified.png";

export const icons = {
  home,
  employee,
  attendance,
  burger,
  person,
  verified,
  record,
} as const;

export type IconKey = keyof typeof icons;
