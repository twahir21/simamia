import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { fetchHomeAnalysis } from "@/db/analysis.sqlite";


export default function App() {
  const [refreshing, setRefreshing] = useState(false);
  const [homeAnalysis, setHomeAnalysis] = useState({
    todaySales: 0,
    todayProfit: 0,
    lowStock: 0,
    outOfStock: 0,
    expiredProducts: 0
  });

  useFocusEffect(
    useCallback(() => {
      // This runs every time you navigate BACK to this screen
      setHomeAnalysis(fetchHomeAnalysis());
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setHomeAnalysis(fetchHomeAnalysis());
    setRefreshing(false);
  }, []);

  useEffect(() => {
    setHomeAnalysis(fetchHomeAnalysis())
  }, [refreshing]);

  return <>
  <ScrollView className="bg-white" refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }>
      <View className="flex-1 px-4 pt-4">

      {/* Top Section */}
      <View>
        {/* Header */}
        <Text className="text-sm text-gray-500 mb-4">
          Today Summary
        </Text>

        {/* Sales */}
        <View className="mb-4 bg-sky-50 border border-sky-500 rounded-2xl p-4 shadow-sm flex-row items-center">
          <Ionicons name="cash-outline" size={24} color="#ee" />
          <View className="ml-3">
            <Text className="text-xs text-gray-500 mb-1">
              TODAY SALES
            </Text>
            <Text className="text-2xl font-bold text-gray-800">
              TZS {homeAnalysis.todaySales.toLocaleString()}/=
            </Text>
          </View>
        </View>

        {/* Debts */}
        <View className="mb-4 bg-sky-50 border border-sky-500 rounded-2xl p-4 shadow-sm flex-row items-center">
          <Ionicons name="card-outline" size={24} color="#dc2626" />
          <View className="ml-3">
            <Text className="text-xs mb-1">
              OUTSTANDING DEBTS
            </Text>
            <Text className="text-2xl font-bold text-red-600">
              TZS 0/=
            </Text>
          </View>
        </View>

        {/* Profit */}
        <View className="mb-4 bg-sky-50 border border-sky-500 rounded-2xl p-4 shadow-sm flex-row items-center">
          <Ionicons name="trending-up-outline" size={24} color="#15803d" />
          <View className="ml-3">
            <Text className="text-xs text-gray-500 mb-1">
              TODAY PROFIT
            </Text>
            <Text className="text-2xl font-bold text-green-700">
              TZS {homeAnalysis.todayProfit.toLocaleString()}/=
            </Text>
          </View>
        </View>

        {/* Row: Low Stock + Expired Products */}
        <View className="flex-row gap-3 mb-4">
          {/* Low Stock */}
          <View className="flex-1 bg-sky-50 border border-sky-500 rounded-2xl p-4 shadow-sm flex-row items-center">
            <Ionicons name="cube-outline" size={22} color="#ee" />
            <View className="ml-2">
              <Text className="text-xs text-gray-500 mb-1">
                LOW & EMPTY STOCKS
              </Text>
              <Text className="text-xl font-bold">
                {homeAnalysis.outOfStock + homeAnalysis.lowStock} Products
              </Text>
            </View>
          </View>

          {/* Expired Products */}
          <View className="flex-1 bg-sky-50 border border-sky-500 rounded-2xl p-4 shadow-sm flex-row items-center">
            <Ionicons name="alert-circle-outline" size={22} color="#ee" />
            <View className="ml-2">
              <Text className="text-xs text-gray-500 mb-1">
                EXPIRED
              </Text>
              <Text className="text-xl font-bold">
                {homeAnalysis.expiredProducts} Products
              </Text>
            </View>
          </View>
        </View>


      </View>

      {/* Bottom Section */}
      <View className="flex-1 mt-3">
        {/* Sales */}
        <Link href="/(tabs)/home/sales" asChild>
          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-sky-800 py-5 rounded-2xl mb-4 flex-row justify-center items-center"
          >
            <Ionicons name="add-circle" size={22} color="white" />
            <Text className="ml-2 text-white text-lg font-semibold">
              New Sale
            </Text>
          </TouchableOpacity>
        </Link>

        {/* Secondary Actions */}
        <Link href="/(tabs)/home/stock" asChild>
          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-sky-600 py-4 rounded-2xl mb-3 flex-row justify-center items-center"

          >
            <Ionicons name="cube-outline" size={20} color="#E3E3E3" />
            <Text className="ml-2 text-white text-base font-medium">
              Stock
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/home/debts" asChild>
          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-sky-600 py-4 rounded-2xl flex-row justify-center items-center mb-3"
          >
            <Ionicons name="card-outline" size={20} color="#E3E3E3" />
            <Text className="ml-2 text-white text-base font-medium">
              Debts
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

    </View>
  </ScrollView>
  </>
}
