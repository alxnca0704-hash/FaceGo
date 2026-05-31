import type { ImageSourcePropType } from "react-native";

declare global {
  interface AppTab {
    name: string;
    title: string;
    icon: ImageSourcePropType;
  }

  interface TabIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
  }

  interface Stats {
    id: string;
    icon: ImageSourcePropType;
    name: string;
    total: number;
  }

  interface Employee {
    id: string;
    employee_id: string;
    name: string;
    time_in: string | null;
    time_out: string | null;
    status: "Present" | "Absent";
  }

  interface QuickAction {
    id: string;
    title: string;
    icon: ImageSourcePropType;
    onPress?: () => void;
    backgroundColor?: string;
  }
}

export { };

