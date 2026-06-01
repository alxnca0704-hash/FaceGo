import { employees } from "@/constant/data";
import { useRouter } from "expo-router";

export const useDashboard = () => {
  const router = useRouter();

  const handleQuickAction = (id: string) => {
    if (id === "face-scan") {
      router.push("/scanning");
    } else if (id === "download-records") {
      router.push("/download-records");
    } else if (id === "add-employee") {
      router.push("/(tabs)/employee");
    }
  };

  const recentActivity = employees.slice(0, 5);

  return {
    handleQuickAction,
    recentActivity,
    router,
  };
};
