import { View, Text, TouchableOpacity, FlatList } from "react-native";

type RecentSale = {
  id: string;
  name: string;
  price: number;
  soldAt: number; // timestamp
};

// TEMP hardcoded recent sales (latest first)
const recentSales: RecentSale[] = [
  {
    id: "1",
    name: "Screen Repair",
    price: 15000,
    soldAt: Date.now() - 2 * 60 * 1000, // 2 min ago
  },
  {
    id: "2",
    name: "Battery Change",
    price: 8000,
    soldAt: Date.now() - 10 * 60 * 1000,
  },
  {
    id: "3",
    name: "Phone Unlock",
    price: 5000,
    soldAt: Date.now() - 30 * 60 * 1000,
  },
];

function timeAgo(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff} min ago`;
  const hours = Math.floor(diff / 60);
  return `${hours}h ago`;
}

export default function RecentTab() {
  if (recentSales.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg font-semibold text-slate-700 mb-2">
          No recent sales
        </Text>
        <Text className="text-center text-slate-500">
          Items you sell will appear here for quick reuse
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={recentSales}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 12 }}
      ItemSeparatorComponent={() => (
        <View className="h-px bg-slate-200 my-1" />
      )}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            // later: add same item to cart
          }}
          className="bg-white py-3 px-2 flex-row items-center"
        >
          <View className="flex-1">
            <Text
              numberOfLines={1}
              className="font-semibold text-slate-900"
            >
              {item.name}
            </Text>
            <Text className="text-xs text-slate-500 mt-0.5">
              {timeAgo(item.soldAt)}
            </Text>
          </View>

          <Text className="font-bold text-slate-700">
            {Intl.NumberFormat("en-TZ").format(item.price)}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}
