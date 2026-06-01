import { router } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { styled } from 'nativewind'
import { s, vs } from 'react-native-size-matters'

const COLORS = {
  primary: '#3B82F6',
  background: '#F5F7FA',
}

const SafeAreaView = styled(RNSafeAreaView)

const ChangePinScreen = () => {
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

  const handleChangePin = () => {
    if (!currentPin || !newPin || !confirmPin) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    if (newPin !== confirmPin) {
      Alert.alert('Error', 'New PINs do not match')
      return
    }
    Alert.alert('Success', 'PIN changed successfully', [
      { text: 'OK', onPress: () => router.back() },
    ])
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']} style={{ backgroundColor: COLORS.background }}>
      <View className="bg-white border-b border-gray-100 px-5 pb-4" style={{ paddingTop: vs(56) }}>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary font-sans-bold" style={{ fontSize: s(16) }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text className="font-sans-extrabold text-gray-900" style={{ fontSize: s(20) }}>
            Change PIN
          </Text>
          <TouchableOpacity onPress={handleChangePin}>
            <Text className="text-primary font-sans-bold" style={{ fontSize: s(16) }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 px-5 pt-6">
        <View className="mb-4">
          <Text className="font-sans-medium text-gray-700 mb-2" style={{ fontSize: s(14) }}>
            Current PIN
          </Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 font-sans-regular"
            style={{ height: vs(44), fontSize: s(14) }}
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
            value={currentPin}
            onChangeText={setCurrentPin}
            placeholder="Enter current PIN"
          />
        </View>

        <View className="mb-4">
          <Text className="font-sans-medium text-gray-700 mb-2" style={{ fontSize: s(14) }}>
            New PIN
          </Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 font-sans-regular"
            style={{ height: vs(44), fontSize: s(14) }}
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
            value={newPin}
            onChangeText={setNewPin}
            placeholder="Enter new PIN"
          />
        </View>

        <View className="mb-4">
          <Text className="font-sans-medium text-gray-700 mb-2" style={{ fontSize: s(14) }}>
            Confirm New PIN
          </Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 font-sans-regular"
            style={{ height: vs(44), fontSize: s(14) }}
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
            value={confirmPin}
            onChangeText={setConfirmPin}
placeholder="Confirm new PIN"
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }

export default ChangePinScreen