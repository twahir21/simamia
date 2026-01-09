import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function App() {
//  useEffect(() => { 
//     NavigationBar.setVisibilityAsync("visible"); 
//     NavigationBar.setBehaviorAsync("inset-swipe"); // disables edge-to-edge 
//     NavigationBar.setBackgroundColorAsync("#000000"); 
//     NavigationBar.setButtonStyleAsync("light"); 
//   }, []);

  return <>
    <View className="flex-1 bg-white px-4 pt-4">

      {/* Top Section */}
      <View>
        {/* Header */}
        <Text className="text-sm text-gray-500 mb-4">
          Today Summary
        </Text>

        {/* Sales */}
        <View className="mb-4 bg-sky-50 border border-sky-500 rounded-2xl p-4 shadow-sm flex-row items-center">
          <Ionicons name="cash-outline" size={24} color="#ee" />
          <View className="ml-3">
            <Text className="text-xs text-gray-500 mb-1">
              TODAY SALES
            </Text>
            <Text className="text-2xl font-bold text-gray-800">
              TZS 1,245,000 /=
            </Text>
          </View>
        </View>

        {/* Debts */}
        <View className="mb-4 bg-sky-50 border border-sky-500 rounded-2xl p-4 shadow-sm flex-row items-center">
          <Ionicons name="card-outline" size={24} color="#dc2626" />
          <View className="ml-3">
            <Text className="text-xs mb-1">
              OUTSTANDING DEBTS
            </Text>
            <Text className="text-2xl font-bold text-red-600">
              TZS 265,000 /=
            </Text>
          </View>
        </View>

        {/* Profit */}
        <View className="mb-4 bg-sky-50 border border-sky-500 rounded-2xl p-4 shadow-sm flex-row items-center">
          <Ionicons name="trending-up-outline" size={24} color="#15803d" />
          <View className="ml-3">
            <Text className="text-xs text-gray-500 mb-1">
              PROFIT
            </Text>
            <Text className="text-2xl font-bold text-green-700">
              TZS 980,000 /=
            </Text>
          </View>
        </View>

        {/* Row: Low Stock + Expired Products */}
        <View className="flex-row gap-3 mb-4">
          {/* Low Stock */}
          <View className="flex-1 bg-sky-50 border border-sky-500 rounded-2xl p-4 shadow-sm flex-row items-center">
            <Ionicons name="cube-outline" size={22} color="#ee" />
            <View className="ml-2">
              <Text className="text-xs text-gray-500 mb-1">
                LOW STOCK
              </Text>
              <Text className="text-xl font-bold">
                12 Products
              </Text>
            </View>
          </View>

          {/* Expired Products */}
          <View className="flex-1 bg-sky-50 border border-sky-500 rounded-2xl p-4 shadow-sm flex-row items-center">
            <Ionicons name="alert-circle-outline" size={22} color="#ee" />
            <View className="ml-2">
              <Text className="text-xs text-gray-500 mb-1">
                EXPIRED
              </Text>
              <Text className="text-xl font-bold">
                5 Products
              </Text>
            </View>
          </View>
        </View>


      </View>

      {/* Bottom Section */}
      <View className="flex-1 mt-3">
        {/* Sales */}
        <Link href="/(tabs)/home/sales" asChild>
          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-sky-800 py-5 rounded-2xl mb-4 flex-row justify-center items-center"
          >
            <Ionicons name="add-circle" size={22} color="white" />
            <Text className="ml-2 text-white text-lg font-semibold">
              New Sale
            </Text>
          </TouchableOpacity>
        </Link>

        {/* Secondary Actions */}
        <Link href="/(tabs)/home/stock" asChild>
          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-sky-600 py-4 rounded-2xl mb-3 flex-row justify-center items-center"

          >
            <Ionicons name="cube-outline" size={20} color="#E3E3E3" />
            <Text className="ml-2 text-white text-base font-medium">
              Stock
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/home/debts" asChild>
          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-sky-600 py-4 rounded-2xl flex-row justify-center items-center"
          >
            <Ionicons name="card-outline" size={20} color="#E3E3E3" />
            <Text className="ml-2 text-white text-base font-medium">
              Debts
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

    </View>
  </>
}
