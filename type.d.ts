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
}

export { };

