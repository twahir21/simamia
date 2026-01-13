import { View, Text, TouchableOpacity, FlatList } from "react-native";

type Product = {
  id: string;
  name: string;
  price?: number;
  soldCount: number;
};

// TEMP hardcoded popular items
const popularItems: Product[] = [
  { id: "1", name: "Screen Repair", price: 15000, soldCount: 128 },
  { id: "2", name: "Battery Change", price: 8000, soldCount: 96 },
  { id: "3", name: "Phone Unlock", price: 5000, soldCount: 72 },
  { id: "4", name: "Charging Port Fix", price: 12000, soldCount: 54 },
  { id: "5", name: "Software Install", price: 6000, soldCount: 41 },
];

// Sort ONCE (important)
const sortedPopular = [...popularItems].sort(
  (a, b) => b.soldCount - a.soldCount
);

export default function PopularTab() {
  if (sortedPopular.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg font-semibold text-slate-700 mb-2">
          No sales data yet
        </Text>
        <Text className="text-center text-slate-500">
          Popular items will appear here as you make sales
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={sortedPopular}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={{ padding: 12 }}
      columnWrapperStyle={{ gap: 12 }}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            // later: add to cart
          }}
          className="flex-1 bg-amber-50 border border-amber-200 rounded-2xl p-4 min-h-[90px]"
        >
          {/* Rank badge */}
          <View className="absolute top-2 right-2 bg-amber-200 rounded-full px-2 py-0.5">
            <Text className="text-xs font-bold text-amber-800">
              #{index + 1}
            </Text>
          </View>

          <Text
            numberOfLines={2}
            className="font-semibold text-slate-900 mb-1"
          >
            {item.name}
          </Text>

          {item.price != null && (
            <Text className="text-amber-700 font-bold mt-auto">
              {Intl.NumberFormat("en-TZ").format(item.price)}
            </Text>
          )}
        </TouchableOpacity>
      )}
    />
  );
}
