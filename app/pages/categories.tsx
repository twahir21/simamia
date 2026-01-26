import { View, Text, ScrollView, TouchableOpacity, TextInput, Pressable } from "react-native";
import { 
  Search, 
  Plus, 
  Filter,
  Tag,
  Smartphone,
  Shirt,
  Home,
  Book,
  Dumbbell,
  Gamepad2,
  Edit2,
  Trash2,
  ChevronRight
} from "lucide-react-native";
import { useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from 'expo-haptics';


const CATEGORIES = [
  { 
    id: "1", 
    name: "Electronics", 
    itemCount: 45, 
    color: "#3B82F6",
    icon: Smartphone,
    description: "Phones, laptops, accessories",
    lastUpdated: "2 hours ago"
  },
  { 
    id: "2", 
    name: "Clothing", 
    itemCount: 120, 
    color: "#10B981",
    icon: Shirt,
    description: "Men, women & kids apparel",
    lastUpdated: "Yesterday"
  },
  { 
    id: "3", 
    name: "Home & Garden", 
    itemCount: 78, 
    color: "#F59E0B",
    icon: Home,
    description: "Furniture, decor, tools",
    lastUpdated: "3 days ago"
  },
  { 
    id: "4", 
    name: "Books", 
    itemCount: 210, 
    color: "#8B5CF6",
    icon: Book,
    description: "Fiction, non-fiction, educational",
    lastUpdated: "1 week ago"
  },
  { 
    id: "5", 
    name: "Sports", 
    itemCount: 56, 
    color: "#EF4444",
    icon: Dumbbell,
    description: "Equipment, apparel, accessories",
    lastUpdated: "2 days ago"
  },
  { 
    id: "6", 
    name: "Toys", 
    itemCount: 89, 
    color: "#EC4899",
    icon: Gamepad2,
    description: "Kids toys, games, puzzles",
    lastUpdated: "Today"
  },
  { 
    id: "7", 
    name: "Automotive", 
    itemCount: 34, 
    color: "#6B7280",
    icon: Tag,
    description: "Car parts, accessories",
    lastUpdated: "1 month ago"
  },
  { 
    id: "8", 
    name: "Health & Beauty", 
    itemCount: 67, 
    color: "#06B6D4",
    icon: Tag,
    description: "Skincare, makeup, wellness",
    lastUpdated: "4 days ago"
  },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const router = useRouter();
  

  return <>
    <View className="px-4 pt-5 pb-2 bg-white border-b border-gray-400">
        <View className="flex-row items-center gap-2 pt-3">
           <Ionicons name="chevron-back-sharp" size={24} color="black" onPress={() => router.push("/pages")}/>
          <MaterialIcons name="category" size={24} color="#1F2937" />
          <Text className="text-xl font-bold text-gray-800">Categories</Text>
        </View>
    </View>
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white px-6 pt-2 pb-4 border-b border-gray-200">
        {/* Search Bar */}
        <View className="py-3">
        <View className="bg-white flex-row items-center px-4 py-1 rounded-2xl border border-slate-200 shadow-sm">
            <Search size={20} color="#94a3b8" />
            <TextInput 
            placeholder="Search by name ..." 
            className="flex-1 ml-3 text-slate-700 font-medium"
            value={searchQuery}
            onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => { setSearchQuery(""); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);}}>
                <Text className="text-sky-500 font-medium">Cancel</Text>
                </TouchableOpacity>
            )}
        </View>
        </View>
      </View>

      {/* Stats */}
      <View className="px-6 pt-4">
        <View className="flex-row justify-between bg-white rounded-xl p-4 shadow-sm">
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">{CATEGORIES.length}</Text>
            <Text className="text-gray-500 text-sm">Total</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">
              {CATEGORIES.reduce((sum, cat) => sum + cat.itemCount, 0)}
            </Text>
            <Text className="text-gray-500 text-sm">Items</Text>
          </View>
          <TouchableOpacity className="items-center">
            <Filter size={20} color="#6B7280" />
            <Text className="text-gray-500 text-sm mt-1">Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories List */}
      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        <View className="mb-20">
          {filteredCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
                className={`bg-white rounded-2xl p-4 mb-3 shadow-sm border ${
                  selectedCategory === category.id 
                    ? 'border-blue-300' 
                    : 'border-gray-200'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View 
                      className="w-14 h-14 rounded-xl items-center justify-center mr-2"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <IconComponent size={28} color={category.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-lg text-gray-900">
                        {category.name}
                      </Text>
                      <Text className="text-gray-500 text-sm mt-1">
                        {category.description}
                      </Text>
                      <View className="flex-row items-center mt-2">
                        <Text className="text-gray-700 font-medium">
                          {category.itemCount} items
                        </Text>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text className="text-gray-500 text-sm">
                          {category.lastUpdated}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <ChevronRight 
                    size={20} 
                    color="#9CA3AF" 
                    className={`transform ${
                      selectedCategory === category.id ? 'rotate-90' : ''
                    }`}
                  />
                </View>

                {/* Expanded View */}
                {selectedCategory === category.id && (
                  <View className="mt-4 pt-4 border-t border-gray-100">
                    <View className="flex-row justify-between mb-3">
                      <Text className="text-gray-700 font-medium">Category Details</Text>
                      <View className="flex-row">
                        <TouchableOpacity className="p-2 mr-2">
                          <Edit2 size={18} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity className="p-2">
                          <Trash2 size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View className="bg-gray-50 rounded-lg p-3">
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Total Items</Text>
                        <Text className="font-semibold text-gray-900">
                          {category.itemCount} products
                        </Text>
                      </View>
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Last Updated</Text>
                        <Text className="text-gray-900">{category.lastUpdated}</Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-gray-600">Status</Text>
                        <View className="bg-green-100 px-3 py-1 rounded-full">
                          <Text className="text-green-800 text-sm font-medium">Active</Text>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row mt-4">
                      <TouchableOpacity className="flex-1 bg-blue-50 py-3 rounded-lg mr-2 items-center">
                        <Text className="text-blue-700 font-semibold">View Products</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-lg items-center">
                        <Text className="text-gray-700 font-semibold">Edit Category</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

            {/* Floating Add Button */}
            <Pressable
            //   onPress={() => setShowAddModal(true)}
              android_ripple={{ color: "rgba(255,255,255,0.2)" }}
              className="absolute bottom-3 right-3 bg-sky-800 w-16 h-16 rounded-full items-center justify-center shadow-lg"
            >
              <Plus size={28} color="white" />
            </Pressable>

    </View>
  </>
}