const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add custom AI model extensions to the bundler
config.resolver.assetExts.push("bin", "txt", "jpg", "tflite");

module.exports = withNativewind(config);
