import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface RecentProduct {
  id: string;
  name: string;
  price: number;
  lastSold: string;
}

const RECENT_SOLD: RecentProduct[] = [
 { id: 'r1', name: 'Azam Embe 500ml', price: 1200, lastSold: '2m ago' }, { id: 'r2', name: 'White Bread', price: 1500, lastSold: '5m ago' }, { id: 'r3', name: 'Klipiti Small', price: 500, lastSold: '12m ago' }, { id: 'r4', name: 'Mo Extra', price: 600, lastSold: '18m ago' }, { id: 'r5', name: 'Milk Tetra 500ml', price: 3000, lastSold: '22m ago' }, { id: 'r6', name: 'Energy Drink', price: 2500, lastSold: '30m ago' }, { id: 'r7', name: 'Biscuits Pack', price: 2000, lastSold: '35m ago' }, { id: 'r8', name: 'Water 1L', price: 1000, lastSold: '40m ago' }, { id: 'r9', name: 'Sugar 1kg', price: 2500, lastSold: '45m ago' }, { id: 'r10', name: 'Cooking Oil 1L', price: 6000, lastSold: '50m ago' }, { id: 'r11', name: 'Rice 2kg', price: 5000, lastSold: '55m ago' }, { id: 'r12', name: 'Tomato Sauce', price: 3500, lastSold: '1h ago' }, { id: 'r13', name: 'Spaghetti Pack', price: 4000, lastSold: '1h 10m ago' }, { id: 'r14', name: 'Detergent Powder', price: 5000, lastSold: '1h 20m ago' }, { id: 'r15', name: 'Tea Pack', price: 2200, lastSold: '1h 30m ago' },
];



const RecentTab = () => {
  
  const handleResell = async (product: RecentProduct) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log(`Reselling: ${product.name}`);
  };

  const MAX_RECENT = 8;

  const visibleRecent = React.useMemo(
    () => RECENT_SOLD.slice(0, MAX_RECENT),
    []
  );


  return (
    <View className="mt-3">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
      >
        <View className="flex-row flex-wrap -mx-2">
          {visibleRecent.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleResell(item)}
              activeOpacity={0.9}
              className="w-1/2 px-2 mb-4"
            >
              {/* Main Card — UNCHANGED */}
              <View className="bg-slate-900 rounded-3xl py-3 px-5 shadow-xl shadow-slate-300 relative overflow-hidden">
                
                {/* Decorative background element */}
                <View className="absolute -top-10 -right-10 w-24 h-20 bg-blue-500/20 rounded-full" />
                
                <View className="flex-row justify-between items-start mb-3">
                  <View className="bg-white/10 px-2 py-1 rounded-lg">
                    <Text className="text-white/60 text-[9px] font-bold uppercase">
                      {item.lastSold}
                    </Text>
                  </View>
                  <Clock size={14} color="rgba(255,255,255,0.3)" />
                </View>

                <Text numberOfLines={1} className="text-white font-bold text-sm mb-1">
                  {item.name}
                </Text>
                
                <Text className="text-blue-400 font-black text-xs mb-2">
                  {item.price.toLocaleString()} TZS
                </Text>

              </View>
            </TouchableOpacity>
          ))}
        </View>

        {RECENT_SOLD.length > MAX_RECENT && (
          <Text className="text-center text-xs text-slate-400 mt-2">
            Showing last {MAX_RECENT} items 
          </Text>
        )}

      </ScrollView>

    </View>
  );
};

export default RecentTab;