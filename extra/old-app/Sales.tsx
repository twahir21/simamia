import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text } from "react-native";

const Tab = createMaterialTopTabNavigator();

function ScanScreen() { return <View><Text>Scan</Text></View>; }
function SmartSearchScreen() { return <View><Text>Smart Search</Text></View>; }
function GridScreen() { return <View><Text>Grid</Text></View>; }
function QuickSaleScreen() { return <View><Text>Quick Sale</Text></View>; }
function FavoritesScreen() { return <View><Text>Favorites</Text></View>; }

const tabComponents: Record<string, React.ComponentType<any>> = {
  Scan: ScanScreen,
  "Smart Search": SmartSearchScreen,
  Grid: GridScreen,
  "Quick Sale": QuickSaleScreen,
  Favorites: FavoritesScreen,
};

export default function Sales() {
  const [selectedTabs, setSelectedTabs] = useState<string[]>(["Scan", "Smart Search", "Quick Sale"]);
  const [initialTab, setInitialTab] = useState("Scan");

  useEffect(() => {
    const loadSettings = async () => {
      const savedTabs = await AsyncStorage.getItem("selectedTabs");
      if (savedTabs) setSelectedTabs(JSON.parse(savedTabs));

      const lastTab = await AsyncStorage.getItem("lastUsedTab");
      if (lastTab) setInitialTab(lastTab);
    };
    loadSettings();
  }, []);

  const handleTabChange = async (routeName: string) => {
    await AsyncStorage.setItem("lastUsedTab", routeName);
  };

  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#bae6fd",
        tabBarStyle: { backgroundColor: "#0284c7" },
        tabBarIndicatorStyle: { backgroundColor: "white" },
        swipeEnabled: true,
      }}
      screenListeners={{
        state: (e) => {
          const routeName = e.data.state.routes[e.data.state.index].name;
          handleTabChange(routeName);
        },
      }}
    >
      {selectedTabs.map(tab => (
        <Tab.Screen key={tab} name={tab} component={tabComponents[tab]} />
      ))}
    </Tab.Navigator>
  );
}
