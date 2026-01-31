import { Feather } from "@expo/vector-icons";
import { FlatList, Pressable, Text, View } from "react-native";

type ReceiptItem = {
  name: string;
  qty: number;
  price: number;
};

type Props = {
  receiptNo: string;
  date: string;
  cashier?: string;
  items: ReceiptItem[];
  total: number;
  paymentType: "CASH" | "MOBILE" | "BANK";
  onShare: () => void;
  onPrint: () => void;
  onDownload: () => void;
};

export default function ReceiptPreview({
  receiptNo,
  date,
  cashier = "Admin",
  items,
  total,
  paymentType,
  onShare,
  onPrint,
  onDownload,
}: Props) {
  return (
    <View className="flex-1 bg-gray-100 px-4 pt-4">
      {/* Receipt paper */}
      <View className="bg-white rounded-lg px-4 py-5 shadow-sm">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="font-extrabold text-lg">SIMAMIA SHOP</Text>
          <Text className="text-xs text-gray-600">
            Arusha • Tanzania
          </Text>
          <Text className="text-xs text-gray-600 mt-1">
            Receipt #{receiptNo}
          </Text>
        </View>

        {/* Meta */}
        <View className="border-t border-dashed border-gray-300 pt-2 mb-2">
          <Text className="text-xs text-gray-600">
            Date: {date}
          </Text>
          <Text className="text-xs text-gray-600">
            Cashier: {cashier}
          </Text>
          <Text className="text-xs text-gray-600">
            Payment: {paymentType}
          </Text>
        </View>

        {/* Items */}
        <View className="border-t border-dashed border-gray-300 py-2">
          <FlatList
            data={items}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs flex-1">
                  {item.name} × {item.qty}
                </Text>
                <Text className="text-xs font-semibold">
                  {(item.price * item.qty).toLocaleString()}
                </Text>
              </View>
            )}
          />
        </View>

        {/* Total */}
        <View className="border-t border-dashed border-gray-300 pt-2 mt-2">
          <View className="flex-row justify-between">
            <Text className="font-bold">TOTAL</Text>
            <Text className="font-bold">
              TZS {total.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-4 items-center">
          <Text className="text-xs text-gray-500">
            Asante kwa kununua 🙏
          </Text>
          <Text className="text-[10px] text-gray-400 mt-1">
            Powered by Simamia App
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row gap-3 mt-4">
        <Pressable
          onPress={onShare}
          className="flex-1 bg-white border border-gray-300 rounded-xl py-3 flex-row items-center justify-center gap-2"
        >
          <Feather name="share-2" size={16} />
          <Text className="font-semibold">Share</Text>
        </Pressable>

        <Pressable
          onPress={onPrint}
          className="flex-1 bg-white border border-gray-300 rounded-xl py-3 flex-row items-center justify-center gap-2"
        >
          <Feather name="printer" size={16} />
          <Text className="font-semibold">Print</Text>
        </Pressable>

        <Pressable
          onPress={onDownload}
          className="flex-1 bg-sky-800 rounded-xl py-3 flex-row items-center justify-center gap-2"
        >
          <Feather name="download" size={16} color="white" />
          <Text className="text-white font-semibold">Download</Text>
        </Pressable>
      </View>
    </View>
  );
}
