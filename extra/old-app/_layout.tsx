import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, Image } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light"/>

      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerStyle: {
              backgroundColor: "#0284c7",
            },
            headerShadowVisible: false, // faster, cleaner
            headerTitleAlign: "left",
            headerTitle: () => (
              <View className="flex-row items-center gap-2 mt-5">
                <Image
                  source={require("../assets/images/logo.png")}
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: "contain",
                  }}
                />
                <Text className="text-lg font-bold text-sky-100">
                  Simamia
                </Text>
              </View>
            ),
          }}
        />

        <Stack.Screen 
          name="Sales"
          options={{
            headerStyle: {
              backgroundColor: "#0284c7",
            },
            headerShadowVisible: false, // faster, cleaner
            headerTitleAlign: "left",
            headerTintColor: "#e0f2fe"
          }}

        />
      </Stack>
    </>
  );
}
