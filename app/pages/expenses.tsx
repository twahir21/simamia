import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, ArrowUpRight, Receipt, Filter } from 'lucide-react-native';

const ExpensesScreen = () => {
  // Hardcoded categories for the UI
  const categories = ['All', 'Supplies', 'Rent', 'SaaS', 'Utilities', 'Salaries'];
  const [activeCategory, setActiveCategory] = useState('All');

  // Hardcoded mock data
  const transactions = [
    { id: '1', title: 'Monthly Shop Rent', category: 'Rent', amount: -1200.00, date: 'Oct 12', method: 'Bank Transfer' },
    { id: '2', title: 'POS Subscription', category: 'SaaS', amount: -49.99, date: 'Oct 11', method: 'Card' },
    { id: '3', title: 'Paper Rolls (10 units)', category: 'Supplies', amount: -25.50, date: 'Oct 10', method: 'Cash' },
    { id: '4', title: 'Electric Bill', category: 'Utilities', amount: -185.20, date: 'Oct 08', method: 'Bank Transfer' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Section */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-900">Expenses</Text>
          <TouchableOpacity className="bg-blue-600 p-2 rounded-full">
            <Plus color="white" size={24} />
          </TouchableOpacity>
        </View>

        {/* Total Summary Card */}
        <View className="bg-slate-900 p-5 rounded-3xl shadow-lg">
          <Text className="text-slate-400 text-sm font-medium">Total Monthly Outflow</Text>
          <Text className="text-white text-3xl font-bold mt-1">$1,460.69</Text>
          <View className="flex-row mt-4 items-center">
            <View className="flex-row items-center bg-red-500/20 px-2 py-1 rounded-lg">
              <ArrowUpRight color="#ef4444" size={16} />
              <Text className="text-red-400 ml-1 font-semibold">12% vs last month</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Filter Chips */}
      <View className="py-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`mr-3 px-5 py-2.5 rounded-full border ${
                activeCategory === cat ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'
              }`}
            >
              <Text className={`font-medium ${activeCategory === cat ? 'text-white' : 'text-gray-600'}`}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Transactions List */}
      <ScrollView className="flex-1 px-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-800">Recent Transactions</Text>
          <TouchableOpacity>
            <Filter color="#4b5563" size={20} />
          </TouchableOpacity>
        </View>

        {transactions.map((item) => (
          <View key={item.id} className="bg-white p-4 rounded-2xl mb-3 flex-row items-center shadow-sm border border-gray-100">
            <View className="bg-gray-100 p-3 rounded-xl mr-4">
              <Receipt color="#4b5563" size={24} />
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-base leading-tight">{item.title}</Text>
              <Text className="text-gray-500 text-xs mt-1">{item.category} • {item.method}</Text>
            </View>

            <View className="items-end">
              <Text className="text-red-600 font-bold text-base">
                {item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </Text>
              <Text className="text-gray-400 text-xs">{item.date}</Text>
            </View>
          </View>
        ))}

        {/* Spacing for bottom of scroll */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

export default ExpensesScreen;