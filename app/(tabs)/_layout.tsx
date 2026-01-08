import { Tabs } from "expo-router";
import { Text, View, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TabIcon({
  name,
  focused,
  label,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  label: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.3 : 1,
      useNativeDriver: true,
      friction: 7,
    }).start();
  }, [focused, scale]);

  return (
    <View
      style={[
        styles.tabWrapper,
        focused && styles.activeTabWrapper, // lift active tab
      ]}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale }],
            backgroundColor: focused ? "#E6F0FF" : "transparent",
            borderWidth: 1,
            borderColor: focused ? "#0284c7" : "transparent",
          },
        ]}
      >
        <Ionicons
          name={name}
          size={22}
          color={focused ? "#0284c7" : "dark"}
        />
      </Animated.View>

      <Text
        style={[
          styles.label,
          { color: focused ? "#0284c7" : "dark", fontWeight: focused ? "600" : "400", marginTop: focused ? 6 : 2 },
        
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          backgroundColor: "#e0f2fe", // Set your Simamia light sky here 
          borderTopColor: "#0284c7"         // Deep border
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home-outline" focused={focused} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="cube-outline" focused={focused} label="Orders" />
          ),
        }}
      />
      <Tabs.Screen
        name="pages"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="document-text-outline" focused={focused} label="Pages" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="settings-outline" focused={focused} label="Settings" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 64,
  },
  activeTabWrapper: {
    marginTop: -6, // lift active tab upward
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  label: {
    fontSize: 12,
    textAlign: "center",
  },
});
