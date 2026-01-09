// SettingsScreen.tsx
import { View, Text, TouchableOpacity, ScrollView, Switch, Linking } from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";


export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [appLock, setAppLock] = useState(false);

  return <>
    {/* Header */}
    <View className="px-4 pt-8 pb-2 bg-white border-b border-gray-400">
        <View className="flex-row items-center gap-2 pt-3">
            <Feather name="settings" size={24} color="#1F2937" />
            <Text className="text-xl font-bold text-gray-800">Settings</Text>
        </View>        
    </View>
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Preferences Group */}
      <View className="mb-6">
        <Text className="text-lg font-bold text-gray-700 mb-2">
          Preferences
        </Text>

        {/* Dark/Light Mode */}
        <View className="flex-row justify-between items-center bg-white p-4 rounded-lg mb-2">
          <Text className="text-gray-800">Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        {/* Language */}
        <TouchableOpacity className="bg-white p-4 rounded-lg mb-2">
          <Text className="text-gray-800">Language</Text>
        </TouchableOpacity>

        {/* App Lock */}
        <View className="flex-row justify-between items-center bg-white p-4 rounded-lg">
          <Text className="text-gray-800">App Lock</Text>
          <Switch value={appLock} onValueChange={setAppLock} />
        </View>
      </View>

      {/* Support Group */}
      <View className="mb-6">
        <Text className="text-lg font-bold text-gray-700 mb-2">
          Support
        </Text>

        <TouchableOpacity className="bg-white p-4 rounded-lg mb-2">
          <Text className="text-gray-800">Help</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-lg mb-2">
          <Text className="text-gray-800" onPress={() => Linking.openURL(`tel:067 429 1587`)}>📞 Call us</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-lg mb-2">
          <Text className="text-gray-800">Share App</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-lg">
          <Text className="text-gray-800">Follow Us</Text>
        </TouchableOpacity>
      </View>

      {/* Data Management Group */}
      <View>
        <Text className="text-lg font-bold text-gray-700 mb-2">
          Data Management
        </Text>

        <TouchableOpacity className="bg-white p-4 rounded-lg mb-2">
          <Text className="text-red-600 font-semibold">Delete All Data</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-lg">
          <Text className="text-gray-800">Export Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </>;
}
