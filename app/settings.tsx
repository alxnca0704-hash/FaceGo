import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { s, vs } from "react-native-size-matters";

// ─── Theme ──────────────────────────────────────────────────────────────────

import { colors as COLORS } from "@/constant/theme";

const LIGHT_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 4,
  elevation: 1,
};

const DARK_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 2,
};

const LIGHT_COLORS = {
  primary: COLORS.primary,
  primaryLight: COLORS.primaryLight,
  surface: "#FFFFFF",
  background: "#FFFFFF",
  border: COLORS.border,
  textPrimary: COLORS.textPrimary,
  textSecondary: COLORS.textSecondary,
  textMuted: COLORS.textMuted,
  danger: COLORS.danger,
  dangerLight: COLORS.dangerLight,
  success: COLORS.success,
  warning: COLORS.warning,
};

const DARK_COLORS = {
  primary: "#93C5FD",
  primaryLight: "rgba(59, 130, 246, 0.15)",
  surface: "#1C1C1E",
  background: "#000000",
  border: "#2C2C2E",
  textPrimary: "#F5F5F7",
  textSecondary: "#AEAEB2",
  textMuted: "#8E8E93",
  danger: "#FF6B6B",
  dangerLight: "rgba(255, 107, 107, 0.15)",
  success: "#34D399",
  warning: "#FBBF24",
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface ToggleItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  isDark?: boolean;
}

interface NavItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  trailing?: string;
  danger?: boolean;
  onPress?: () => void;
  isDark?: boolean;
}

interface SectionHeaderProps {
  title: string;
  isDark?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, isDark }) => {
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;
  const shadow = isDark ? DARK_SHADOW : LIGHT_SHADOW;

  return (
    <View className="px-5 pt-6 pb-2">
      <Text
        className="font-sans-semibold"
        style={{
          fontSize: vs(10),
          color: isDark ? colors.primary : "#000",
          letterSpacing: 1.2,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Text>
    </View>
  );
};

const ToggleItem: React.FC<ToggleItemProps> = ({
  icon,
  label,
  description,
  value,
  onValueChange,
  isDark = false,
}) => {
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return (
    <View
      className="flex-row items-center justify-between px-5 py-3 border-b"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
    >
      <View className="flex-row items-center flex-1 gap-3">
        <View
          className="w-9 h-9 rounded-xl items-center justify-center"
          style={{ backgroundColor: colors.primaryLight }}
        >
          <Ionicons name={icon} size={s(18)} color={colors.primary} />
        </View>
        <View className="flex-1">
          <Text
            className="font-sans-medium"
            style={{ fontSize: vs(13), color: colors.textPrimary }}
          >
            {label}
          </Text>
          {description ? (
            <Text
              className="font-sans-regular mt-0.5"
              style={{ fontSize: vs(11), color: colors.textMuted }}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={colors.border}
      />
    </View>
  );
};

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  description,
  trailing,
  danger = false,
  onPress,
  isDark = false,
}) => {
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center justify-between px-5 py-3 border-b"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
    >
      <View className="flex-row items-center flex-1 gap-3">
        <View
          className="w-9 h-9 rounded-xl items-center justify-center"
          style={{
            backgroundColor: danger ? colors.dangerLight : colors.primaryLight,
          }}
        >
          <Ionicons
            name={icon}
            size={s(18)}
            color={danger ? colors.danger : colors.primary}
          />
        </View>
        <View className="flex-1">
          <Text
            className="font-sans-medium"
            style={{
              fontSize: vs(13),
              color: danger ? colors.danger : colors.textPrimary,
            }}
          >
            {label}
          </Text>
          {description ? (
            <Text
              className="font-sans-regular mt-0.5"
              style={{ fontSize: vs(11), color: colors.textMuted }}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </View>
      <View className="flex-row items-center gap-1">
        {trailing ? (
          <Text
            className="font-sans-regular"
            style={{ fontSize: vs(12), color: colors.textMuted }}
          >
            {trailing}
          </Text>
        ) : null}
        <Ionicons
          name="chevron-forward"
          size={s(16)}
          color={danger ? colors.danger : colors.textMuted}
        />
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const colors = darkMode ? DARK_COLORS : LIGHT_COLORS;

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete account",
      "This action is permanent and cannot be undone. All your data will be erased.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("Account deleted"),
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert("Clear cache", "This will remove all temporary files.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", onPress: () => console.log("Cache cleared") },
    ]);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>

      {/* ── Header ── */}
      <View
        className="px-5 pb-4 border-b"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          paddingTop: vs(56),
        }}
      >
        <Text
          className="font-sans-extrabold"
          style={{ fontSize: vs(24), color: colors.textPrimary }}
        >
          Settings
        </Text>
        <Text
          className="font-sans-regular mt-0.5"
          style={{ fontSize: vs(12), color: colors.textMuted }}
        >
          Manage your account and preferences
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Profile Card ── */}
        <View className="mx-4 mt-5 mb-1">
          <TouchableOpacity
            activeOpacity={0.8}
            className="rounded-2xl p-4 flex-row items-center gap-4"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 0.5,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center"
              style={{ backgroundColor: colors.primaryLight }}
            >
              <Text
                className="font-sans-bold"
                style={{ fontSize: vs(18), color: colors.primary }}
              >
                JD
              </Text>
            </View>

            <View className="flex-1">
              <Text
                className="font-sans-bold"
                style={{ fontSize: vs(15), color: colors.textPrimary }}
              >
                John Dela Cruz
              </Text>
              <Text
                className="font-sans-regular mt-0.5"
                style={{ fontSize: vs(12), color: colors.textMuted }}
              >
                john.delacruz@facego.com
              </Text>
              <View
                className="mt-1.5 self-start rounded-full px-2.5 py-0.5"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <Text
                  className="font-sans-semibold"
                  style={{ fontSize: vs(10), color: colors.primary }}
                >
                  Administrator
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={s(18)}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* ── Notifications ── */}
        <SectionHeader title="Notifications" isDark={darkMode} />
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{
            borderWidth: 0.5,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            ...(darkMode ? DARK_SHADOW : LIGHT_SHADOW),
          }}
        >
          <ToggleItem
            icon="notifications-outline"
            label="Push notifications"
            description="Attendance alerts and announcements"
            value={notifications}
            onValueChange={setNotifications}
            isDark={darkMode}
          />
          <ToggleItem
            icon="mail-outline"
            label="Email notifications"
            description="Weekly summaries and reports"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            isDark={darkMode}
          />
        </View>

        {/* ── Appearance ── */}
        <SectionHeader title="Appearance" isDark={darkMode} />
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{
            borderWidth: 0.5,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            ...(darkMode ? DARK_SHADOW : LIGHT_SHADOW),
          }}
        >
          <ToggleItem
            icon="moon-outline"
            label="Dark mode"
            value={darkMode}
            onValueChange={setDarkMode}
            isDark={darkMode}
          />
          <NavItem
            icon="language-outline"
            label="Language"
            trailing="English (US)"
            isDark={darkMode}
          />
        </View>

        {/* ── Security ── */}
        <SectionHeader title="Security" isDark={darkMode} />
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{
            borderWidth: 0.5,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            ...(darkMode ? DARK_SHADOW : LIGHT_SHADOW),
          }}
        >
          <ToggleItem
            icon="finger-print-outline"
            label="Biometric login"
            description="Face ID / Fingerprint"
            value={biometrics}
            onValueChange={setBiometrics}
            isDark={darkMode}
          />
          <NavItem
            icon="lock-closed-outline"
            label="Change password"
            isDark={darkMode}
          />
          <NavItem
            icon="shield-checkmark-outline"
            label="Two-factor authentication"
            description="Add an extra layer of security"
            isDark={darkMode}
          />
        </View>

        {/* ── Data & Sync ── */}
        <SectionHeader title="Data & Sync" isDark={darkMode} />
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{
            borderWidth: 0.5,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            ...(darkMode ? DARK_SHADOW : LIGHT_SHADOW),
          }}
        >
          <ToggleItem
            icon="sync-outline"
            label="Auto sync"
            description="Sync attendance data in real time"
            value={autoSync}
            onValueChange={setAutoSync}
            isDark={darkMode}
          />
          <NavItem
            icon="cloud-download-outline"
            label="Cloud backup"
            description="Last backup: Today, 10:30 AM"
            isDark={darkMode}
          />
          <NavItem
            icon="trash-outline"
            label="Clear cache"
            description="128 MB of temporary files"
            isDark={darkMode}
            onPress={handleClearCache}
          />
        </View>

        {/* ── About ── */}
        <SectionHeader title="About" isDark={darkMode} />
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{
            borderWidth: 0.5,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            ...(darkMode ? DARK_SHADOW : LIGHT_SHADOW),
          }}
        >
          <NavItem
            icon="information-circle-outline"
            label="App version"
            trailing="v1.0.0"
            isDark={darkMode}
          />
          <NavItem
            icon="document-text-outline"
            label="Terms of service"
            isDark={darkMode}
          />
          <NavItem
            icon="shield-outline"
            label="Privacy policy"
            isDark={darkMode}
          />
          <NavItem
            icon="help-circle-outline"
            label="Help & support"
            isDark={darkMode}
          />
        </View>

        {/* ── Danger Zone ── */}
        <SectionHeader title="Account" isDark={darkMode} />
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{
            borderWidth: 0.5,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            ...(darkMode ? DARK_SHADOW : LIGHT_SHADOW),
          }}
        >
          <NavItem
            icon="log-out-outline"
            label="Log out"
            isDark={darkMode}
            onPress={handleLogout}
          />
          <NavItem
            icon="person-remove-outline"
            label="Delete account"
            description="Permanently remove your account"
            danger
            isDark={darkMode}
            onPress={handleDeleteAccount}
          />
        </View>

        {/* Bottom padding */}
        <View style={{ height: vs(40) }} />
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
