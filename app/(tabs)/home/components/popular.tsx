import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Trophy, TrendingUp, Package } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getTopSoldProducts } from '@/db/analysis.sqlite';
import { useFocusEffect } from 'expo-router';

interface PopularProduct {
  id: number;
  productName: string;
  price: number;
  itemsSold: number;
}

const PopularTab = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);

const fetchData = useCallback(() => {
  try {
    const raw = getTopSoldProducts() ?? [];

    const normalized: PopularProduct[] = raw
      .filter((item): item is PopularProduct => item.id !== null)
      .map(item => ({
        id: item.id,
        productName: item.productName,
        price: item.price,
        itemsSold: item.itemsSold,
      }));

    setPopularProducts(normalized);
  } catch (error) {
    console.warn('Failed to load popular products', error);
    setPopularProducts([]);
  }
}, []);


  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const isEmpty = popularProducts.length === 0;

  return (
    <ScrollView
      className="mt-4 px-4"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#2563eb"
        />
      }
      contentContainerStyle={isEmpty ? { flex: 1 } : undefined}
    >
      {/* HEADER */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="bg-blue-100 p-1.5 rounded-lg">
            <TrendingUp size={18} color="#2563eb" />
          </View>
          <Text className="ml-3 font-black text-slate-800 text-lg">
            Top Sellers
          </Text>
        </View>
        <View className="bg-slate-100 px-3 py-1 rounded-full">
          <Text className="text-slate-500 text-[10px] font-bold uppercase">
            Today
          </Text>
        </View>
      </View>

      {/* EMPTY STATE */}
      {isEmpty ? (
        <View className="flex-1 items-center justify-center mt-16 px-6">
          <View className="bg-slate-100 p-4 rounded-full mb-1">
            <Package size={32} color="#64748b" />
          </View>

          <Text className="text-slate-800 font-black text-base mb-1">
            No sales yet
          </Text>

          <Text className="text-slate-500 text-center text-sm">
            Top selling products will appear here after your first sales.
          </Text>

          <TouchableOpacity
            onPress={fetchData}
            className="mt-5 bg-sky-800 px-5 py-2.5 rounded-xl"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-sm">
              Refresh
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* LIST */
        <View className="gap-2">
          {popularProducts.map((item, index) => {
            const isTop = index === 0;
            const isSecond = index === 1;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                className={`flex-row items-center justify-between p-4 rounded-[24px] border-b-4 ${
                  isTop
                    ? 'bg-amber-50 border-amber-200'
                    : isSecond
                    ? 'bg-white border-slate-700'
                    : 'bg-white border-slate-400'
                } shadow-sm`}
              >
                {/* LEFT */}
                <View className="flex-row items-center flex-1">
                  <View
                    className={`w-10 h-10 rounded-2xl items-center justify-center mr-4 ${
                      isTop
                        ? 'bg-amber-400 rotate-[-10deg]'
                        : isSecond
                        ? 'bg-slate-700 rotate-[-10deg]'
                        : 'bg-slate-300'
                    }`}
                  >
                    <Text
                      className={`font-black ${
                        isTop || isSecond ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text
                      numberOfLines={1}
                      className={`font-bold ${
                        isTop ? 'text-amber-900' : 'text-slate-800'
                      }`}
                    >
                      {item.productName}
                    </Text>
                    <Text className="text-blue-600 font-bold text-xs">
                      {item.price.toLocaleString()} /=
                    </Text>
                  </View>
                </View>

                {/* RIGHT */}
                <View className="flex-row items-center">
                  <View className="items-end mr-3">
                    {isTop ? (
                      <View className="bg-amber-200/50 px-2 py-0.5 rounded-md flex-row items-center">
                        <Trophy size={10} color="#b45309" />
                        <Text className="text-[10px] font-black text-amber-800 ml-1">
                          {item.itemsSold}
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-[10px] font-bold text-slate-400 uppercase">
                        {item.itemsSold} Sold
                      </Text>
                    )}
                  </View>

                  <View
                    className={`p-2 rounded-full ${
                      isTop ? 'bg-amber-400' : 'bg-slate-800'
                    }`}
                  >
                    <MaterialIcons
                      name="local-fire-department"
                      size={16}
                      color="white"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default PopularTab;
