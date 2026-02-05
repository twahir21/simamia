import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Animated
} from 'react-native';
import { Clock, Package } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { getRecentSoldProducts } from '@/db/analysis.sqlite';
import { useFocusEffect } from 'expo-router';
import { timeAgo } from '@/helpers/timeAgo';
import { useCartStore } from '@/store/cart';
import { addToCart } from '@/db/stock.sqlite';
import { Feather } from '@expo/vector-icons';

interface RecentProduct {
  id: number;
  productName: string;
  price: number;
  lastSold: string;
}

interface RecentProductRow {
  id: number | null;
  productName: string;
  price: number;
  lastSold: string; // ISO / SQLite datetime string
}


const MAX_RECENT = 10;

const RecentTab = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [feedbackProduct, setFeedbackProduct] = useState<RecentProduct | null>(null);
  

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lastAddTime = useRef<number>(0);
  
  
  // Store
  const addItem = useCartStore(state => state.addItem);

  const fetchData = useCallback(() => {
    try {
      const raw = (getRecentSoldProducts() ?? []) as RecentProductRow[];

      const normalized: RecentProduct[] = raw
        .filter((i): i is RecentProductRow & { id: number } => i.id !== null)
        .map(i => ({
          id: i.id,
          productName: i.productName,
          price: i.price,
          lastSold: i.lastSold,
        }))
        .slice(0, MAX_RECENT);

      setRecentProducts(normalized);
    } catch (err) {
      console.warn('Failed to load recent products', err);
      setRecentProducts([]);
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

  const saveToCart = (product: RecentProduct) => {
      const now = Date.now();
      if (now - lastAddTime.current < 500) return; // Prevent rapid tapping
      if (isAdding) return;
      
      lastAddTime.current = now;
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  
  
      // Show feedback
      setFeedbackProduct(product);
      fadeAnim.setValue(0);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setFeedbackProduct(null);
          });
        }, 1500);
      });
  
      // Reset adding state
      setTimeout(() => setIsAdding(false), 500);
      
      // adds to global cart
      const stockFromDb = addToCart(Number(product.id));
  
      if (stockFromDb) {
        addItem({
          stockId: stockFromDb.id,
          name: stockFromDb.productName,
          price: stockFromDb.sellingPrice,
          qty: 1
        })
      }
    }
  

  const isEmpty = recentProducts.length === 0;

  return (
    <View className="mt-3 flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={
          isEmpty
            ? { flex: 1, justifyContent: 'center', alignItems: 'center' }
            : { paddingHorizontal: 20, paddingBottom: 20 }
        }
      >
        {/* Feedback Toast */}
        {feedbackProduct && (
          <Animated.View 
            style={[styles.feedbackToast, { opacity: fadeAnim }]}
            className="absolute top-2 left-4 right-4 bg-green-50 border border-green-200 rounded-xl p-4 flex-row items-center z-50"
          >
            <Feather name="check-circle" size={24} color="#10b981" />
            <View className="ml-3 flex-1">
              <Text className="text-green-800 font-semibold">Added to cart!</Text>
              <Text className="text-green-700 text-sm">{feedbackProduct.productName}</Text>
            </View>
            <Text className="text-green-600 font-bold">{feedbackProduct.price.toLocaleString()} TZS</Text>
          </Animated.View>
        )}
        {/* EMPTY STATE */}
        {isEmpty ? (
          <View className="items-center px-8">
            <View className="bg-slate-100 p-4 rounded-full mb-4">
              <Package size={28} color="#64748b" />
            </View>

            <Text className="font-black text-slate-800 mb-1">
              No recent sales
            </Text>

            <Text className="text-slate-500 text-sm text-center">
              Recently sold products will appear here for fast resell.
            </Text>
          </View>
        ) : (
          <>
            {/* GRID */}
            <View className="flex-row flex-wrap -mx-2">
              {recentProducts.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => saveToCart(item)}
                  activeOpacity={0.9}
                  className="w-1/2 px-2 mb-4"
                >
                  <View className="bg-slate-900 rounded-3xl py-3 px-5 shadow-xl relative overflow-hidden">
                    <View className="absolute -top-10 -right-10 w-24 h-20 bg-blue-500/20 rounded-full" />

                    <View className="flex-row justify-between items-start mb-3">
                      <View className="bg-white/10 px-2 py-1 rounded-lg">
                        <Text className="text-white/60 text-[9px] font-bold uppercase">
                          {timeAgo(item.lastSold)}
                        </Text>
                      </View>
                      <Clock size={14} color="rgba(255,255,255,0.3)" />
                    </View>

                    <Text
                      numberOfLines={1}
                      className="text-white font-bold text-sm mb-1"
                    >
                      {item.productName}
                    </Text>

                    <Text className="text-blue-400 font-black text-xs mb-2">
                      {item.price.toLocaleString()} TZS
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {recentProducts.length === MAX_RECENT && (
              <Text className="text-center text-xs text-slate-400 mt-2">
                Showing last {MAX_RECENT} items
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  feedbackToast: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default RecentTab;
