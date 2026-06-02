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
import { colors } from '../constant/theme'

const SafeAreaView = styled(RNSafeAreaView)

const ChangePinScreen = () => {
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

  const handleChangePin = () => {
    const pinRegex = /^\d{6}$/

    if (!currentPin || !newPin || !confirmPin) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (!pinRegex.test(currentPin) || !pinRegex.test(newPin) || !pinRegex.test(confirmPin)) {
      Alert.alert('Error', 'PINs must be 6 digits long and contain only numbers')
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
    <SafeAreaView className="flex-1 bg-background" edges={['top']} style={{ backgroundColor: colors.background }}>
      <View className="bg-surface border-b border-border px-5 pb-4" style={{ paddingTop: vs(56) }}>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary font-sans-bold" style={{ fontSize: s(16) }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text className="font-sans-extrabold text-textPrimary" style={{ fontSize: s(20) }}>
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
          <Text className="font-sans-medium text-textSecondary mb-2" style={{ fontSize: s(14) }}>
            Current PIN
          </Text>
          <TextInput
            className="border border-border rounded-xl px-4 font-sans-regular"
            style={{ height: vs(44), fontSize: s(14) }}
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
            value={currentPin}
            onChangeText={(text) => setCurrentPin(text.replace(/[^0-9]/g, ''))}
            placeholder="Enter current PIN"
          />
        </View>

        <View className="mb-4">
          <Text className="font-sans-medium text-textSecondary mb-2" style={{ fontSize: s(14) }}>
            New PIN
          </Text>
          <TextInput
            className="border border-border rounded-xl px-4 font-sans-regular"
            style={{ height: vs(44), fontSize: s(14) }}
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
            value={newPin}
            onChangeText={(text) => setNewPin(text.replace(/[^0-9]/g, ''))}
            placeholder="Enter new PIN"
          />
        </View>

        <View className="mb-4">
          <Text className="font-sans-medium text-textSecondary mb-2" style={{ fontSize: s(14) }}>
            Confirm New PIN
          </Text>
          <TextInput
            className="border border-border rounded-xl px-4 font-sans-regular"
            style={{ height: vs(44), fontSize: s(14) }}
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
            value={confirmPin}
            onChangeText={(text) => setConfirmPin(text.replace(/[^0-9]/g, ''))}
placeholder="Confirm new PIN"
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }

export default ChangePinScreen