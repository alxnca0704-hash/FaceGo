import { cn } from '@/lib/utils'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
    Alert,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { s, vs } from 'react-native-size-matters'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ToggleItemProps {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  description?: string
  value: boolean
  onValueChange: (v: boolean) => void
}

interface NavItemProps {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  description?: string
  trailing?: string
  danger?: boolean
  onPress?: () => void
}

interface SectionHeaderProps {
  title: string
}

// ─── Theme (mirrors constant/theme.ts conventions) ────────────────────────────

const COLORS = {
  primary: '#3B82F6',       // brand blue
  primaryLight: '#EFF6FF',
  surface: '#FFFFFF',
  background: '#F5F7FA',
  border: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  success: '#10B981',
  warning: '#F59E0B',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <View className="px-5 pt-6 pb-2">
    <Text
      className="font-sans-semibold text-primary uppercase tracking-widest"
      style={{ fontSize: vs(10), color: COLORS.primary, letterSpacing: 1.2 }}
    >
      {title}
    </Text>
  </View>
)

const ToggleItem: React.FC<ToggleItemProps> = ({
  icon,
  label,
  description,
  value,
  onValueChange,
}) => (
  <View
    className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-gray-100"
  >
    <View className="flex-row items-center flex-1 gap-3">
      <View
        className="w-9 h-9 rounded-xl items-center justify-center"
        style={{ backgroundColor: COLORS.primaryLight }}
      >
        <Ionicons name={icon} size={s(18)} color={COLORS.primary} />
      </View>
      <View className="flex-1">
        <Text
          className="font-sans-medium text-gray-900"
          style={{ fontSize: vs(13) }}
        >
          {label}
        </Text>
        {description ? (
          <Text
            className="font-sans-regular text-gray-400 mt-0.5"
            style={{ fontSize: vs(11) }}
          >
            {description}
          </Text>
        ) : null}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: COLORS.border, true: COLORS.primary }}
      thumbColor="#FFFFFF"
      ios_backgroundColor={COLORS.border}
    />
  </View>
)

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  description,
  trailing,
  danger = false,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-gray-100"
  >
    <View className="flex-row items-center flex-1 gap-3">
      <View
        className="w-9 h-9 rounded-xl items-center justify-center"
        style={{
          backgroundColor: danger ? COLORS.dangerLight : COLORS.primaryLight,
        }}
      >
        <Ionicons
          name={icon}
          size={s(18)}
          color={danger ? COLORS.danger : COLORS.primary}
        />
      </View>
      <View className="flex-1">
        <Text
          className={cn('font-sans-medium', danger ? 'text-red-500' : 'text-gray-900')}
          style={{ fontSize: vs(13) }}
        >
          {label}
        </Text>
        {description ? (
          <Text
            className="font-sans-regular text-gray-400 mt-0.5"
            style={{ fontSize: vs(11) }}
          >
            {description}
          </Text>
        ) : null}
      </View>
    </View>
    <View className="flex-row items-center gap-1">
      {trailing ? (
        <Text
          className="font-sans-regular text-gray-400"
          style={{ fontSize: vs(12) }}
        >
          {trailing}
        </Text>
      ) : null}
      <Ionicons
        name="chevron-forward"
        size={s(16)}
        color={danger ? COLORS.danger : COLORS.textMuted}
      />
    </View>
  </TouchableOpacity>
)

// ─── Main Screen ──────────────────────────────────────────────────────────────

const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [biometrics, setBiometrics] = useState(true)
  const [autoSync, setAutoSync] = useState(true)

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => router.replace('/'),
      },
    ])
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This action is permanent and cannot be undone. All your data will be erased.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') },
      ]
    )
  }

  const handleClearCache = () => {
    Alert.alert('Clear cache', 'This will remove all temporary files.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', onPress: () => console.log('Cache cleared') },
    ])
  }

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>

      {/* ── Header ── */}
      <View
        className="bg-white border-b border-gray-100 px-5 pb-4"
        style={{ paddingTop: vs(56) }}
      >
        <Text
          className="font-sans-extrabold text-gray-900"
          style={{ fontSize: vs(24) }}
        >
          Settings
        </Text>
        <Text
          className="font-sans-regular text-gray-400 mt-0.5"
          style={{ fontSize: vs(12) }}
        >
          Manage your account and preferences
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Profile Card ── */}
        <View className="mx-4 mt-5 mb-1">
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-white rounded-2xl p-4 flex-row items-center gap-4"
            style={{
              borderWidth: 0.5,
              borderColor: COLORS.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            {/* Avatar */}
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center"
              style={{ backgroundColor: COLORS.primaryLight }}
            >
              <Text
                className="font-sans-bold"
                style={{ fontSize: vs(18), color: COLORS.primary }}
              >
                JD
              </Text>
            </View>

            {/* Info */}
            <View className="flex-1">
              <Text
                className="font-sans-bold text-gray-900"
                style={{ fontSize: vs(15) }}
              >
                John Dela Cruz
              </Text>
              <Text
                className="font-sans-regular text-gray-400 mt-0.5"
                style={{ fontSize: vs(12) }}
              >
                john.delacruz@facego.com
              </Text>
              <View
                className="mt-1.5 self-start rounded-full px-2.5 py-0.5"
                style={{ backgroundColor: COLORS.primaryLight }}
              >
                <Text
                  className="font-sans-semibold"
                  style={{ fontSize: vs(10), color: COLORS.primary }}
                >
                  Administrator
                </Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={s(18)} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* ── Notifications ── */}
        <SectionHeader title="Notifications" />
        <View className="mx-4 rounded-2xl overflow-hidden" style={{ borderWidth: 0.5, borderColor: COLORS.border }}>
          <ToggleItem
            icon="notifications-outline"
            label="Push notifications"
            description="Attendance alerts and announcements"
            value={notifications}
            onValueChange={setNotifications}
          />
          <ToggleItem
            icon="mail-outline"
            label="Email notifications"
            description="Weekly summaries and reports"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />
        </View>

        {/* ── Appearance ── */}
        <SectionHeader title="Appearance" />
        <View className="mx-4 rounded-2xl overflow-hidden" style={{ borderWidth: 0.5, borderColor: COLORS.border }}>
          <ToggleItem
            icon="moon-outline"
            label="Dark mode"
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <NavItem
            icon="language-outline"
            label="Language"
            trailing="English (US)"
          />
        </View>

        {/* ── Security ── */}
        <SectionHeader title="Security" />
        <View className="mx-4 rounded-2xl overflow-hidden" style={{ borderWidth: 0.5, borderColor: COLORS.border }}>
          <ToggleItem
            icon="finger-print-outline"
            label="Biometric login"
            description="Face ID / Fingerprint"
            value={biometrics}
            onValueChange={setBiometrics}
          />
          <NavItem
            icon="lock-closed-outline"
            label="Change password"
          />
          <NavItem
            icon="shield-checkmark-outline"
            label="Two-factor authentication"
            description="Add an extra layer of security"
          />
        </View>

        {/* ── Data & Sync ── */}
        <SectionHeader title="Data & Sync" />
        <View className="mx-4 rounded-2xl overflow-hidden" style={{ borderWidth: 0.5, borderColor: COLORS.border }}>
          <ToggleItem
            icon="sync-outline"
            label="Auto sync"
            description="Sync attendance data in real time"
            value={autoSync}
            onValueChange={setAutoSync}
          />
          <NavItem
            icon="cloud-download-outline"
            label="Cloud backup"
            description="Last backup: Today, 10:30 AM"
          />
          <NavItem
            icon="trash-outline"
            label="Clear cache"
            description="128 MB of temporary files"
            onPress={handleClearCache}
          />
        </View>

        {/* ── About ── */}
        <SectionHeader title="About" />
        <View className="mx-4 rounded-2xl overflow-hidden" style={{ borderWidth: 0.5, borderColor: COLORS.border }}>
          <NavItem
            icon="information-circle-outline"
            label="App version"
            trailing="v1.0.0"
          />
          <NavItem
            icon="document-text-outline"
            label="Terms of service"
          />
          <NavItem
            icon="shield-outline"
            label="Privacy policy"
          />
          <NavItem
            icon="help-circle-outline"
            label="Help & support"
          />
        </View>

        {/* ── Danger Zone ── */}
        <SectionHeader title="Account" />
        <View className="mx-4 rounded-2xl overflow-hidden" style={{ borderWidth: 0.5, borderColor: COLORS.border }}>
          <NavItem
            icon="log-out-outline"
            label="Log out"
            onPress={handleLogout}
          />
          <NavItem
            icon="person-remove-outline"
            label="Delete account"
            description="Permanently remove your account"
            danger
            onPress={handleDeleteAccount}
          />
        </View>

        {/* Bottom padding */}
        <View style={{ height: vs(40) }} />
      </ScrollView>
    </View>
  )
}

export default SettingsScreen