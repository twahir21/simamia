import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Trophy, TrendingUp } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface PopularProduct {
  id: string;
  name: string;
  price: number;
  sold: number;
}

const POPULAR_PRODUCTS: PopularProduct[] = [
  { id: '1', name: 'Water 500ml', price: 600, sold: 510 },
  { id: '2', name: 'Coca Cola', price: 1500, sold: 342 },
  { id: '3', name: 'Biscuits', price: 2000, sold: 265 },
  { id: '4', name: 'Milk Tetra', price: 3000, sold: 198 },
  { id: '5', name: 'Energy Drink', price: 2500, sold: 176 },
];

const PopularTab = () => {
  return (
    <View className="mt-4 px-4">
      {/* HEADER */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="bg-blue-100 p-1.5 rounded-lg">
            <TrendingUp size={18} color="#2563eb" />
          </View>
          <Text className="ml-3 font-black text-slate-800 text-lg tracking-tight">
            Top Sellers
          </Text>
        </View>
        <View className="bg-slate-100 px-3 py-1 rounded-full">
          <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            Today
          </Text>
        </View>
      </View>

      {/* LIST */}
      <View className="gap-2">
        {POPULAR_PRODUCTS.map((item, index) => {
          const isTop = index === 0;
          const isSecond = index === 1;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => console.log('Quick sell:', item.name)}
              className={`flex-row items-center justify-between p-4 rounded-[24px] border-b-4 border ${
                isTop
                  ? 'bg-amber-50 border-amber-200'
                  : isSecond ?  'bg-white border-slate-700' : 'bg-white border-slate-400'
              } shadow-sm mb-2`}
              style={{ borderBottomWidth: 4 }} // Adds a tactile "button" feel
            >
              {/* LEFT: Rank and Info */}
              <View className="flex-row items-center flex-1">
                <View
                  className={`w-10 h-10 rounded-2xl items-center justify-center mr-4 ${
                    isTop 
                      ? 'bg-amber-400 rotate-[-10deg]' 
                      : isSecond ? 'bg-slate-700 rotate-[-10deg]' : 'bg-slate-300'
                  }`}
                >
                  <Text
                    className={`font-black text-base ${
                      isTop || isSecond ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {index + 1}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text
                    numberOfLines={1}
                    className={`font-bold text-base ${
                      isTop ? 'text-amber-900' : 'text-slate-800'
                    }`}
                  >
                    {item.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-blue-600 font-bold text-xs">
                      {item.price.toLocaleString()} /=
                    </Text>
                  </View>
                </View>
              </View>

              {/* RIGHT: Stats and Action */}
              <View className="flex-row items-center">
                <View className="items-end mr-3">
                   {isTop ? (
                     <View className="bg-amber-200/50 px-2 py-0.5 rounded-md flex-row items-center">
                        <Trophy size={10} color="#b45309" />
                        <Text className="text-[10px] font-black text-amber-800 ml-1">
                          {item.sold}
                        </Text>
                     </View>
                   ) : (
                    <Text className="text-[10px] font-bold text-slate-400 uppercase">
                      {item.sold} Sold
                    </Text>
                   )}
                </View>

                
                <View className={`p-2 rounded-full ${isTop ? 'bg-amber-400' : 'bg-slate-800'}`}>
                  <MaterialIcons name="local-fire-department" size={16} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default PopularTab;