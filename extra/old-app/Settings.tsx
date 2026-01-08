import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const allTabs = ["Scan", "Smart Search", "Grid", "Quick Sale", "Favorites"];

export default function Settings({ navigation }) {
  const [selectedTabs, setSelectedTabs] = useState<string[]>([]);

  useEffect(() => {
    const loadTabs = async () => {
      const saved = await AsyncStorage.getItem("selectedTabs");
      if (saved) setSelectedTabs(JSON.parse(saved));
      else setSelectedTabs(["Scan", "Smart Search", "Quick Sale"]); // default
    };
    loadTabs();
  }, []);

  const toggleTab = (tab: string) => {
    let updated;
    if (selectedTabs.includes(tab)) {
      updated = selectedTabs.filter(t => t !== tab);
    } else {
      updated = [...selectedTabs, tab];
    }
    // Limit to 3 tabs
    if (updated.length <= 3) setSelectedTabs(updated);
  };

  const saveTabs = async () => {
    await AsyncStorage.setItem("selectedTabs", JSON.stringify(selectedTabs));
    navigation.goBack(); // return to Sales
  };

  return (
    <View className="flex-1 bg-sky-50 p-4">
      <Text className="text-lg font-bold mb-4">Customize Sales Tabs</Text>
      {allTabs.map(tab => (
        <TouchableOpacity
          key={tab}
          className={`p-3 mb-2 rounded-xl ${
            selectedTabs.includes(tab) ? "bg-sky-600" : "bg-gray-200"
          }`}
          onPress={() => toggleTab(tab)}
        >
          <Text className={selectedTabs.includes(tab) ? "text-white" : "text-black"}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        className="bg-green-600 p-4 rounded-xl mt-4"
        onPress={saveTabs}
      >
        <Text className="text-white text-center font-bold">Save</Text>
      </TouchableOpacity>
    </View>
  );
}
