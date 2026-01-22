import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { StockItem, SortField, SortDirection, FilterOptions, ImportData } from '../app/(tabs)/ts';
import { SafeAreaView } from 'react-native-safe-area-context';
import StockCard from './card';
import FilterModal from './filter';
import AddStockModal from './addStock';
import ImportModal from '../app/(tabs)/home/components/import';


const StockManagement: React.FC = () => {
  // Initial hardcoded stock data
  const initialStockData: StockItem[] = [
    {
      id: '1',
      productCode: 'PROD-001',
      productName: 'Luxury Leather Handbag',
      category: 'Fashion',
      quantity: 150,
      unit: 'pcs',
      unitPrice: 299.99,
      totalValue: 44998.50,
      supplier: 'LeatherCraft Inc.',
      location: 'Warehouse A',
      reorderLevel: 20,
      lastUpdated: '2024-01-15',
      status: 'In Stock',
      batchNumber: 'BATCH-2024-001',
      expiryDate: '2026-12-31'
    },
    {
      id: '2',
      productCode: 'PROD-002',
      productName: 'Smart Watch Pro',
      category: 'Electronics',
      quantity: 8,
      unit: 'pcs',
      unitPrice: 349.99,
      totalValue: 2799.92,
      supplier: 'TechGadgets Ltd.',
      location: 'Warehouse B',
      reorderLevel: 15,
      lastUpdated: '2024-01-14',
      status: 'Low Stock',
      batchNumber: 'BATCH-2024-002'
    },
    {
      id: '3',
      productCode: 'PROD-003',
      productName: 'Organic Coffee Beans',
      category: 'Food & Beverages',
      quantity: 0,
      unit: 'kg',
      unitPrice: 24.99,
      totalValue: 0,
      supplier: 'Organic Farms Co.',
      location: 'Warehouse C',
      reorderLevel: 50,
      lastUpdated: '2024-01-13',
      status: 'Out of Stock',
      batchNumber: 'BATCH-2023-012',
      expiryDate: '2024-06-30'
    },
    {
      id: '4',
      productCode: 'PROD-004',
      productName: 'Yoga Mat Premium',
      category: 'Fitness',
      quantity: 75,
      unit: 'pcs',
      unitPrice: 49.99,
      totalValue: 3749.25,
      supplier: 'FitLife Brands',
      location: 'Warehouse A',
      reorderLevel: 25,
      lastUpdated: '2024-01-15',
      status: 'In Stock',
      batchNumber: 'BATCH-2024-003'
    },
    {
      id: '5',
      productCode: 'PROD-005',
      productName: 'Bluetooth Earbuds',
      category: 'Electronics',
      quantity: 200,
      unit: 'pcs',
      unitPrice: 89.99,
      totalValue: 17998.00,
      supplier: 'AudioTech Solutions',
      location: 'Warehouse B',
      reorderLevel: 30,
      lastUpdated: '2024-01-12',
      status: 'In Stock',
      batchNumber: 'BATCH-2024-004'
    },
    {
      id: '6',
      productCode: 'PROD-006',
      productName: 'Designer Sunglasses',
      category: 'Fashion',
      quantity: 45,
      unit: 'pcs',
      unitPrice: 159.99,
      totalValue: 7199.55,
      supplier: 'VisionStyle Inc.',
      location: 'Warehouse A',
      reorderLevel: 20,
      lastUpdated: '2024-01-11',
      status: 'In Stock',
      batchNumber: 'BATCH-2024-005'
    },
    {
      id: '7',
      productCode: 'PROD-007',
      productName: 'Protein Powder',
      category: 'Fitness',
      quantity: 12,
      unit: 'kg',
      unitPrice: 39.99,
      totalValue: 479.88,
      supplier: 'MuscleFuel Ltd.',
      location: 'Warehouse C',
      reorderLevel: 25,
      lastUpdated: '2024-01-10',
      status: 'Low Stock',
      batchNumber: 'BATCH-2023-015',
      expiryDate: '2025-03-31'
    }
  ];

  // State Management
  const [stocks, setStocks] = useState<StockItem[]>(initialStockData);
  const [filteredStocks, setFilteredStocks] = useState<StockItem[]>(initialStockData);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('productName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: '',
    status: '',
    minQuantity: 0,
    maxQuantity: 10000,
    location: ''
  });

  // Stats Calculation
  const stats = {
    totalItems: stocks.length,
    totalValue: stocks.reduce((sum, item) => sum + item.totalValue, 0),
    inStock: stocks.filter(item => item.status === 'In Stock').length,
    lowStock: stocks.filter(item => item.status === 'Low Stock').length,
    outOfStock: stocks.filter(item => item.status === 'Out of Stock').length
  };

  // Search Functionality
  useEffect(() => {
    let results = stocks.filter(stock =>
      stock.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply filters
    if (filterOptions.category) {
      results = results.filter(item => item.category === filterOptions.category);
    }
    if (filterOptions.status) {
      results = results.filter(item => item.status === filterOptions.status);
    }
    if (filterOptions.location) {
      results = results.filter(item => item.location === filterOptions.location);
    }
    results = results.filter(item => 
      item.quantity >= filterOptions.minQuantity && 
      item.quantity <= filterOptions.maxQuantity
    );

    // Apply sorting
    results.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'lastUpdated') {
        aValue = new Date(a.lastUpdated).getTime();
        bValue = new Date(b.lastUpdated).getTime();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredStocks(results);
  }, [searchQuery, stocks, sortField, sortDirection, filterOptions]);

  // Sort Handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Add New Stock
  const handleAddStock = (newStock: Omit<StockItem, 'id' | 'totalValue' | 'status'>) => {
    const totalValue = newStock.quantity * newStock.unitPrice;
    const status = newStock.quantity === 0 ? 'Out of Stock' : 
                  newStock.quantity <= newStock.reorderLevel ? 'Low Stock' : 'In Stock';
    
    const stockWithId: StockItem = {
      ...newStock,
      id: Date.now().toString(),
      totalValue,
      status,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setStocks(prev => [...prev, stockWithId]);
    setShowAddModal(false);
    Alert.alert('Success', 'Stock item added successfully!');
  };

  // Import Stock
  const handleImport = (importData: ImportData[]) => {
    const newStocks: StockItem[] = importData.map((item, index) => {
      const totalValue = item.quantity * item.unitPrice;
      const status = item.quantity === 0 ? 'Out of Stock' : 'In Stock';
      
      return {
        ...item,
        id: (Date.now() + index).toString(),
        totalValue,
        status,
        reorderLevel: Math.ceil(item.quantity * 0.2),
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    });

    setStocks(prev => [...prev, ...newStocks]);
    setShowImportModal(false);
    Alert.alert('Success', `${importData.length} items imported successfully!`);
  };

  // Update Stock
  const handleUpdateStock = (updatedStock: StockItem) => {
    setStocks(prev => prev.map(item => 
      item.id === updatedStock.id ? updatedStock : item
    ));
    setSelectedStock(null);
  };

  // Delete Stock
  const handleDeleteStock = (id: string) => {
    Alert.alert(
      'Delete Stock',
      'Are you sure you want to delete this stock item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setStocks(prev => prev.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  // Export Data
  const handleExport = () => {
    const csv = [
      ['Product Code', 'Product Name', 'Category', 'Quantity', 'Unit', 'Unit Price', 'Total Value', 'Status'],
      ...filteredStocks.map(item => [
        item.productCode,
        item.productName,
        item.category,
        item.quantity.toString(),
        item.unit,
        item.unitPrice.toString(),
        item.totalValue.toString(),
        item.status
      ])
    ].map(row => row.join(',')).join('\n');

    // In a real app, you would save this file
    Alert.alert('Export Complete', `${filteredStocks.length} items exported to CSV format.`);
    console.log('CSV Data:', csv);
  };

  // Print Functionality
  const handlePrint = () => {
    Alert.alert('Print', 'Print functionality would be implemented here');
    // In a real app, you would implement actual printing
  };

  // Render Sort Button
  const renderSortButton = (field: SortField, label: string) => (
    <TouchableOpacity
      onPress={() => handleSort(field)}
      className={`flex-row items-center px-3 py-2 rounded-lg mr-2 ${
        sortField === field ? 'bg-blue-100' : 'bg-gray-100'
      }`}
    >
      <Text className="text-gray-700">{label}</Text>
      {sortField === field && (
        <MaterialIcons
          name={sortDirection === 'asc' ? 'arrow-upward' : 'arrow-downward'}
          size={16}
          color="#3B82F6"
          className="ml-1"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-3xl font-bold text-gray-900">Stock Management</Text>
            <Text className="text-gray-500">Simamia App Inventory System</Text>
          </View>
          <TouchableOpacity className="bg-blue-500 p-3 rounded-full">
            <Feather name="shopping-cart" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search products by name, code, or category..."
            className="flex-1 ml-3 text-gray-700"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row space-x-3">
            <View className="bg-blue-50 p-4 rounded-xl min-w-[120px]">
              <Text className="text-blue-600 font-semibold">Total Items</Text>
              <Text className="text-2xl font-bold text-gray-900">{stats.totalItems}</Text>
            </View>
            <View className="bg-green-50 p-4 rounded-xl min-w-[120px]">
              <Text className="text-green-600 font-semibold">Total Value</Text>
              <Text className="text-2xl font-bold text-gray-900">
                ${stats.totalValue.toLocaleString()}
              </Text>
            </View>
            <View className="bg-yellow-50 p-4 rounded-xl min-w-[120px]">
              <Text className="text-yellow-600 font-semibold">Low Stock</Text>
              <Text className="text-2xl font-bold text-gray-900">{stats.lowStock}</Text>
            </View>
            <View className="bg-red-50 p-4 rounded-xl min-w-[120px]">
              <Text className="text-red-600 font-semibold">Out of Stock</Text>
              <Text className="text-2xl font-bold text-gray-900">{stats.outOfStock}</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Action Bar */}
      <View className="flex-row justify-between items-center px-6 py-3 bg-white border-b border-gray-200">
        <View className="flex-row">
          {renderSortButton('productName', 'Name')}
          {renderSortButton('quantity', 'Quantity')}
          {renderSortButton('totalValue', 'Value')}
        </View>
        
        <TouchableOpacity
          onPress={() => setShowFilterModal(true)}
          className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
        >
          <Feather name="filter" size={16} color="#6B7280" />
          <Text className="ml-2 text-gray-700">Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Stock List */}
      <FlatList
        data={filteredStocks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StockCard
            item={item}
            onEdit={() => setSelectedStock(item)}
            onDelete={() => handleDeleteStock(item.id)}
          />
        )}
        contentContainerClassName="p-4"
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4">No stock items found</Text>
          </View>
        }
      />

      {/* Bottom Action Bar */}
      <View className="flex-row justify-between px-6 py-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={() => setShowImportModal(true)}
          className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl flex-1 mr-2"
        >
          <Feather name="upload" size={20} color="#6B7280" />
          <Text className="ml-2 font-medium text-gray-700">Import</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleExport}
          className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl flex-1 mx-2"
        >
          <Feather name="download" size={20} color="#6B7280" />
          <Text className="ml-2 font-medium text-gray-700">Export</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handlePrint}
          className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl flex-1 ml-2"
        >
          <Feather name="printer" size={20} color="#6B7280" />
          <Text className="ml-2 font-medium text-gray-700">Print</Text>
        </TouchableOpacity>
      </View>

      {/* Add Stock Button */}
      <TouchableOpacity
        onPress={() => setShowAddModal(true)}
        className="absolute bottom-24 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Modals */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={(filters) => {
          setFilterOptions(filters);
          setShowFilterModal(false);
        }}
        currentFilters={filterOptions}
        categories={[...new Set(stocks.map(item => item.category))]}
        locations={[...new Set(stocks.map(item => item.location))]}
      />

      <AddStockModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddStock}
      />

      <ImportModal
        visible={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
      />

      {selectedStock && (
        <AddStockModal
          visible={!!selectedStock}
          onClose={() => setSelectedStock(null)}
          onAdd={handleUpdateStock}
          initialData={selectedStock}
          isEdit={true}
        />
      )}
    </SafeAreaView>
  );
};

export default StockManagement;