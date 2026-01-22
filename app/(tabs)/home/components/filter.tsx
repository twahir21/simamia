import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterOptions } from './ts';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
  categories: string[];
  locations: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
  categories,
  locations,
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    setFilters({
      category: '',
      status: '',
      minQuantity: 0,
      maxQuantity: 10000,
      location: ''
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[85%]">
          {/* Header */}
          <View className="flex-row justify-between items-center p-6 border-b border-gray-200">
            <Text className="text-2xl font-bold text-gray-900">Filter Stock</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
            {/* Category Filter */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Category</Text>
              <View className="flex-row flex-wrap">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setFilters(prev => ({
                      ...prev,
                      category: prev.category === category ? '' : category
                    }))}
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                      filters.category === category 
                        ? 'bg-blue-500' 
                        : 'bg-gray-100'
                    }`}
                  >
                    <Text className={
                      filters.category === category 
                        ? 'text-white font-medium' 
                        : 'text-gray-700'
                    }>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Status Filter */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Status</Text>
              <View className="flex-row flex-wrap">
                {['In Stock', 'Low Stock', 'Out of Stock'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => setFilters(prev => ({
                      ...prev,
                      status: prev.status === status ? '' : status
                    }))}
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                      filters.status === status 
                        ? status === 'In Stock' ? 'bg-green-500' :
                          status === 'Low Stock' ? 'bg-yellow-500' : 'bg-red-500'
                        : status === 'In Stock' ? 'bg-green-100' :
                          status === 'Low Stock' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}
                  >
                    <Text className={
                      filters.status === status 
                        ? 'text-white font-medium' 
                        : status === 'In Stock' ? 'text-green-700' :
                          status === 'Low Stock' ? 'text-yellow-700' : 'text-red-700'
                    }>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location Filter */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Location</Text>
              <View className="flex-row flex-wrap">
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location}
                    onPress={() => setFilters(prev => ({
                      ...prev,
                      location: prev.location === location ? '' : location
                    }))}
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                      filters.location === location 
                        ? 'bg-purple-500' 
                        : 'bg-gray-100'
                    }`}
                  >
                    <Text className={
                      filters.location === location 
                        ? 'text-white font-medium' 
                        : 'text-gray-700'
                    }>
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quantity Range */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Quantity Range</Text>
              <View className="flex-row justify-between space-x-4">
                <View className="flex-1">
                  <Text className="text-gray-600 mb-2">Min Quantity</Text>
                  <TextInput
                    className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                    value={filters.minQuantity.toString()}
                    onChangeText={(text) => setFilters(prev => ({
                      ...prev,
                      minQuantity: parseInt(text) || 0
                    }))}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-600 mb-2">Max Quantity</Text>
                  <TextInput
                    className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                    value={filters.maxQuantity.toString()}
                    onChangeText={(text) => setFilters(prev => ({
                      ...prev,
                      maxQuantity: parseInt(text) || 10000
                    }))}
                    keyboardType="numeric"
                    placeholder="10000"
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row p-6 border-t border-gray-200 space-x-3">
            <TouchableOpacity
              onPress={handleReset}
              className="flex-1 bg-gray-100 py-4 rounded-xl items-center"
            >
              <Text className="text-gray-700 font-semibold">Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              className="flex-1 bg-blue-500 py-4 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;