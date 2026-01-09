import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, Pressable, FlatList } from "react-native";

type DashboardItem = {
  id: string;
  title: string;
  image: any;
  route: string;
};

const DATA: DashboardItem[] = [
  { id: "1", title: "Products", image: require("../../assets/images/products.png"), route: "/products" },
  { id: "2", title: "Categories", image: require("../../assets/images/categories.png"), route: "/categories" },
  { id: "3", title: "Customers", image: require("../../assets/images/customers.png"), route: "/customers" },
  { id: "4", title: "Suppliers", image: require("../../assets/images/suppliers.png"), route: "/suppliers" },
  { id: "5", title: "Re-Stock", image: require("../../assets/images/restocking.png"), route: "/restock" },
  { id: "6", title: "Reports", image: require("../../assets/images/reports.png"), route: "/reports" },
  { id: "7", title: "Expenses", image: require("../../assets/images/expenses.png"), route: "/expenses" },
  { id: "8", title: "Sales", image: require("../../assets/images/sales.png"), route: "/sales" },

];



export default function Pages() {
    return <>
    <View className="px-4 pt-8 pb-2 bg-white border-b border-gray-400">
        <View className="flex-row items-center gap-2 pt-3">
            <Ionicons name="document-text-outline" size={24} color="#1F2937" />
            <Text className="text-xl font-bold text-gray-800">Pages</Text>
        </View>        
    </View>

    <View className="flex-1 bg-gray-100 px-3 pt-4">
      <FlatList
        data={DATA}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <Pressable className="flex-1 bg-white rounded-2xl overflow-hidden shadow border border-gray-400">
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
              <Text className="text-base font-semibold text-gray-800">
                {item.title}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
    </>
}
