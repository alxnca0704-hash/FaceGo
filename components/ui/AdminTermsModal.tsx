import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from "react-native";
import { s, vs } from "react-native-size-matters";
import { darkColors, lightColors } from "@/constant/theme";

interface AdminTermsModalProps {
  visible: boolean;
  onClose: () => void;
  onAgree: () => void;
  isDark?: boolean;
}

const AdminTermsModal: React.FC<AdminTermsModalProps> = ({
  visible,
  onClose,
  onAgree,
  isDark = false,
}) => {
  const [agreed, setAgreed] = useState(false);
  const colors = isDark ? darkColors : lightColors;

  const handleAgree = () => { // Changed back to synchronous
    if (agreed) {
      onAgree();
    } else {
      // Optionally, show a message that they need to agree
      // For now, we'll just do nothing if not agreed
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              styles.modalTitle,
              { color: colors.textPrimary, fontSize: vs(16) },
            ]}
          >
            Administrator Terms of Service
          </Text>
          <Text
            style={[
              styles.modalText,
              { color: colors.textMuted, fontSize: vs(12) },
            ]}
          >
            By accessing the administration panel, you acknowledge that you are
            an authorized personnel and agree to use the system responsibly,
            protect confidential information, and comply with applicable
            organizational policies.
          </Text>

          <View style={styles.checkboxContainer}>
            <Switch
              value={agreed}
              onValueChange={setAgreed}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={colors.border}
            />
            <Text
              style={[
                styles.checkboxLabel,
                { color: colors.textPrimary, fontSize: vs(12) },
              ]}
            >
              I have read and agree to the administrator terms of service
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.border }]}
              onPress={onClose}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: colors.textPrimary, fontSize: vs(12) },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: agreed ? colors.primary : colors.border,
                  marginLeft: s(10),
                },
              ]}
              onPress={handleAgree}
              disabled={!agreed}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: agreed ? "#FFFFFF" : colors.textMuted,
                    fontSize: vs(12),
                  },
                ]}
              >
                Agree
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: s(20),
    borderRadius: s(12),
    padding: s(25),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalTitle: {
    marginBottom: vs(15),
    textAlign: "center",
    fontFamily: "PlusJakartaSans-Bold",
  },
  modalText: {
    marginBottom: vs(20),
    textAlign: "center",
    fontFamily: "PlusJakartaSans-Regular",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(20),
    width: "100%",
    paddingHorizontal: s(5),
  },
  checkboxLabel: {
    marginLeft: s(10),
    flexShrink: 1,
    fontFamily: "PlusJakartaSans-Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  button: {
    borderRadius: s(8),
    paddingVertical: vs(10),
    paddingHorizontal: s(15),
  },
  buttonText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    textAlign: "center",
  },
});

export default AdminTermsModal;
