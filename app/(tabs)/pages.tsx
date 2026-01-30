import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { View, Text, Image, Pressable, FlatList } from "react-native";

type DashboardItem = {
  id: string;
  title: string;
  image: any;
  route: Href;
};

const DATA: DashboardItem[] = [
  { id: "2", title: "Categories", image: require("@/assets/images/categories.png"), route: "/pages/categories" },
  { id: "3", title: "Customers", image: require("@/assets/images/customers.png"), route: "/pages/customers" },
  { id: "4", title: "Suppliers", image: require("@/assets/images/suppliers.png"), route: "/pages/suppliers" },
  { id: "5", title: "Re-Stock", image: require("@/assets/images/restocking.png"), route: "/pages/restock" },
  { id: "6", title: "Reports", image: require("@/assets/images/reports.png"), route: "/pages/reports" },
  { id: "7", title: "Expenses", image: require("@/assets/images/expenses.png"), route: "/pages/expenses" },
  { id: "8", title: "Sales", image: require("@/assets/images/sales.png"), route: "/pages/sales" },
];

export default function Pages() {
  const router = useRouter();
  return (
    <>
      <View className="px-4 pt-5 pb-2 bg-white border-b border-gray-400">
        <View className="flex-row items-center gap-2 pt-3">
          <Ionicons name="document-text-outline" size={24} color="#1F2937" />
          <Text className="text-xl font-bold text-gray-800">Pages</Text>
        </View>
      </View>

      <View className="flex-1 bg-gray-100 p-3">
        <View className="flex-1">
          <FlatList
            data={DATA}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item, index }) => (
              <View 
                className="flex-1 p-1.5" 
                style={{
                  // This ensures consistent width for all items
                  maxWidth: '50%'
                }}
              >
                <Pressable className="flex-1 bg-white rounded-2xl overflow-hidden shadow border border-gray-400 active:opacity-80"
                  onPress={() => router.push(item.route)}
                  >
                  {/* Image */}
                  <View className="h-28 bg-gray-200">
                    <Image
                      source={item.image}
                      resizeMode="cover"
                      className="w-full h-full"
                    />
                  </View>

                  {/* Text */}
                  <View className="p-3">
                    <Text className="text-base font-semibold text-gray-800 text-center">
                      {item.title}
                    </Text>
                  </View>
                </Pressable>
              </View>
            )}
          />
        </View>
      </View>
    </>
  );
}