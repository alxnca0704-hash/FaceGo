import { useState, useCallback } from "react";
import { FeedbackType } from "@/components/ui/FeedbackOverlay";

export const useFeedback = () => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<FeedbackType>("success");
  const [message, setMessage] = useState("");

  const showFeedback = useCallback((type: FeedbackType, message: string) => {
    setType(type);
    setMessage(message);
    setVisible(true);
  }, []);

  const hideFeedback = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    feedbackProps: {
      visible,
      type,
      message,
      onFinished: hideFeedback,
    },
    showFeedback,
  };
};
