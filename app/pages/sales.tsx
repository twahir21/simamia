import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// ---------------- Hardcoded Mock Data ----------------
const MOCK_SALES = [
  {
    id: "TRX-9901",
    timestamp: "2026-02-07T10:30:00",
    customer: "Walk-in Customer",
    items: [
      { id: "1", name: "Wireless Mouse", qty: 2, price: 25 },
      { id: "2", name: "Mechanical Keyboard", qty: 1, price: 75 },
    ],
    total: 125.0,
    paymentMethod: "Card",
    status: "Completed",
  },
  {
    id: "TRX-9902",
    timestamp: "2026-02-07T09:15:00",
    customer: "John Doe",
    items: [{ id: "3", name: "USB-C Cable", qty: 1, price: 15 }],
    total: 15.0,
    paymentMethod: "Cash",
    status: "Refunded",
  },
  {
    id: "TRX-9895",
    timestamp: "2026-02-06T16:45:00",
    customer: "Jane Smith",
    items: [{ id: "4", name: "Monitor Stand", qty: 1, price: 45 }],
    total: 45.0,
    paymentMethod: "Transfer",
    status: "Completed",
  },
];

// ---------------- Components ----------------

const StatusBadge = ({ status }: { status: string }) => {
  const isRefunded = status === "Refunded";
  return (
    <View className={`px-2 py-1 rounded-md ${isRefunded ? "bg-red-100" : "bg-emerald-100"}`}>
      <Text className={`text-[10px] font-black uppercase ${isRefunded ? "text-red-600" : "text-emerald-600"}`}>
        {status}
      </Text>
    </View>
  );
};

const SaleItem = ({ sale, onPress }: { sale: any; onPress: () => void }) => {
  const iconMap: any = {
    Card: "credit-card-outline",
    Cash: "cash-check",
    Transfer: "swap-horizontal",
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white mx-4 mb-3 p-4 rounded-3xl border border-slate-200 flex-row items-center"
    >
      <View className="w-12 h-12 bg-slate-100 rounded-2xl items-center justify-center mr-4">
        <MaterialCommunityIcons name={iconMap[sale.paymentMethod]} size={24} color="#475569" />
      </View>
      
      <View className="flex-1">
        <View className="flex-row justify-between items-start">
          <Text className="text-slate-900 font-bold text-base">{sale.id}</Text>
          <Text className="text-slate-900 font-black text-base">${sale.total.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-slate-500 text-xs">{sale.items.length} items • {sale.customer}</Text>
          <StatusBadge status={sale.status} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function SalesHistoryPage() {
  const [selectedSale, setSelectedSale] = useState<any>(null);

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white px-6 pt-14 pb-6 border-b border-slate-200">
        <Text className="text-3xl font-black text-slate-900 tracking-tight">Sales History</Text>
        <Text className="text-slate-500 font-medium">Review and manage your transactions</Text>
      </View>

      {/* Summary Mini Cards */}
      <View className="flex-row px-4 py-6 justify-between">
        <View className="bg-blue-600 p-4 rounded-[28px] flex-1 mr-2 shadow-sm">
          <Text className="text-blue-100 text-xs font-bold uppercase tracking-wider">Todays Revenue</Text>
          <Text className="text-white text-2xl font-black mt-1">$140.00</Text>
        </View>
        <View className="bg-white p-4 rounded-[28px] flex-1 ml-2 border border-slate-200 shadow-sm">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">Transactions</Text>
          <Text className="text-slate-900 text-2xl font-black mt-1">24</Text>
        </View>
      </View>

      {/* Sales List */}
      <FlatList
        data={MOCK_SALES}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <Text className="px-6 mb-4 text-xs font-black text-slate-400 uppercase tracking-[2px]">Recent Activity</Text>
        )}
        renderItem={({ item }) => (
          <SaleItem sale={item} onPress={() => setSelectedSale(item)} />
        )}
      />

      {/* Receipt Detail Modal */}
      <Modal visible={!!selectedSale} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[40px] p-8 h-[80%]">
            <View className="items-center mb-6">
              <View className="w-12 h-1.5 bg-slate-200 rounded-full mb-6" />
              <Text className="text-xl font-black text-slate-900">Transaction Details</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-6">
                {selectedSale?.items.map((item: any) => (
                  <View key={item.id} className="flex-row justify-between mb-4">
                    <View>
                      <Text className="text-slate-900 font-bold">{item.name}</Text>
                      <Text className="text-slate-500 text-xs">Qty: {item.qty} x ${item.price}</Text>
                    </View>
                    <Text className="text-slate-900 font-bold">${item.qty * item.price}</Text>
                  </View>
                ))}
                <View className="border-t border-slate-200 pt-4 mt-2 flex-row justify-between">
                  <Text className="text-slate-900 font-black text-lg">Total Amount</Text>
                  <Text className="text-blue-600 font-black text-lg">${selectedSale?.total.toFixed(2)}</Text>
                </View>
              </View>

              <View className="space-y-4">
                <View className="flex-row justify-between px-2">
                  <Text className="text-slate-500 font-medium">Payment Method</Text>
                  <Text className="text-slate-900 font-bold">{selectedSale?.paymentMethod}</Text>
                </View>
                <View className="flex-row justify-between px-2 mt-3">
                  <Text className="text-slate-500 font-medium">Date & Time</Text>
                  <Text className="text-slate-900 font-bold">Feb 7, 2026 • 10:30 AM</Text>
                </View>
              </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View className="flex-row gap-4 mt-6">
              <TouchableOpacity 
                onPress={() => setSelectedSale(null)}
                className="flex-1 bg-slate-100 py-4 rounded-2xl items-center"
              >
                <Text className="text-slate-700 font-bold">Close</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-blue-600 py-4 rounded-2xl items-center flex-row justify-center">
                <Ionicons name="share-outline" size={18} color="white" />
                <Text className="text-white font-bold ml-2">Receipt</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}