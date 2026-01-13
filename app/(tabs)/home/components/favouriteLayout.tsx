import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PinnedTab from "./pinned";
import PopularTab from "./popular";
import RecentTab from "./recent";

const Tab = createMaterialTopTabNavigator();


export default function FavoritesScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Pinned"
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: "#0ea5e9" },
        tabBarActiveTintColor: "#0f172a",
        tabBarInactiveTintColor: "#64748b",
        tabBarLabelStyle: {
          fontWeight: "700",
          textTransform: "none",
        },
        tabBarStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Tab.Screen name="Pinned" component={PinnedTab} />
      <Tab.Screen name="Popular" component={PopularTab} />
      <Tab.Screen name="Recent" component={RecentTab} />
    </Tab.Navigator>
  );
}
