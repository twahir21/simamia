import { View, Text, TouchableOpacity, FlatList } from "react-native";

type Product = {
  id: string;
  name: string;
  price?: number;
};

// TEMP hardcoded pinned items
const pinnedItems: Product[] = [
  { id: "1", name: "Screen Repair", price: 15000 },
  { id: "2", name: "Battery Change", price: 8000 },
  { id: "3", name: "Unlock Phone", price: 5000 },
  { id: "4", name: "Charging Port", price: 12000 },
];

export default function PinnedTab() {
  if (pinnedItems.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg font-semibold text-slate-700 mb-2">
          No pinned items
        </Text>
        <Text className="text-center text-slate-500">
          Long-press any product to pin it here for quick access
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pinnedItems}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={{ padding: 12 }}
      columnWrapperStyle={{ gap: 12 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            // later: add to cart
          }}
          onLongPress={() => {
            // later: unpin
          }}
          className="flex-1 bg-sky-50 border border-sky-200 rounded-2xl p-4 min-h-[90px]"
        >
          <Text
            numberOfLines={2}
            className="font-semibold text-slate-900 mb-1"
          >
            {item.name}
          </Text>

          {item.price != null && (
            <Text className="text-sky-700 font-bold mt-auto">
              {Intl.NumberFormat("en-TZ").format(item.price)}
            </Text>
          )}
        </TouchableOpacity>
      )}
    />
  );
}
