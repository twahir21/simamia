import { View, Text, TouchableOpacity, ScrollView, Switch, Linking, Modal } from "react-native";
import { useEffect, useState } from "react";
import { Feather, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { getSetting, saveSetting } from "@/db/settings.sqlite";
import { router } from "expo-router";
import { useLang } from "@/configs/languages/provider";

export default function Settings() {
  // const [darkMode, setDarkMode] = useState(false);
  const [appLock, setAppLock] = useState(false);
  const { lang, setLanguage, t } = useLang();
  const [open, setOpen] = useState(false);

  const label = lang === "en" ? "English" : "Swahili";

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
          <Text className="text-lg font-bold text-gray-700 mb-2">
            Preferences
          </Text>

          <View className="bg-white rounded-2xl overflow-hidden border border-gray-200">

            {/* Language Row */}
            <TouchableOpacity
              onPress={() => setOpen(true)}
              className="flex-row justify-between items-center p-4 border-b border-gray-100"
            >
              <Text className="text-gray-800">Language</Text>

              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-2">{label}</Text>
                <Feather name="chevron-right" size={18} color="#9ca3af" />
              </View>
            </TouchableOpacity>

            {/* App Lock */}
            <View className="flex-row justify-between items-center p-4">
              <Text className="text-gray-800">App Lock</Text>
              <Switch
                value={appLock}
                onValueChange={toggleLock}
                trackColor={{ false: "#d1d5db", true: "#0ea5e9" }}
              />
            </View>
          </View>

          {/* Language Modal */}
          <Modal
            transparent
            visible={open}
            animationType="fade"
            onRequestClose={() => setOpen(false)}
          >
            {/* Overlay */}
            <View className="flex-1 justify-center items-center bg-black/40 px-8">

              {/* Card */}
              <View className="bg-white w-full rounded-3xl p-6 shadow-2xl">

                <Text className="text-xl font-bold text-gray-900 mb-5 text-center">
                  {t("selectLang")}
                </Text>

                {/* English */}
                <TouchableOpacity
                  className={`flex-row items-center justify-between p-4 rounded-2xl mb-3 ${
                    lang === "en"
                      ? "bg-blue-50 border border-blue-200"
                      : "border border-slate-300"
                  }`}
                  onPress={() => {
                    setLanguage("en");
                    setOpen(false);
                  }}
                >
                  <Text
                    className={`text-base ${
                      lang === "en"
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    English
                  </Text>

                  {lang === "en" && (
                    <View className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </TouchableOpacity>

                {/* Kiswahili */}
                <TouchableOpacity
                  className={`flex-row items-center justify-between p-4 rounded-2xl mb-4 ${
                    lang === "sw"
                      ? "bg-blue-50 border border-blue-200"
                      : "border border-slate-300"
                  }`}
                  onPress={() => {
                    setLanguage("sw");
                    setOpen(false);
                  }}
                >
                  <Text
                    className={`text-base ${
                      lang === "sw"
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    Kiswahili
                  </Text>

                  {lang === "sw" && (
                    <View className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </TouchableOpacity>

                {/* Divider */}
                <View className="h-[1px] bg-gray-300 w-full mb-2" />

                {/* Cancel */}
                <TouchableOpacity
                  className="py-3"
                  onPress={() => setOpen(false)}
                >
                  <Text className="text-center text-gray-500 font-medium text-base">
                    {t("cancel")}
                  </Text>
                </TouchableOpacity>

              </View>
            </View>
          </Modal>

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