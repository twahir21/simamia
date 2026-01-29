// components/SmartSearch.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  ListRenderItem,
  TextInput as RNTextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Pressable,
  Modal,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { AntDesign, Entypo, Feather, FontAwesome6, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { PackageSearch } from 'lucide-react-native';
import { addToCart, fetchAllStock } from '@/db/stock.sqlite';
import { useCartStore } from '@/store/cart';
import { AppError } from '@/types/globals.types';
import ErrorModal from './ui/Error';

// Types
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  addedToCart?: boolean;
}

interface ScoredProduct extends Product {
  score: number;
  matchedIndices?: [number, number][];
}

// AsyncStorage keys
const RECENT_SEARCHES_KEY = '@smartsearch_recent_searches';
const MAX_RECENT_SEARCHES = 10;

const SmartSearch: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<ScoredProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [feedbackProduct, setFeedbackProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeError, setActiveError] = useState<AppError | null>(null);

  // Store
  const addItem = useCartStore(state => state.addItem);
  

  // Refs
  const inputRef = useRef<RNTextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lastAddTime = useRef<number>(0);
  


  // Auto focus on mount
  useEffect(() => {
    if (showSuggestions) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [showSuggestions]);

  // Load products from database and recent searches from AsyncStorage
  const loadProductsAndRecentSearches = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Load products from database
      const rawProducts = fetchAllStock();
      
      // Transform to Product format
      const transformedProducts: Product[] = rawProducts.map(p => ({
        id: Number(p.id),
        name: p.productName,
        category: p.category || 'Uncategorized',
        price: p.sellingPrice || 0
      }));
      
      setProducts(transformedProducts);
      
      // Load recent searches from AsyncStorage
      const recentSearchesJson = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (recentSearchesJson) {
        const oldRecent = JSON.parse(recentSearchesJson) as Product[];

        const refreshedRecent: Product[] = oldRecent
        .map(old => {
          const fresh = transformedProducts.find(p => p.id === old.id);
          return fresh ? { ...fresh } : null;
        })
        .filter(Boolean) as Product[];

        setRecentSearches(refreshedRecent);
      }
    } catch (error) {
        setActiveError({
          type: "LOAD",
          message:
            error instanceof Error
              ? error.message
              : "Failed to load products or Recent searches",
          retry: loadProductsAndRecentSearches,
        });

    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load products and recent searches on mount
  useEffect(() => {
    loadProductsAndRecentSearches();
  }, [loadProductsAndRecentSearches]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadProductsAndRecentSearches();
    } finally {
      setRefreshing(false);
    }
  }, [loadProductsAndRecentSearches]);

  // Save recent searches to AsyncStorage
  const saveRecentSearches = async (searches: Product[]) => {
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      setActiveError({
        type: "SAVE",
        message: error instanceof Error ? error.message : 'Error saving recent Searches',
        retry: () => saveRecentSearches(searches)
      })
    }
  };

  
  // Typo tolerance helper function
  const getTypoToleranceScore = (query: string, text: string): number => {
    const q = query.toLowerCase();
    const t = text.toLowerCase();
    
    // Exact match
    if (t === q) return 100;
    
    // Starts with
    if (t.startsWith(q)) return 80;
    
    // Contains
    if (t.includes(q)) return 60;
    
    // Calculate Levenshtein distance (simple version for typo tolerance)
    const distance = levenshteinDistance(q, t);
    const maxLength = Math.max(q.length, t.length);
    const similarity = 1 - (distance / maxLength);
    
    if (similarity > 0.7) return 40; // Close match
    if (similarity > 0.5) return 20; // Somewhat close
    
    return 0;
  };
  
  // Simple Levenshtein distance for typo tolerance
  const levenshteinDistance = (a: string, b: string): number => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    
    const matrix = [];
    
    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    // Fill matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // Deletion
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j - 1] + cost // Substitution
        );
      }
    }
    
    return matrix[b.length][a.length];
  };
  
  // Highlight matching text
  const getHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return [{ text, bold: false }];
    
    const q = query.toLowerCase();
    const t = text.toLowerCase();
    const index = t.indexOf(q);
    
    if (index === -1) {
      // Try fuzzy match for highlighting
      for (let i = 0; i <= t.length - q.length; i++) {
        const substring = t.substring(i, i + q.length);
        if (levenshteinDistance(q, substring) <= 2) {
          return [
            { text: text.substring(0, i), bold: false },
            { text: text.substring(i, i + q.length), bold: true },
            { text: text.substring(i + q.length), bold: false },
          ];
        }
      }
      return [{ text, bold: false }];
    }
    
    return [
      { text: text.substring(0, index), bold: false },
      { text: text.substring(index, index + q.length), bold: true },
      { text: text.substring(index + q.length), bold: false },
    ];
  };
  
  // Smart search algorithm using real products
  const searchProducts = (query: string): ScoredProduct[] => {
    if (!query.trim() || products.length === 0) return [];
    
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(' ').filter(w => w.length > 0);
    
    const scoredProducts: ScoredProduct[] = products.map(product => {
      const lowerName = product.name.toLowerCase();
      const lowerCategory = product.category.toLowerCase();
      
      let score = 0;
      
      // Exact match in name
      score += getTypoToleranceScore(lowerQuery, lowerName);
      
      // Exact match in category
      if (lowerCategory === lowerQuery) score += 30;
      
      // Contains all words
      const containsAllWords = words.every(word => 
        lowerName.includes(word) || 
        levenshteinDistance(word, lowerName.substring(0, word.length)) <= 2
      );
      if (containsAllWords) score += 40;
      
      // Word-by-word matching
      words.forEach(word => {
        if (lowerName.includes(word)) score += 20;
        if (lowerCategory.includes(word)) score += 10;
      });
      
      // Boost for exact prefix matches
      if (lowerName.startsWith(lowerQuery)) score += 25;
      
      // Penalty for very long names
      if (product.name.length > 30) score -= 5;

      // favour frequent sold products
      // e.g. if (product.salesCount > 100) score += 20;
      
      return { ...product, score };
    });
    
    // Sort by score and return top 10
    return scoredProducts
      .filter(p => p.score > 10)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };
  
  // Handle search input
  const handleSearch = (text: string): void => {
    setSearchQuery(text);
    
    if (text.length > 0) {
      const results = searchProducts(text);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  // Add to cart with debounce
  const addPrdToCart = async (product: Product): Promise<void> => {
    const now = Date.now();
    if (now - lastAddTime.current < 500) return; // Prevent rapid tapping
    if (isAdding) return;
    
    lastAddTime.current = now;
    setIsAdding(true);
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Update recent searches in state and AsyncStorage
    const updatedRecentSearches = [product, ...recentSearches.filter(p => p.id !== product.id)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updatedRecentSearches);
    
    // Save to AsyncStorage
    await saveRecentSearches(updatedRecentSearches);
    
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
    
    // Clear search
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Reset adding state
    setTimeout(() => setIsAdding(false), 500);
    
    // adds to global cart
    const stockFromDb = addToCart(product.id);

    if (stockFromDb) {
      addItem({
        stockId: stockFromDb.id,
        name: stockFromDb.productName,
        price: stockFromDb.sellingPrice,
        qty: 1
      })
    }
    
  };

    // Handle key press (Enter)
  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>): void => {
    if (e.nativeEvent.key === 'Enter' && suggestions.length > 0) {
      addPrdToCart(suggestions[0]);
    }
  };
  
  
  // Clear search
  const clearSearch = (): void => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  
  // Clear all recent searches
  const clearRecentSearches = async (): Promise<void> => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
  };
  
  // Remove specific recent search
  const removeRecentSearch = async (id: number): Promise<void> => {
    const updated = recentSearches.filter(p => p.id !== id);
    setRecentSearches(updated);
    await saveRecentSearches(updated);
  };
  
  // Render suggestion item
  const renderSuggestion: ListRenderItem<ScoredProduct> = ({ item }) => {
    const highlightedParts = getHighlightedText(item.name, searchQuery);
    
    return (
      <Pressable
        onPress={() => addPrdToCart(item)}
        className="px-4 py-3 border-b border-gray-400 active:bg-gray-50 flex-row items-center justify-between"
      >
        <View className="flex-1">
          <View className="flex-row items-center">
            <FontAwesome6 name="cart-plus" size={16} color="#6b7280" className="mr-3 pt-2" />
            <Text className="text-gray-800">
              {highlightedParts.map((part, index) => (
                <Text
                  key={index}
                  className={part.bold ? 'font-bold text-blue-600' : ''}
                >
                  {part.text}
                </Text>
              ))}
            </Text>
          </View>
          <Text className="text-gray-500 text-xs ml-7 mt-1">{item.category}</Text>
        </View>
        <Text className="text-sky-500 font-semibold">{item.price.toLocaleString()} TZS</Text>
      </Pressable>
    );
  };
  
  // Render recent search item
  const renderRecentItem = (item: Product, index: number) => (
    <View key={item.id} className="w-1/2 pr-2 mb-2">
      <TouchableOpacity
        onPress={() => {
          setSearchQuery(item.name);
          const results = searchProducts(item.name);
          setSuggestions(results);
          setShowSuggestions(true);
        }}
        activeOpacity={0.7}
        className="bg-sky-50 border border-gray-300 rounded-full px-4 py-2 flex-row items-center"
      >
        <AntDesign
          name="clock-circle"
          size={14}
          color="#6b7280"
          style={{ marginRight: 6 }}
        />
        <Text
          className="text-gray-700 flex-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
      </TouchableOpacity>
      
      {/* Remove button for recent searches */}
      <TouchableOpacity
        onPress={() => removeRecentSearch(item.id)}
        className="absolute top-2 right-4 p-1"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Entypo name="cross" size={14} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white p-4">
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
      
      {/* Search Bar */}
      <View className="relative mb-6 z-40">
        <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-1 border border-gray-400">
          <Feather name="search" size={20} color="#9ca3af" />
          <TextInput
            ref={inputRef}
            className="flex-1 ml-3 text-gray-900 text-base"
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
            onKeyPress={handleKeyPress}
            returnKeyType="search"
            onSubmitEditing={() => {
              if (suggestions.length > 0) {
                addPrdToCart(suggestions[0]);
              }
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="p-1">
              <Entypo name="circle-with-cross" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <Modal
            transparent
            animationType="fade"
            onRequestClose={() => setShowSuggestions(false)}
          >
            {/* Backdrop */}
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setShowSuggestions(false)}
            />
        
            {/* Dropdown */}
            <View style={styles.dropdown}>
              {suggestions.length === 0 ? (
                <View className="flex-1 items-center justify-center px-6">
                  <PackageSearch size={48} color="#cbd5e1" />
                  <Text className="text-gray-500 mt-3 text-sm">
                    No item found
                  </Text>
                  <Text className="text-gray-400 text-xs mt-1 text-center">
                    We couldn&apos;t find any products. Try a different keyword
                  </Text>
                </View>
              ) : (
                <>
                <FlatList
                  data={suggestions}
                  renderItem={renderSuggestion}
                  keyExtractor={(item) => item.id.toString()}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator
                  refreshControl={
                    <RefreshControl 
                      refreshing={refreshing} 
                      onRefresh={onRefresh} 
                      colors={['#0ea5e9', '#0c4a6e']} // Android spinner colors
                      tintColor="#0c4a6e" // iOS spinner color
                    />
                  }
                />
        
                <View className="px-4 py-2 border-t border-gray-300 bg-gray-100">
                  <Text className="text-gray-500 text-xs">
                    Press Enter to add the first result • {suggestions.length} results
                  </Text>
                </View>
              </>
              )}
            </View>
          </Modal>
        )}
      </View>
      
      {/* Loading State */}
      {isLoading && !showSuggestions && (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#075985" />
        <Text className="text-slate-500 mt-2 font-medium">Loading Products...</Text>
      </View>
      )}
      
      {/* Recent Searches */}
      {!showSuggestions && !isLoading && (
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="cart-variant" size={20} color="#4b5563" className="mr-2" />
              <Text className="text-gray-700 font-semibold text-lg">Recently Added Products</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-500 text-sm mr-3">{recentSearches.length}/{MAX_RECENT_SEARCHES}</Text>
              {recentSearches.length > 0 && (
              <TouchableOpacity
                onPress={clearRecentSearches}
                className="flex-row items-center px-2 py-1 rounded-full bg-red-50 border border-red-300"
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={14}
                  color="#dc2626"
                />
                <Text className="text-red-600 text-xs ml-1 font-medium">
                  Clear
                </Text>
              </TouchableOpacity>
              )}
            </View>
          </View>
          
          {products.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Entypo name="emoji-sad" size={64} color="#D1D5DB" />
              <Text className="text-gray-400 mt-4">No products available</Text>
              <Text className="text-gray-400 text-center mt-2">
                Add products to your inventory first
              </Text>
            </View>
          ) : recentSearches.length > 0 ? (
            <View className="flex-row flex-wrap">
              {recentSearches.map(renderRecentItem)}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <Octicons name="history" size={64} color="#D1D5DB" />
              <Text className="text-gray-400 mt-4">No recent products</Text>
              <Text className="text-gray-400 text-center mt-2">
                Search and add products to see them here
              </Text>
            </View>
          )}
          
          {/* Product Count Info */}
          <View className="mt-3 pt-2 border-t border-gray-300">
            <Text className="text-gray-500 text-sm text-center">
              {products.length} products available in inventory
            </Text>
          </View>
        </View>
      )}

      <ErrorModal
        visible={!!activeError}
        message={activeError?.message ?? null}
        onRetry={activeError?.retry}
        onClose={() => setActiveError(null)}
      />


      
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
  dropdown: {
    position: "absolute",
    top: 178, // adjust to sit below search bar
    left: 16,
    right: 16,
    height: 320, // REAL HEIGHT → scrolling works
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    elevation: 5,
  },
});

export default SmartSearch;