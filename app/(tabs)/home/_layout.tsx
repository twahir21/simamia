import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, Image } from "react-native";



export default function HomeLayout() {
  return <>
    <StatusBar style="dark" />
    <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerStyle: {
              // backgroundColor: "#e0f2fe", 
            },
            // headerShadowVisible: false, // faster, cleaner
            headerTitleAlign: "left",
        
            headerTitle: () => (
              <View className="flex-row items-center gap-2 mt-5">
                <Image
                  source={require("../../../assets/images/logo.png")}
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: "contain",
                  }}
                />
                <Text className="text-lg font-bold text-sky-900">
                  Simamia
                </Text>
              </View>
            ),
          }}
        />

        <Stack.Screen 
          name="sales"
          options={{
            title: "Sales",
            headerStyle: {
              backgroundColor: "#0284c7",
            },
            headerShadowVisible: false, // faster, cleaner
            headerTitleAlign: "left",
            headerTintColor: "#e0f2fe"
          }}

        />
      <Stack.Screen name="stock" options={{ title: "Stock" }} />
      <Stack.Screen name="debts" options={{ title: "Debts" }} />
    </Stack>
  </>
}
