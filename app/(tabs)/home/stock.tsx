import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Feather from '@expo/vector-icons/Feather';

// types/stock.ts
export interface StockItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  price: number;
  lastUpdated: string;
  supplier: string;
  reorderLevel: number; // When stock reaches this, suggest reorder
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
}

export type StockCategory = 'all' | 'food' | 'drinks' | 'supplies' | 'others';
export type StockSortOption = 'name-asc' | 'name-desc' | 'stock-low' | 'stock-high' | 'price-high' | 'price-low';
// Hardcoded sample stock data
const initialStockItems: StockItem[] = [
  {
    id: '1',
    name: 'Premium Rice (25kg)',
    category: 'food',
    currentStock: 15,
    minimumStock: 5,
    unit: 'bags',
    price: 45000,
    lastUpdated: '2026-01-08',
    supplier: 'Kilimo Fresh',
    reorderLevel: 10,
    status: 'in-stock'
  },
  {
    id: '2',
    name: 'Cooking Oil (5L)',
    category: 'food',
    currentStock: 3,
    minimumStock: 10,
    unit: 'jars',
    price: 12500,
    lastUpdated: '2026-01-07',
    supplier: 'Best Oil Co.',
    reorderLevel: 5,
    status: 'low-stock'
  },
  {
    id: '3',
    name: 'Mineral Water (500ml)',
    category: 'drinks',
    currentStock: 0,
    minimumStock: 20,
    unit: 'bottles',
    price: 150,
    lastUpdated: '2026-01-08',
    supplier: 'Aqua Pure',
    reorderLevel: 15,
    status: 'out-of-stock'
  },
  {
    id: '4',
    name: 'Sugar (1kg)',
    category: 'food',
    currentStock: 45,
    minimumStock: 15,
    unit: 'packets',
    price: 2500,
    lastUpdated: '2026-01-06',
    supplier: 'Sweet Harvest',
    reorderLevel: 20,
    status: 'overstock'
  },
  {
    id: '5',
    name: 'Delivery Boxes',
    category: 'supplies',
    currentStock: 8,
    minimumStock: 30,
    unit: 'boxes',
    price: 800,
    lastUpdated: '2026-01-05',
    supplier: 'Packaging Inc.',
    reorderLevel: 20,
    status: 'low-stock'
  },
  {
    id: '6',
    name: 'Tea Leaves (500g)',
    category: 'drinks',
    currentStock: 12,
    minimumStock: 8,
    unit: 'packets',
    price: 3200,
    lastUpdated: '2026-01-08',
    supplier: 'Chai Masters',
    reorderLevel: 10,
    status: 'in-stock'
  },
  {
    id: '7',
    name: 'Spices Set',
    category: 'food',
    currentStock: 22,
    minimumStock: 10,
    unit: 'sets',
    price: 4500,
    lastUpdated: '2026-01-07',
    supplier: 'Flavor King',
    reorderLevel: 15,
    status: 'in-stock'
  },
  {
    id: '8',
    name: 'Disposable Cups',
    category: 'supplies',
    currentStock: 5,
    minimumStock: 25,
    unit: 'packs',
    price: 1200,
    lastUpdated: '2026-01-08',
    supplier: 'Eco Serve',
    reorderLevel: 15,
    status: 'low-stock'
  }
];

const Stock = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<StockSortOption>('stock-low');
  const [filterBy, setFilterBy] = useState<StockCategory>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalItems = stockItems.length;
    const lowStock = stockItems.filter(item => item.status === 'low-stock').length;
    const outOfStock = stockItems.filter(item => item.status === 'out-of-stock').length;
    const totalValue = stockItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
    const needsReorder = stockItems.filter(item => item.currentStock <= item.reorderLevel).length;

    return { totalItems, lowStock, outOfStock, totalValue, needsReorder };
  }, [stockItems]);

  // Filter and sort logic
  const filteredItems = useMemo(() => {
    let result = stockItems.filter(item => {
      // Search filter
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      if (filterBy === 'all') return matchesSearch;
      return matchesSearch && item.category === filterBy;
    });

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'stock-low':
          return (a.currentStock / a.minimumStock) - (b.currentStock / b.minimumStock);
        case 'stock-high':
          return (b.currentStock / b.minimumStock) - (a.currentStock / a.minimumStock);
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        default:
          return 0;
      }
    });

    return result;
  }, [stockItems, searchQuery, sortBy, filterBy]);

  // Status badge component
  const StockStatusBadge = ({ status }: { status: StockItem['status'] }) => {
    const config = {
      'in-stock': { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', label: 'In Stock' },
      'low-stock': { bg: 'bg-amber-100', text: 'text-amber-800', icon: '⚠️', label: 'Low Stock' },
      'out-of-stock': { bg: 'bg-red-100', text: 'text-red-800', icon: '❌', label: 'Out of Stock' },
      'overstock': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '📦', label: 'Overstock' },
    };
    const { bg, text, icon, label } = config[status];
    return (
      <View className={`px-3 py-1 rounded-full ${bg}`}>
        <Text className={`text-sm font-semibold ${text}`}>{icon} {label}</Text>
      </View>
    );
  };

  // Stock level indicator
  const StockLevelIndicator = ({ item }: { item: StockItem }) => {
    const percentage = (item.currentStock / item.minimumStock) * 100;
    
    let color = 'bg-green-500';
    if (item.status === 'low-stock') color = 'bg-amber-500';
    if (item.status === 'out-of-stock') color = 'bg-red-500';
    if (item.status === 'overstock') color = 'bg-blue-500';

    return (
      <View className="mt-2">
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View 
            className={`h-full ${color} rounded-full`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-xs text-gray-500">Current: {item.currentStock}{item.unit}</Text>
          <Text className="text-xs text-gray-500">Min: {item.minimumStock}{item.unit}</Text>
        </View>
      </View>
    );
  };

  // Action functions
  const updateStock = (itemId: string, newStock: number) => {
    Alert.prompt(
      'Update Stock',
      'Enter new stock quantity:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: (value: any) => {
            if (value && !isNaN(parseInt(value))) {
              setStockItems(prev =>
                prev.map(item => {
                  if (item.id === itemId) {
                    const updatedStock = parseInt(value);
                    let status: StockItem['status'] = 'in-stock';
                    
                    if (updatedStock === 0) status = 'out-of-stock';
                    else if (updatedStock <= item.reorderLevel) status = 'low-stock';
                    else if (updatedStock > item.minimumStock * 2) status = 'overstock';
                    
                    return {
                      ...item,
                      currentStock: updatedStock,
                      status,
                      lastUpdated: new Date().toISOString().split('T')[0]
                    };
                  }
                  return item;
                })
              );
            }
          },
        },
      ],
      'plain-text',
      ''
    );
  };

  const reorderItem = (item: StockItem) => {
    Alert.alert(
      'Reorder Item',
      `Order ${item.name} from ${item.supplier}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Order Now',
          onPress: () => {
            // In real app, this would trigger an order process
            Alert.alert('Success', `Order placed for ${item.name}`);
          },
        },
      ]
    );
  };

  const deleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to remove this item from inventory?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setStockItems(prev => prev.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  // Quick stats cards
  const StatCard = ({ 
    title, 
    value, 
    color, 
    subtitle 
  }: { 
    title: string; 
    value: string | number; 
    color: string;
    subtitle?: string;
  }) => (
    <View className={`${color} rounded-2xl p-4 flex-1`}>
      <View className="flex-row items-center justify-between">
        {/* <Icon size={20} color="#fff" /> */}
        <Feather size={24} name="x-circle" color="#666" />
        {subtitle && <Text className="text-white text-xs opacity-90">{subtitle}</Text>}
      </View>
      <Text className="text-white text-2xl font-bold mt-2">{value}</Text>
      <Text className="text-white text-sm opacity-90">{title}</Text>
    </View>
  );

  // Add new item modal
  const AddItemModal = () => {
    const [newItem, setNewItem] = useState({
      name: '',
      category: 'food' as StockItem['category'],
      currentStock: 0,
      minimumStock: 10,
      unit: 'units',
      price: 0,
      supplier: '',
      reorderLevel: 5
    });

    const handleAdd = () => {
      if (!newItem.name || !newItem.supplier) {
        Alert.alert('Error', 'Please fill in required fields');
        return;
      }

      const newStockItem: StockItem = {
        id: Date.now().toString(),
        ...newItem,
        lastUpdated: new Date().toISOString().split('T')[0],
        status: newItem.currentStock === 0 ? 'out-of-stock' : 
                newItem.currentStock <= newItem.reorderLevel ? 'low-stock' : 
                newItem.currentStock > newItem.minimumStock * 2 ? 'overstock' : 'in-stock'
      };

      setStockItems(prev => [...prev, newStockItem]);
      setShowAddModal(false);
      setNewItem({
        name: '',
        category: 'food',
        currentStock: 0,
        minimumStock: 10,
        unit: 'units',
        price: 0,
        supplier: '',
        reorderLevel: 5
      });
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView className="flex-1 bg-black/50 justify-end">
          <ScrollView className="bg-white rounded-t-3xl max-h-4/5">
            <View className="p-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold">Add New Item</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <Feather size={24} name="x-circle" color="#666" />
                </TouchableOpacity>
              </View>

              <View className="space-y-4">
                <View>
                  <Text className="text-gray-700 font-medium mb-2">Item Name *</Text>
                  <TextInput
                    className="bg-gray-100 rounded-xl px-4 py-3"
                    placeholder="e.g., Rice (25kg)"
                    value={newItem.name}
                    onChangeText={text => setNewItem({...newItem, name: text})}
                  />
                </View>

                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="text-gray-700 font-medium mb-2">Category</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {(['food', 'drinks', 'supplies', 'others'] as const).map(cat => (
                        <TouchableOpacity
                          key={cat}
                          className={`px-3 py-2 rounded-lg ${
                            newItem.category === cat ? 'bg-blue-500' : 'bg-gray-100'
                          }`}
                          onPress={() => setNewItem({...newItem, category: cat})}
                        >
                          <Text className={newItem.category === cat ? 'text-white' : 'text-gray-700'}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="text-gray-700 font-medium mb-2">Current Stock</Text>
                    <TextInput
                      className="bg-gray-100 rounded-xl px-4 py-3"
                      placeholder="0"
                      keyboardType="numeric"
                      value={newItem.currentStock.toString()}
                      onChangeText={text => setNewItem({...newItem, currentStock: parseInt(text) || 0})}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-700 font-medium mb-2">Unit</Text>
                    <TextInput
                      className="bg-gray-100 rounded-xl px-4 py-3"
                      placeholder="bags, kg, etc"
                      value={newItem.unit}
                      onChangeText={text => setNewItem({...newItem, unit: text})}
                    />
                  </View>
                </View>

                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="text-gray-700 font-medium mb-2">Price (each)</Text>
                    <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                      <Feather size={24} name="x-circle" color="#666" />
                      <TextInput
                        className="flex-1 ml-2"
                        placeholder="0"
                        keyboardType="numeric"
                        value={newItem.price.toString()}
                        onChangeText={text => setNewItem({...newItem, price: parseInt(text) || 0})}
                      />
                    </View>
                  </View>
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Supplier *</Text>
                  <TextInput
                    className="bg-gray-100 rounded-xl px-4 py-3"
                    placeholder="Supplier name"
                    value={newItem.supplier}
                    onChangeText={text => setNewItem({...newItem, supplier: text})}
                  />
                </View>

                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="text-gray-700 font-medium mb-2">Min. Stock</Text>
                    <TextInput
                      className="bg-gray-100 rounded-xl px-4 py-3"
                      placeholder="10"
                      keyboardType="numeric"
                      value={newItem.minimumStock.toString()}
                      onChangeText={text => setNewItem({...newItem, minimumStock: parseInt(text) || 10})}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-700 font-medium mb-2">Reorder At</Text>
                    <TextInput
                      className="bg-gray-100 rounded-xl px-4 py-3"
                      placeholder="5"
                      keyboardType="numeric"
                      value={newItem.reorderLevel.toString()}
                      onChangeText={text => setNewItem({...newItem, reorderLevel: parseInt(text) || 5})}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  className="bg-green-500 p-4 rounded-xl mt-6"
                  onPress={handleAdd}
                >
                  <Text className="text-white text-center font-semibold text-lg">➕ Add Item</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-3xl font-bold text-gray-900">Stock</Text>
            <Text className="text-gray-600">Inventory Management</Text>
          </View>
          <TouchableOpacity 
            className="bg-blue-500 p-3 rounded-xl"
            onPress={() => setShowAddModal(true)}
          >
            <Feather size={24} name="x-circle" color="#666" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-3">
          <Feather size={24} name="x-circle" color="#666" />
          <TextInput
            className="flex-1 ml-3 text-gray-800"
            placeholder="Search items or suppliers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather size={24} name="x-circle" color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Overview */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          <View className="flex-row space-x-3">
            <StatCard
              title="Total Items"
              value={statistics.totalItems}
              color="bg-blue-500"
            />
            <StatCard
              title="Low Stock"
              value={statistics.lowStock}
              color="bg-amber-500"
              subtitle="Needs attention"
            />
            <StatCard
              title="Out of Stock"
              value={statistics.outOfStock}
              color="bg-red-500"
              subtitle="Urgent"
            />
            <StatCard
              title="Total Value"
              value={`$${(statistics.totalValue / 1000).toFixed(1)}K`}
              color="bg-green-500"
            />
          </View>
        </ScrollView>

        {/* Filter & Sort Row */}
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 flex-row items-center justify-between"
            onPress={() => setShowFilterModal(true)}
          >
            <View className="flex-row items-center">
              <Feather size={24} name="x-circle" color="#666" />
              <Text className="ml-2 text-gray-700">Filter</Text>
            </View>
            <Text className="text-gray-600 font-medium">
              {filterBy === 'all' ? 'All Categories' : 
               filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 flex-row items-center justify-between"
            onPress={() => {
              const sortOptions: StockSortOption[] = ['stock-low', 'stock-high', 'name-asc', 'name-desc', 'price-high', 'price-low'];
              const currentIndex = sortOptions.indexOf(sortBy);
              const nextIndex = (currentIndex + 1) % sortOptions.length;
              setSortBy(sortOptions[nextIndex]);
            }}
          >
            <Text className="text-gray-700">Sort</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-600 font-medium mr-2">
                {sortBy === 'stock-low' ? 'Stock (Low)' :
                 sortBy === 'stock-high' ? 'Stock (High)' :
                 sortBy === 'name-asc' ? 'Name (A-Z)' :
                 sortBy === 'name-desc' ? 'Name (Z-A)' :
                 sortBy === 'price-high' ? 'Price (High)' : 'Price (Low)'}
              </Text>
              <Feather size={24} name="x-circle" color="#666" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stock Items List */}
      <ScrollView className="flex-1 px-4 py-6">
        {filteredItems.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Feather size={24} name="x-circle" color="#666" />
            <Text className="text-xl font-semibold text-gray-500 mt-4">No items found</Text>
            <TouchableOpacity 
              className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
              onPress={() => setShowAddModal(true)}
            >
              <Text className="text-white font-semibold">➕ Add Your First Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredItems.map(item => (
            <TouchableOpacity
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-4 overflow-hidden"
              activeOpacity={0.95}
              onPress={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
            >
              {/* Item Header */}
              <View className="p-5">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Feather size={24} name="x-circle" color="#666" />
                      <Text className="ml-2 text-lg font-semibold text-gray-900 flex-1">
                        {item.name}
                      </Text>
                    </View>
                    <Text className="text-gray-500 mt-1">{item.supplier}</Text>
                  </View>
                  <StockStatusBadge status={item.status} />
                </View>

                {/* Stock Info */}
                <View className="flex-row justify-between items-center mb-3">
                  <View>
                    <Text className="text-3xl font-bold text-blue-600">
                      {item.currentStock}<Text className="text-sm text-gray-500"> {item.unit}</Text>
                    </Text>
                    <Text className="text-gray-600">in stock</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-gray-900">
                      ${item.price.toLocaleString()}
                    </Text>
                    <Text className="text-gray-500">per {item.unit}</Text>
                  </View>
                </View>

                {/* Stock Level Indicator */}
                <StockLevelIndicator item={item} />

                {/* Quick Actions */}
                <View className="flex-row mt-4 space-x-2">
                  <TouchableOpacity
                    className="flex-1 bg-blue-100 py-2 rounded-lg items-center"
                    onPress={() => updateStock(item.id, item.currentStock)}
                  >
                    <Text className="text-blue-600 font-semibold">✏️ Update Stock</Text>
                  </TouchableOpacity>
                  {item.status === 'low-stock' || item.status === 'out-of-stock' ? (
                    <TouchableOpacity
                      className="flex-1 bg-red-100 py-2 rounded-lg items-center"
                      onPress={() => reorderItem(item)}
                    >
                      <Text className="text-red-600 font-semibold">🛒 Reorder</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      className="flex-1 bg-gray-100 py-2 rounded-lg items-center"
                      onPress={() => reorderItem(item)}
                    >
                      <Text className="text-gray-600 font-semibold">📦 Order More</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Expanded Details */}
              {expandedItem === item.id && (
                <View className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <Text className="text-gray-700 font-semibold mb-3">📋 Item Details</Text>
                  <View className="space-y-3">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Category</Text>
                      <Text className="font-medium">{item.category}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Minimum Required</Text>
                      <Text className="font-medium">{item.minimumStock} {item.unit}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Reorder Level</Text>
                      <Text className="font-medium">{item.reorderLevel} {item.unit}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Last Updated</Text>
                      <Text className="font-medium">{item.lastUpdated}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Total Value</Text>
                      <Text className="font-medium text-green-600">
                        ${(item.currentStock * item.price).toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* Expanded Actions */}
                  <View className="flex-row space-x-3 mt-4">
                    <TouchableOpacity
                      className="flex-1 bg-amber-500 p-3 rounded-lg items-center"
                      onPress={() => updateStock(item.id, item.currentStock)}
                    >
                      <Feather size={24} name="x-circle" color="#666" />
                      <Text className="text-white text-sm mt-1">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-green-500 p-3 rounded-lg items-center"
                      onPress={() => updateStock(item.id, item.currentStock + 10)}
                    >
                      <Feather size={24} name="x-circle" color="#666" />
                      <Text className="text-white text-sm mt-1">Add 10</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-red-500 p-3 rounded-lg items-center"
                      onPress={() => deleteItem(item.id)}
                    >
                      <Feather size={24} name="x-circle" color="#666" />
                      <Text className="text-white text-sm mt-1">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-3/4">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold">Filter Categories</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Feather size={24} name="x-circle" color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text className="text-lg font-semibold mb-4">By Category</Text>
              {(['all', 'food', 'drinks', 'supplies', 'others'] as StockCategory[]).map(category => (
                <TouchableOpacity
                  key={category}
                  className={`px-4 py-3 rounded-lg mb-2 ${
                    filterBy === category ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                  onPress={() => {
                    setFilterBy(category);
                    setShowFilterModal(false);
                  }}
                >
                  <Text className={filterBy === category ? 'text-white font-semibold' : 'text-gray-700'}>
                    {category === 'all' ? '📦 All Items' :
                     category === 'food' ? '🍎 Food Items' :
                     category === 'drinks' ? '🥤 Drinks' :
                     category === 'supplies' ? '📦 Supplies' : '📁 Others'}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text className="text-lg font-semibold mt-6 mb-4">By Stock Status</Text>
              {(['low-stock', 'out-of-stock'] as const).map(status => {
                const count = stockItems.filter(item => item.status === status).length;
                return (
                  <TouchableOpacity
                    key={status}
                    className="bg-gray-100 px-4 py-3 rounded-lg mb-2 flex-row justify-between items-center"
                    onPress={() => {
                      // Filter by status - you could implement this
                      Alert.alert('Filter by status', 'Coming soon!');
                    }}
                  >
                    <Text className="text-gray-700">
                      {status === 'low-stock' ? '⚠️ Low Stock Items' : '❌ Out of Stock'}
                    </Text>
                    <Text className={`font-semibold ${status === 'low-stock' ? 'text-amber-600' : 'text-red-600'}`}>
                      {count}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Item Modal */}
      <AddItemModal />
    </SafeAreaView>
  );
};

export default Stock;