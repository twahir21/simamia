import { View, Text, TouchableOpacity, ScrollView, Switch, Linking } from "react-native";
import { useEffect, useState } from "react";
import { Feather, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { getSetting, saveSetting } from "@/db/settings.sqlite";
import { router } from "expo-router";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [appLock, setAppLock] = useState(false);

  // Mock Subscription Data (In a real app, fetch this from your DB or Global State)
  const [subscription, setSubscription] = useState({
    type: "Trial",
    expiryDate: "2026-02-17", // 14 days from today
    isExpired: false,
  });

  useEffect(() => {
    const savedValue = getSetting("app_lock");
    setAppLock(savedValue === "true");
  }, []);

  const toggleLock = (newValue: boolean) => {
    setAppLock(newValue);
    saveSetting("app_lock", String(newValue));
  };

  // Helper to calculate days remaining
  const getDaysRemaining = (date: string) => {
    const expiry = new Date(date).getTime();
    const today = new Date().getTime();
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const daysLeft = getDaysRemaining(subscription.expiryDate);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 pt-12 pb-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center gap-2">
          <Feather name="settings" size={24} color="#1F2937" />
          <Text className="text-xl font-bold text-gray-800">Settings</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        
        {/* SUBSCRIPTION CARD */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-700 mb-3">Subscription</Text>
          <View className="bg-slate-800 rounded-3xl p-5 shadow-lg shadow-slate-400">
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <View className="flex-row items-center bg-amber-400 self-start px-2 py-1 rounded-md mb-2">
                  <FontAwesome5 name="crown" size={10} color="#78350f" />
                  <Text className="text-[10px] font-black text-amber-900 ml-1 uppercase">
                    {subscription.type} Plan
                  </Text>
                </View>
                <Text className="text-white text-xl font-bold">
                  {daysLeft > 0 ? `${daysLeft} Days Left` : "Plan Expired"}
                </Text>
                <Text className="text-slate-400 text-xs mt-1">
                  Expires on: {new Date(subscription.expiryDate).toLocaleDateString()}
                </Text>
              </View>
              <MaterialCommunityIcons name="shield-star" size={48} color="#fbbf24" />
            </View>

            <TouchableOpacity 
              onPress={() => router.push("/pricing/pricing")} // Directs to your Pricing page
              className="bg-sky-500 py-3 rounded-2xl flex-row justify-center items-center shadow-sm active:bg-sky-600"
            >
              <Text className="text-white font-bold text-base mr-2">Upgrade Now</Text>
              <Feather name="arrow-right" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Group */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-700 mb-2">Preferences</Text>
          <View className="bg-white rounded-2xl overflow-hidden border border-gray-200">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
              <Text className="text-gray-800">Dark Mode</Text>
              <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>
            <TouchableOpacity className="flex-row justify-between items-center p-4 border-b border-gray-100">
              <Text className="text-gray-800">Language</Text>
              <Feather name="chevron-right" size={18} color="#9ca3af" />
            </TouchableOpacity>
            <View className="flex-row justify-between items-center p-4">
              <Text className="text-gray-800">App Lock</Text>
              <Switch 
                value={appLock} 
                onValueChange={toggleLock} 
                trackColor={{ false: "#d1d5db", true: "#0ea5e9" }} 
              />
            </View>
          </View>
        </View>

        {/* Support Group */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-700 mb-2">Support</Text>
          <View className="bg-white rounded-2xl overflow-hidden border border-gray-200">
            <TouchableOpacity className="p-4 border-b border-gray-100">
              <Text className="text-gray-800">Help Center</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="p-4 border-b border-gray-100" 
              onPress={() => Linking.openURL('tel:0674291587')}
            >
              <Text className="text-gray-800 font-medium">📞 Call us: 067 429 1587</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-4 border-b border-gray-100">
              <Text className="text-gray-800">Share App</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-4">
              <Text className="text-gray-800">Follow Us</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management Group */}
        <View className="mb-10">
          <Text className="text-lg font-bold text-gray-700 mb-2">Data Management</Text>
          <View className="bg-white rounded-2xl overflow-hidden border border-gray-200">
            <TouchableOpacity className="p-4 border-b border-gray-100">
              <Text className="text-red-600 font-semibold">Delete All Data</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-4">
              <Text className="text-gray-800">Export Data (.csv)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}