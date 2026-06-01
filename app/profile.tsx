import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { vs } from 'react-native-size-matters'

const COLORS = {
  primary: '#3B82F6',
  background: '#F5F7FA',
}

const ProfileScreen = () => {
  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <View
        className="bg-white border-b border-gray-100 px-5 pb-4"
        style={{ paddingTop: vs(56) }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary font-sans-bold" style={{ fontSize: vs(16) }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text
            className="font-sans-extrabold text-gray-900"
            style={{ fontSize: vs(20) }}
          >
            Profile
          </Text>
          <TouchableOpacity>
            <Text className="text-primary font-sans-bold" style={{ fontSize: vs(16) }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 items-center pt-10">
        <View
          className="w-24 h-24 rounded-2xl items-center justify-center mb-4"
          style={{ backgroundColor: COLORS.primary + '20' }}
        >
          <Text
            className="font-sans-bold"
            style={{ fontSize: vs(32), color: COLORS.primary }}
          >
            JD
          </Text>
        </View>
        <Text
          className="font-sans-bold text-gray-900"
          style={{ fontSize: vs(22) }}
        >
          John Dela Cruz
        </Text>
        <Text
          className="font-sans-regular text-gray-400 mt-1"
          style={{ fontSize: vs(14) }}
        >
          john.delacruz@facego.com
        </Text>
      </View>
    </View>
  )
}

export default ProfileScreen