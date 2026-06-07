import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { hasAdminSetup, setupAdminPIN, verifyAdminPIN } from '../security/authService';

export function useAuth() {
  const router = useRouter();
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSetup = async () => {
      const setupExists = await hasAdminSetup();
      setIsSetupMode(!setupExists);
      setIsLoading(false);
    };
    checkSetup();
  }, []);

  const handleAuthenticate = async (inputPin: string) => {
    if (inputPin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits.');
      return;
    }

    if (isSetupMode) {
      const success = await setupAdminPIN(inputPin);
      if (success) {
        Alert.alert('Success', 'Admin PIN configured securely.');
        router.replace('/(tabs)/dashboard');
      }
    } else {
      const isValid = await verifyAdminPIN(inputPin);
      if (isValid) {
        router.replace('/(tabs)/dashboard');
      } else {
        Alert.alert('Access Denied', 'Invalid PIN. Please try again.');
        setPin(''); 
      }
    }
  };

  return {
    isSetupMode,
    pin,
    setPin,
    isLoading,
    handleAuthenticate
  };
}
