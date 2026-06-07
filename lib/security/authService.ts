import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const ADMIN_PIN_KEY = 'local_admin_pin';

const hashPIN = async (pin: string) => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pin
  );
};

export const setupAdminPIN = async (pin: string) => {
  try {
    const hashedPin = await hashPIN(pin);
    await SecureStore.setItemAsync(ADMIN_PIN_KEY, hashedPin);
    return true;
  } catch (error) {
    console.error('Failed to setup admin PIN:', error);
    return false;
  }
};

export const verifyAdminPIN = async (inputPin: string) => {
  try {
    const storedHash = await SecureStore.getItemAsync(ADMIN_PIN_KEY);
    if (!storedHash) return false;
    const inputHash = await hashPIN(inputPin);
    return storedHash === inputHash;
  } catch (error) {
    console.error('Failed to verify admin PIN:', error);
    return false;
  }
};

export const hasAdminSetup = async () => {
  try {
    const storedHash = await SecureStore.getItemAsync(ADMIN_PIN_KEY);
    return storedHash !== null;
  } catch (error) {
    return false;
  }
};
