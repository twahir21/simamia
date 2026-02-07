import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { initialSuppliers } from "@/types/orders.types";
import { router } from "expo-router";

// ---------------- Types ----------------
type Product = {
  id: string;
  name: string;
  costPrice: number; // supplier price
  sellingPrice?: number; // our system price
  stock: number;
};

type OrderItem = {
  id: string;
  name: string;
  qty: number;
};

export type Supplier = {
  id: string;
  name: string;
  phone: string;
  deliveryCost: number;
  products: Product[];
  ordersNeeded: OrderItem[];
};

 
// ---------------- Helpers ----------------
const getLevel = (products: Product[]) => {
  const lowCount = products.filter((p) => p.stock <= 2).length;
  if (lowCount >= 2) return "high";
  if (lowCount === 1) return "medium";
  return "low";
};

const getLevelStyles = (products: Product[]) => {
  const level = getLevel(products);

  switch (level) {
    case "high":
      return {
        bg: "bg-red-100",
        text: "text-red-600",
      };

    case "medium":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
      };

    default:
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-600",
      };
  }
};




const profitCalc = (p: Product, deliveryShare: number) => {
  if (!p.sellingPrice) return 0;
  return p.sellingPrice - p.costPrice - deliveryShare;
};



// ---------------- Component ----------------

const SupplierCard = ({ item, onEdit, onDelete }: { item: Supplier; onEdit: (s: Supplier) => void; onDelete: (id: string) => void }) => {
  const [expandedProducts, setExpandedProducts] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(false);

  const deliveryShare = item.deliveryCost / (item.products.length || 1);
  
  // Clean phone for WhatsApp: removes '+' and non-numeric chars
  const cleanPhone = item.phone.replace(/\D/g, "");

  const ExpandButton = ({ isExpanded, onPress }: { isExpanded: boolean; onPress: () => void }) => (
    <View className="items-center -mt-3 mb-2">
      <TouchableOpacity 
        onPress={onPress}
        className={`flex-row items-center px-4 py-1.5 rounded-full border ${
          isExpanded ? "bg-slate-800 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <Text className={`text-[11px] font-bold mr-1 ${isExpanded ? "text-white" : "text-slate-600"}`}>
          {isExpanded ? "CLOSE" : "VIEW ALL"}
        </Text>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={14} 
          color={isExpanded ? "white" : "#475569"} 
        />
      </TouchableOpacity>
    </View>
  );

    const [copied, setCopied] = useState(false);
    const [restockCopied, setRestockCopied] = useState(false)
    const inventoryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const restockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInventoryCopy = async () => {
    await Clipboard.setStringAsync(
      item.products.map(p => `${p.name}`).join(", ")
    );

    setCopied(true);

    if (inventoryTimer.current)
      clearTimeout(inventoryTimer.current);

    inventoryTimer.current = setTimeout(() => {
      setCopied(false);
    }, 3000);
  };


  const handleRestockCopy = async () => {
    await Clipboard.setStringAsync(
      item.ordersNeeded.map(o => `${o.name} x${o.qty}`).join(", ")
    );

    setRestockCopied(true);

    if (restockTimer.current)
      clearTimeout(restockTimer.current);

    restockTimer.current = setTimeout(() => {
      setRestockCopied(false);
    }, 3000);
  };

  const level = getLevel(item.products);
  const styles = getLevelStyles(item.products);

  return (
    <View className="bg-white rounded-[32px] p-6 mb-5 shadow-sm border border-slate-400">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-1">
          <Text className="text-2xl font-black text-slate-900 tracking-tight">{item.name}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="call-outline" size={14} color="#64748b" />
            <Text className="text-slate-500 font-bold ml-1">{item.phone}</Text>
          </View>
        </View>
        <View className={`px-3 py-1 rounded-full ${styles.bg}`}>
          <Text className={`text-[10px] font-black uppercase ${styles.text}`}>
            {level} Priority
          </Text>
        </View>
      </View>

      {/* List Section: Products */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-2 px-1">
          <Text className="text-xs font-black text-slate-400 uppercase tracking-widest">Inventory ({item.products.length} items)</Text>
          <TouchableOpacity
            onPress={handleInventoryCopy}
            activeOpacity={0.7}
            className={`flex-row items-center px-2 py-1 rounded-lg border 
              ${copied ? "bg-sky-50 border-sky-800" : "bg-slate-100 border-slate-400"}`}
          >
            <Ionicons
              name={copied ? "checkmark" : "copy"}
              size={14}
              color={copied ? "#075985" : "#64748b"}
            />
            <Text
              className={`ml-1 text-xs font-semibold 
                ${copied ? "text-sky-800" : "text-slate-500"}`}
            >
              {copied ? "Copied" : "Copy"}
            </Text>
          </TouchableOpacity>
        </View>

        <View 
          className="overflow-hidden bg-slate-50 border border-slate-300 rounded-2xl px-3 pt-3 pb-4" 
          style={{ height: expandedProducts ? undefined : 85 }}
        >
          {item.products.map((p) => (
            <View key={p.id} className="flex-row justify-between items-center py-1 mb-1 border-b border-slate-200">
              <Text className="text-slate-700 font-medium">· {p.name}</Text>
              <Text className="text-emerald-600 text-xs font-bold">+ {profitCalc(p, deliveryShare)}</Text>
            </View>
          ))}
          {!expandedProducts && (
             <View className="absolute bottom-0 left-0 right-0 h-10 bg-white/20" style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }} />
          )}
        </View>
        <ExpandButton isExpanded={expandedProducts} onPress={() => setExpandedProducts(!expandedProducts)} />
      </View>

      {/* List Section: Orders */}
      <View className="mb-6">

        <View className="flex-row justify-between items-center mb-2 px-1">
          <Text className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Restock List ({item.ordersNeeded.length} items)
          </Text>

          <TouchableOpacity
            onPress={handleRestockCopy}
            activeOpacity={0.7}
            className={`flex-row items-center px-2 py-1 rounded-lg border 
              ${restockCopied ? "bg-sky-50 border-sky-800" : "bg-slate-100 border-slate-400"}`}
          >
            <Ionicons
              name={restockCopied ? "checkmark" : "clipboard-outline"}
              size={14}
              color={restockCopied ? "#075985" : "#64748b"}
            />
            <Text
              className={`ml-1 text-xs font-semibold 
                ${restockCopied ? "text-sky-800" : "text-slate-500"}`}
            >
              {restockCopied ? "Copied" : "Copy"}
            </Text>
          </TouchableOpacity>
        </View>

        <View 
          className="overflow-hidden bg-blue-50/50 rounded-2xl px-3 pt-3 pb-4 border border-blue-200" 
          style={{ height: expandedOrders ? 'auto' : 85 }}
        >
          {item.ordersNeeded.map((o) => (
            <View key={o.id} className="flex-row justify-between items-center py-1 border-b border-blue-100">
              <Text className="text-slate-800 font-semibold">{o.name}</Text>
              <View className="bg-sky-800 px-2 py-0.5 rounded-md">
                <Text className="text-white text-[10px] font-bold">QTY {o.qty}</Text>
              </View>
            </View>
          ))}
          {!expandedOrders && (
             <View className="absolute bottom-0 left-0 right-0 h-10" style={{ backgroundColor: 'rgba(239, 246, 255, 0.8)' }} />
          )}
        </View>
        <ExpandButton isExpanded={expandedOrders} onPress={() => setExpandedOrders(!expandedOrders)} />
      </View>

      {/* Action Footer */}
      <View className="flex-row items-center justify-between border-t border-slate-400 pt-5">
        <View className="flex-row gap-6">
          <TouchableOpacity 
            onPress={() => Linking.openURL(`tel:${item.phone}`)}
            className="w-12 h-12 bg-slate-900 rounded-2xl items-center justify-center shadow-lg shadow-slate-300"
          >
            <Ionicons name="call" size={20} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => Linking.openURL(`https://wa.me/${cleanPhone}`)}
            className="w-12 h-12 bg-emerald-500 rounded-2xl items-center justify-center shadow-lg shadow-emerald-200"
          >
            <MaterialCommunityIcons name="whatsapp" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => Linking.openURL(`sms:${item.phone}`)}
            className="w-12 h-12 bg-blue-500 rounded-2xl items-center justify-center shadow-lg shadow-blue-200"
          >
            <Ionicons name="chatbubble" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-6">
          <TouchableOpacity onPress={() => onEdit(item)} className="p-3 bg-slate-100 rounded-xl">
            <Ionicons name="pencil" size={18} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id)} className="p-3 bg-red-50 rounded-xl">
            <Ionicons name="trash" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const AnalyticsCards = ({ suppliers }: { suppliers: Supplier[] }) => {
  // Logic derived from your existing functions
  const stats = {
    totalSuppliers: suppliers.length,
    highPriority: suppliers.filter((s) => getLevel(s.products) === "high").length,
    totalItemsToOrder: suppliers.reduce((acc, s) => acc + s.ordersNeeded.length, 0),
    potentialProfit: suppliers.reduce((acc, s) => {
      const deliveryShare = s.deliveryCost / (s.products.length || 1);
      return (
        acc +
        s.products.reduce((pAcc, p) => pAcc + profitCalc(p, deliveryShare), 0)
      );
    }, 0),
  };

  const Card = ({ 
    label, 
    value, 
    icon, 
    colorClass, 
    iconColor 
  }: { 
    label: string; 
    value: string | number; 
    icon: any; 
    colorClass: string; 
    iconColor: string; 
  }) => (
  <View className={`mr-4 p-3 rounded-3xl border border-slate-400 bg-slate-100 shadow-sm w-40`}>
    <View className="flex-row items-center">
      <View className={`w-8 h-8 rounded-full ${colorClass} items-center justify-center`}>
        <Ionicons name={icon} size={16} color={iconColor} />
      </View>
      <Text className="text-slate-500 text-[10px] ml-2 font-black uppercase tracking-wider">{label}</Text>
    </View>
    <Text className="text-slate-900 text-xl font-black mt-0.5 text-center">{value}</Text>
  </View>
  );

  return (
    <View className="bg-white py-4 border-b border-gray-400">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        data={[
          {
            label: "Critical",
            value: stats.highPriority,
            icon: "alert-circle",
            colorClass: "bg-red-100",
            iconColor: "#ef4444",
          },
          {
            label: "To Order",
            value: stats.totalItemsToOrder,
            icon: "cart",
            colorClass: "bg-blue-100",
            iconColor: "#3b82f6",
          },
          {
            label: "Est. Profit",
            value: `${Number(stats.potentialProfit.toFixed(0)).toLocaleString()}/=`,
            icon: "cash",
            colorClass: "bg-emerald-100",
            iconColor: "#10b981",
          },
          {
            label: "Suppliers",
            value: stats.totalSuppliers,
            icon: "business",
            colorClass: "bg-slate-100",
            iconColor: "#475569",
          },
        ]}
        renderItem={({ item }) => <Card {...item} />}
        keyExtractor={(item) => item.label}
      />
    </View>
  );
};

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [modal, setModal] = useState(false);
  const [nameEdit, setNameEdit] = useState("");


  const handleDelete = (id: string) => {
    Alert.alert("Delete Supplier", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setSuppliers(s => s.filter(x => x.id !== id)) }
    ]);
  };

  const openEdit = (s: Supplier) => {
    setSelected(s);
    setNameEdit(s.name);
    setModal(true);
  };

  const goBack = () => {
    router.push("/(tabs)/pages")
  }

  return (
    <View className="flex-1 bg-slate-100">
      <View className="px-4 pt-5 pb-2 bg-white border-b border-gray-400">
        <View className="flex-row items-center gap-2 pt-3">
          <Ionicons name="arrow-back-sharp" size={24} color="black" onPress={goBack}/>
          <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="#1F2937" />
          <Text className="text-xl font-bold text-gray-800">Suppliers</Text>
        </View>
      </View>

      {/* Analytics Section */}
      <AnalyticsCards suppliers={suppliers} />
      
      <FlatList 
        data={suppliers} 
        contentContainerStyle={{ padding: 16 }}
        keyExtractor={(i) => i.id} 
        renderItem={({ item }) => (
          <SupplierCard 
            item={item} 
            onEdit={openEdit} 
            onDelete={handleDelete} 
          />
        )} 
      />

      {/* Edit Modal (Keeping your logic but styling it) */}
      <Modal visible={modal} transparent animationType="fade">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 pb-10">
            <Text className="text-xl font-bold mb-4 text-slate-900">Edit Supplier Name</Text>
            <TextInput
              value={nameEdit}
              onChangeText={setNameEdit}
              placeholder="Supplier Name"
              className="bg-slate-100 p-4 rounded-2xl text-lg mb-6"
            />
            <View className="flex-row space-x-4">
              <TouchableOpacity className="flex-1 bg-slate-200 p-4 rounded-2xl" onPress={() => setModal(false)}>
                <Text className="text-center font-bold text-slate-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-blue-600 p-4 rounded-2xl" onPress={() => {
                 setSuppliers(prev => prev.map(s => s.id === selected?.id ? { ...s, name: nameEdit } : s));
                 setModal(false);
              }}>
                <Text className="text-center font-bold text-white">Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}