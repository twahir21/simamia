import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Animated,
  StyleSheet,
} from 'react-native';
import { Search, PinOff } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Entypo, Feather, Octicons } from '@expo/vector-icons';
import { addToCart, fetchAllStock } from '@/db/stock.sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCartStore } from '@/store/cart';

interface Product {
  id: string;
  name: string;
  price: number;
}

const MAX_PINS = 15;

/* ---------- COLOR SYSTEM ---------- */

const COLOR_PALETTE = [
  'bg-red-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-purple-100',
  'bg-pink-100',
  'bg-orange-100',
  'bg-teal-100',
  'bg-indigo-100',
  'bg-lime-100',
  'bg-rose-100',
  'bg-cyan-100',
  'bg-amber-100',
  'bg-emerald-100',
  'bg-violet-100',
] as const;

const getColorById = (id: string) => {
  const index =
    Math.abs(id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) %
    COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
};

/* ---------- COMPONENT ---------- */

const PinnedTab = () => {
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isHydrated, setIsHydrated] = useState(false); // New Guard State
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const [feedbackProduct, setFeedbackProduct] = useState<Product | null>(null);


  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lastAddTime = useRef<number>(0);
  
  
  // Store
  const addItem = useCartStore(state => state.addItem);

  const [products, setProducts] = useState<Product[]>([]);

  const saveToCart = (product: Product) => {
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


    // 1. LOAD: Run only once on mount
    useEffect(() => {
      setIsLoading(true);
      const data = fetchAllStock().map(p => ({
          id: String(p.id),
          name: p.productName,
          price: p.sellingPrice,
      }));
      setProducts(data);
      const loadPinned = async () => {
        try {
          const data = await AsyncStorage.getItem('PINNED_SALES');
          if (data) {
            setPinnedIds(JSON.parse(data));
          }
        } catch (e) {
          console.error("Failed to load pins", e);
        } finally {
          setIsHydrated(true); // Mark as ready
        }
      };
      loadPinned();
      setIsLoading(false)
    }, []);

    // 2. SAVE: Run whenever pinnedIds changes, BUT only if hydrated
    useEffect(() => {
      if (isHydrated) {
        AsyncStorage.setItem('PINNED_SALES', JSON.stringify(pinnedIds));
      }
    }, [pinnedIds, isHydrated]);




  const togglePin = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (pinnedIds.includes(id)) {
      setPinnedIds(p => p.filter(x => x !== id));
      return;
    }

    if (pinnedIds.length >= MAX_PINS) {
      Alert.alert(
        'Limit reached',
        `Only ${MAX_PINS} products can be pinned`
      );
      return;
    }

    setPinnedIds(p => [...p, id]);
  };

  const pinnedProducts = useMemo(
    () => products.filter(p => pinnedIds.includes(p.id)),
    [pinnedIds, products]
  );

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    return products.filter(
      p =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        !pinnedIds.includes(p.id)
    );
  }, [search, pinnedIds, products]);

  return (
    <View className="p-4 bg-white flex-1">
      {/* Feedback Toast */}
      {feedbackProduct && (
        <Animated.View 
          style={[styles.feedbackToast, { opacity: fadeAnim }]}
          className="absolute top-4 left-4 right-4 bg-green-50 border border-green-200 rounded-xl p-4 flex-row items-center z-50"
        >
          <Feather name="check-circle" size={24} color="#10b981" />
          <View className="ml-3 flex-1">
            <Text className="text-green-800 font-semibold">Added to cart!</Text>
            <Text className="text-green-700 text-sm">{feedbackProduct.name}</Text>
          </View>
          <Text className="text-green-600 font-bold">{feedbackProduct.price.toLocaleString()} TZS</Text>
        </Animated.View>
      )}
      {/* SEARCH AT TOP */}
      <View className="flex-row items-center bg-slate-100 border border-gray-400 rounded-2xl px-4 py-1 mb-4">
        <Search size={16} color="#94a3b8" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search product to pin…"
          placeholderTextColor="#94a3b8"
          className="ml-3 flex-1 text-slate-800"
        />
      </View>

      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Entypo name="pin" size={20} color="#1F2937" />
          <Text className="ml-2 font-bold text-slate-800">
            Pinned Products
          </Text>
        </View>
        <Text className="text-xs text-slate-400">
          {pinnedIds.length}/{MAX_PINS}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        >
        {/* PINNED GRID */}
        {isLoading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-slate-400 mt-4 text-xs font-medium">
              Syncing pinned products...
            </Text>
          </View>
        ) :pinnedProducts.length > 0 ? (
            <View className="flex-row flex-wrap -mx-2 mb-6">
            {pinnedProducts.map(product => (
                <TouchableOpacity
                key={product.id}
                onPress={() => saveToCart(product)}
                onLongPress={() => togglePin(product.id)}
                delayLongPress={400}
                activeOpacity={0.85}
                className="w-1/2 px-2 mb-4"
                >
                <View
                    className={`${getColorById(
                    product.id
                    )} rounded-3xl p-5 relative shadow-sm`}
                >
                    <Text
                    numberOfLines={1}
                    className="font-extrabold text-slate-900 text-base mb-1"
                    >
                    {product.name}
                    </Text>

                    <Text className="text-sm text-slate-600 font-medium">
                    {product.price.toLocaleString()} TZS
                    </Text>

                    {/* Long-press hint / unpin indicator */}
                    <View className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full">
                    <PinOff size={14} color="#475569" />
                    </View>
                </View>
                </TouchableOpacity>
            ))}
            </View>

        ) : (
            <View className="py-10 items-center bg-slate-50 rounded-3xl border border-dashed border-slate-400 mb-4">
            <Octicons name="pin-slash" size={26} color="#64748b"/>
            <Text className="text-xs text-slate-500 mt-3 text-center px-6">
                Hold a product from search results to pin it here
            </Text>
            </View>
        )}

        {/* SEARCH RESULTS */}
        {searchResults.map(item => (
            <TouchableOpacity
            key={item.id}
            onLongPress={() => togglePin(item.id)}
            delayLongPress={400}
            className="flex-row justify-between items-center p-4 mb-2 rounded-2xl border border-slate-100"
            >
            <View>
                <Text className="font-bold text-slate-800">
                {item.name}
                </Text>
                <Text className="text-xs text-slate-500">
                {item.price.toLocaleString()} TZS
                </Text>
            </View>
            <Text className="text-[10px] font-bold text-blue-600">
                HOLD TO PIN
            </Text>
            </TouchableOpacity>
        ))}
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

export default PinnedTab;
