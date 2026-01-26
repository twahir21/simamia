```tsx
import { useCartStore } from "@/store/cart";
import { Feather } from "@expo/vector-icons";
import { FlatList, Pressable, Text, View } from "react-native";

export default function CartPreview () {

  const cart = useCartStore(state => state.items);

  console.log("Cart in preview: ", cart)

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

    return <>
    {/* MINI CART */}
      <View className="bg-white rounded-xl border border-gray-400 mx-4 my-2 px-3 py-2">
        {/* Compact meta row */}
        <Text className="text-xs text-gray-600">
          Items:{" "}
          <Text className="font-semibold text-gray-800">
            {cart.length}
          </Text>
        </Text>

        {/* Items list */}
        <View style={{ height: 70 }}> 
        {/* 3 items × 60px height each = 180px that must be max. */}
        <FlatList
            data={cart}
            keyExtractor={(item) => item.stockId.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
            const isLast = index === cart.length - item.qty;

            return (
                <View
                className={`flex-row justify-between items-center px-2 py-2 rounded-md ${
                    isLast ? "bg-green-50 border border-green-200" : ""
                }`}
                >
                {/* Left side: index + name */}
                <View className="flex-row items-center gap-1 flex-1">
                    <Text className="text-xs font-bold text-gray-500 w-5">
                    {index + 1}.
                    </Text>
                    <Text
                    className="text-sm font-medium text-gray-800 flex-1"
                    numberOfLines={1}
                    >
                    {item.name} × {item.qty}
                    </Text>
                </View>

                {/* Right side: price */}
                <View className="flex-row items-center gap-2">
                    <Text className="text-sm font-semibold text-gray-900">
                    {(item.price * item.qty).toLocaleString()}
                    </Text>
                    {isLast && <View className="w-2 h-2 rounded-full bg-green-500" />}
                </View>
                </View>
            );
            }}
        />
        </View>

        {/* Subtotal */}
        <View className="flex-row justify-between items-center mt-1 pt-1 border-t border-gray-400">
          <Text className="text-xs font-medium text-gray-600">
            Subtotal
          </Text>
          <Text className="text-sm font-bold text-gray-900">
            {totalAmount.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Bottom Actions */}
      <View className="px-4 py-2 bg-white">
        <View className="flex-row gap-3">
          <Pressable 
            className={`
              flex-1 border rounded-xl py-4 
              ${cart.length === 0 
                ? "border-gray-300 bg-gray-50" 
                : "border-sky-800 bg-white active:bg-blue-50"
              }
            `}
            disabled={cart.length === 0}
          >
            <Text className={`
              text-center font-semibold
              ${cart.length === 0 
                ? "text-gray-400" 
                : "text-sky-800"
              }
            `}>
              VIEW CART
            </Text>
          </Pressable>

          <Pressable
            className={`
              flex-1 rounded-xl py-4 flex-row items-center justify-center gap-2
              ${cart.length === 0
                ? "bg-gray-300"
                : "bg-sky-800 shadow-sm"
              }
            `}
            disabled={cart.length === 0}
          >
            <Feather name="save" size={14} color="white" />
            <Text className="text-center text-white font-bold">
              SAVE SALES
            </Text>
          </Pressable>
        </View>
      </View>
    </>
}