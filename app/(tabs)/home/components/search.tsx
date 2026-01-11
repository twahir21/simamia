// components/SmartSearch.tsx
import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { AntDesign, Entypo, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

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

// Mock product data
const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Coca Cola 500ml', category: 'Beverages', price: 1.5 },
  { id: 2, name: 'Pepsi 330ml Can', category: 'Beverages', price: 1.2 },
  { id: 3, name: 'Azam Juice Mango 1L', category: 'Juices', price: 2.5 },
  { id: 4, name: 'Azam Juice Orange 1L', category: 'Juices', price: 2.5 },
  { id: 5, name: 'Mounto Spring Water 1.5L', category: 'Water', price: 0.8 },
  { id: 6, name: 'Dell Latitude Laptop', category: 'Electronics', price: 899 },
  { id: 7, name: 'iPhone 15 Pro Max', category: 'Electronics', price: 1299 },
  { id: 8, name: 'Samsung Galaxy S24', category: 'Electronics', price: 799 },
  { id: 9, name: 'Nike Air Max 270', category: 'Shoes', price: 150 },
  { id: 10, name: 'Adidas Ultraboost', category: 'Shoes', price: 180 },
  { id: 11, name: 'MacBook Pro 14"', category: 'Electronics', price: 1999 },
  { id: 12, name: 'Sony WH-1000XM5', category: 'Headphones', price: 399 },
  { id: 13, name: 'Apple AirPods Pro', category: 'Headphones', price: 249 },
  { id: 14, name: 'Logitech MX Master 3', category: 'Accessories', price: 99 },
  { id: 15, name: 'Kindle Paperwhite', category: 'Electronics', price: 139 },
  { id: 16, name: 'Nespresso Vertuo', category: 'Appliances', price: 199 },
  { id: 17, name: 'Instant Pot Duo', category: 'Appliances', price: 89 },
  { id: 18, name: 'Dyson V15 Vacuum', category: 'Appliances', price: 699 },
  { id: 19, name: 'Levi\'s 501 Jeans', category: 'Clothing', price: 69 },
  { id: 20, name: 'North Face Jacket', category: 'Clothing', price: 199 },
];

const SmartSearch: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<ScoredProduct[]>([]);
  const [recentSearches, setRecentSearches] = useState<Product[]>([
    MOCK_PRODUCTS[0], // Coca Cola
    MOCK_PRODUCTS[2], // Azam Juice Mango
    MOCK_PRODUCTS[5], // Dell Laptop
    MOCK_PRODUCTS[6], // iPhone
    MOCK_PRODUCTS[8], // Nike Shoes
  ]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [feedbackProduct, setFeedbackProduct] = useState<Product | null>(null);
  
  // Refs
  const inputRef = useRef<RNTextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lastAddTime = useRef<number>(0);
  
  // Auto focus on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
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
  
  // Smart search algorithm
  const searchProducts = (query: string): ScoredProduct[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(' ').filter(w => w.length > 0);
    
    const scoredProducts: ScoredProduct[] = MOCK_PRODUCTS.map(product => {
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
  
  // Handle key press (Enter)
  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>): void => {
    if (e.nativeEvent.key === 'Enter' && suggestions.length > 0) {
      addToCart(suggestions[0]);
    }
  };
  
  // Add to cart with debounce
  const addToCart = (product: Product): void => {
    const now = Date.now();
    if (now - lastAddTime.current < 500) return; // Prevent rapid tapping
    if (isAdding) return;
    
    lastAddTime.current = now;
    setIsAdding(true);
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Update recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered.slice(0, 14)]; // Keep 15 items max
    });
    
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
  };
  
  // Clear search
  const clearSearch = (): void => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  
  // Render suggestion item
  const renderSuggestion: ListRenderItem<ScoredProduct> = ({ item }) => {
    const highlightedParts = getHighlightedText(item.name, searchQuery);
    
    return (
      <TouchableOpacity
        onPress={() => addToCart(item)}
        className="px-4 py-3 border-b border-gray-100 active:bg-gray-50 flex-row items-center justify-between"
      >
        <View className="flex-1">
          <View className="flex-row items-center">
            <Feather name="search" size={16} color="#6b7280" className="mr-3" />
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
        <Text className="text-green-600 font-semibold">${item.price}</Text>
      </TouchableOpacity>
    );
  };
  
  // Render recent search item
  const renderRecentItem = (item: Product, index: number) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => {
        setSearchQuery(item.name);
        const results = searchProducts(item.name);
        setSuggestions(results);
        setShowSuggestions(true);
      }}
      className="bg-sky-50 border border-gray-300 rounded-full px-4 py-2 mr-3 mb-2 flex-row items-center active:bg-gray-200"
    >
      <AntDesign name="clock-circle" size={14} color="#6b7280" className="mr-2" />
      <Text className="text-gray-700">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white p-4">
      {/* Feedback Toast */}
      {feedbackProduct && (
        <Animated.View 
          style={[styles.feedbackToast, { opacity: fadeAnim }]}
          className="absolute top-4 left-4 right-4 bg-green-50 border border-green-200 rounded-xl p-4 flex-row items-center z-50"
        >
          {/* <CheckCircle size={24} color="#10b981" /> */}
          <Feather name="search" size={24} color="black" />
          <View className="ml-3 flex-1">
            <Text className="text-green-800 font-semibold">Added to cart!</Text>
            <Text className="text-green-700 text-sm">{feedbackProduct.name}</Text>
          </View>
          <Text className="text-green-600 font-bold">${feedbackProduct.price}</Text>
        </Animated.View>
      )}
      
      {/* Search Bar */}
      <View className="relative mb-6">
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
                addToCart(suggestions[0]);
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
        {showSuggestions && suggestions.length > 0 && (
          <View className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-400 max-h-80 z-40">
            <FlatList
              data={suggestions}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item.id.toString()}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            />
            
            <View className="px-4 py-2 border-t border-gray-300 bg-gray-100">
              <Text className="text-gray-500 text-xs">
                Press Enter to add the first result • {suggestions.length} results
              </Text>
            </View>
          </View>
        )}
      </View>
      
      {/* Recent Searches */}
      {!showSuggestions && (
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="cart-variant" size={20} color="#4b5563" className="mr-2" />
              <Text className="text-gray-700 font-semibold text-lg">Recently Added Products</Text>
            </View>
            <Text className="text-gray-500 text-sm">{recentSearches.length}/15</Text>
          </View>
          
          <View className="flex-row flex-wrap">
            {recentSearches.map(renderRecentItem)}
          </View>
          
          {recentSearches.length === 0 && (
            <View className="flex-1 items-center justify-center">
              <Entypo name="emoji-sad" size={64} color="#D1D5DB" />
              <Text className="text-gray-400 mt-4">No recent products</Text>
              <Text className="text-gray-400 text-center mt-2">
                Search and add products to see them here
              </Text>
            </View>
          )}
        </View>
      )}
      
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

export default SmartSearch;