import { getLastTab, saveLastTab } from "@/store/tabMemory";
import { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ScanScreen from "./scan";
import SmartSearch from "./search";
import QuickSaleScreen from "./quick";
import FavoritesScreen from "./favouriteLayout";

const Tab = createMaterialTopTabNavigator();


const tabComponents: Record<string, React.ComponentType<any>> = { 
  Scan: ScanScreen, 
  Search: SmartSearch, 
  Quick: QuickSaleScreen, 
  Favorites: FavoritesScreen, 
};

const selectedTabs = ["Scan", "Search", "Quick", "Favorites"] as const;

export default function SalesLayout() {
  const [initialTab, setInitialTab] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const lastTab = await getLastTab();
      setInitialTab(lastTab ?? "Scan"); // fallback is important
    })();
  }, []);

  if (!initialTab) return null; // no flicker


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
          const route = e.data.state.routes[e.data.state.index];
          saveLastTab(route.name);
        },
      }}
    >
      {selectedTabs.map((tab) => (
        <Tab.Screen
          key={tab}
          name={tab}
          component={tabComponents[tab]}
        />
      ))}
    </Tab.Navigator>
  );
}
