// components/OrdersScreen.tsx
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
import { Search, Filter, X, Phone, Clock, Package, CreditCard, ChevronDown, MoreVertical } from 'lucide-react-native';
import { Order, DeliveryStatus, PaymentStatus, SortOption, FilterOption } from '../types/order';
import { orders } from '../data/orders';

const OrdersScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [ordersList, setOrdersList] = useState<Order[]>(orders);

  // Filter and sort logic
  const filteredOrders = useMemo(() => {
    let result = ordersList.filter(order => {
      // Search filter
      const matchesSearch = 
        order.phone.includes(searchQuery) ||
        order.code.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'unpaid') return matchesSearch && order.payment === 'pending';
      return matchesSearch && order.delivery === filterBy;
    });

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime();
        case 'date-asc':
          return new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime();
        case 'pending-first':
          const statusOrder = { pending: 0, onway: 1, completed: 2 };
          return statusOrder[a.delivery] - statusOrder[b.delivery];
        case 'onway-first':
          const onwayOrder = { onway: 0, pending: 1, completed: 2 };
          return onwayOrder[a.delivery] - onwayOrder[b.delivery];
        default:
          return 0;
      }
    });

    return result;
  }, [ordersList, searchQuery, sortBy, filterBy]);

  // Status update functions
  const updateDeliveryStatus = (orderId: string, newStatus: DeliveryStatus) => {
    setOrdersList(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, delivery: newStatus } : order
      )
    );
  };

  const updatePaymentStatus = (orderId: string, newStatus: PaymentStatus) => {
    setOrdersList(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, payment: newStatus } : order
      )
    );
  };

  const deleteOrder = (orderId: string) => {
    Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setOrdersList(prev => prev.filter(order => order.id !== orderId));
          },
        },
      ]
    );
  };

  const callCustomer = (phone: string) => {
    Alert.alert('Call Customer', `Call ${phone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => console.log(`Calling ${phone}`) },
    ]);
  };

  // Status badge components
  const DeliveryBadge = ({ status }: { status: DeliveryStatus }) => {
    const config = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', icon: '⏳', label: 'Not Taken' },
      onway: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '🚚', label: 'On the Way' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', label: 'Delivered' },
    };
    const { bg, text, icon, label } = config[status];
    return (
      <View className={`px-3 py-1 rounded-full ${bg} flex-row items-center`}>
        <Text className={`text-sm font-medium ${text}`}>{icon} {label}</Text>
      </View>
    );
  };

  const PaymentBadge = ({ status }: { status: PaymentStatus }) => {
    const config = {
      pending: { bg: 'bg-red-100', text: 'text-red-800', icon: '💳', label: 'Pending' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', icon: '💰', label: 'Paid' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '❌', label: 'Cancelled' },
    };
    const { bg, text, icon, label } = config[status];
    return (
      <View className={`px-3 py-1 rounded-full ${bg} flex-row items-center`}>
        <Text className={`text-sm font-medium ${text}`}>{icon} {label}</Text>
      </View>
    );
  };

  // Action modal
  const ActionModal = ({ order }: { order: Order }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!selectedOrder}
      onRequestClose={() => setSelectedOrder(null)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold">Order Actions</Text>
            <TouchableOpacity onPress={() => setSelectedOrder(null)}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            <Text className="text-lg font-semibold">Delivery Status</Text>
            <View className="flex-row space-x-2">
              {(['pending', 'onway', 'completed'] as DeliveryStatus[]).map(status => (
                <TouchableOpacity
                  key={status}
                  className={`px-4 py-3 rounded-lg ${
                    order.delivery === status ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                  onPress={() => {
                    updateDeliveryStatus(order.id, status);
                    setSelectedOrder(null);
                  }}
                >
                  <Text className={order.delivery === status ? 'text-white font-semibold' : 'text-gray-700'}>
                    {status === 'pending' ? 'Not Taken' : 
                     status === 'onway' ? 'On Way' : 'Delivered'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-lg font-semibold mt-4">Payment Status</Text>
            <View className="flex-row space-x-2 flex-wrap">
              {(['pending', 'paid', 'cancelled'] as PaymentStatus[]).map(status => (
                <TouchableOpacity
                  key={status}
                  className={`px-4 py-3 rounded-lg mb-2 ${
                    order.payment === status ? 'bg-green-500' : 'bg-gray-100'
                  }`}
                  onPress={() => {
                    updatePaymentStatus(order.id, status);
                    setSelectedOrder(null);
                  }}
                >
                  <Text className={order.payment === status ? 'text-white font-semibold' : 'text-gray-700'}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className="bg-red-500 p-4 rounded-lg mt-6"
              onPress={() => {
                deleteOrder(order.id);
                setSelectedOrder(null);
              }}
            >
              <Text className="text-white text-center font-semibold">Delete Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border border-gray-300 p-4 rounded-lg"
              onPress={() => {
                callCustomer(order.phone);
                setSelectedOrder(null);
              }}
            >
              <Text className="text-center font-semibold">📞 Call Customer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-3xl font-bold text-gray-900">Orders</Text>
          <Text className="text-gray-600">{filteredOrders.length} orders</Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-3">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-gray-800"
            placeholder="Search by phone or order code..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter & Sort Row */}
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 flex-row items-center justify-between"
            onPress={() => setShowFilterModal(true)}
          >
            <View className="flex-row items-center">
              <Filter size={18} color="#4B5563" />
              <Text className="ml-2 text-gray-700">Filter</Text>
            </View>
            <Text className="text-gray-600 font-medium">
              {filterBy === 'all' ? 'All' : 
               filterBy === 'unpaid' ? 'Unpaid' : 
               filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 flex-row items-center justify-between"
            onPress={() => {
              const sortOptions: SortOption[] = ['date-desc', 'date-asc', 'pending-first', 'onway-first'];
              const currentIndex = sortOptions.indexOf(sortBy);
              const nextIndex = (currentIndex + 1) % sortOptions.length;
              setSortBy(sortOptions[nextIndex]);
            }}
          >
            <Text className="text-gray-700">Sort</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-600 font-medium mr-2">
                {sortBy === 'date-desc' ? 'Newest' :
                 sortBy === 'date-asc' ? 'Oldest' :
                 sortBy === 'pending-first' ? 'Pending First' : 'On Way First'}
              </Text>
              <ChevronDown size={18} color="#4B5563" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Orders List */}
      <ScrollView className="flex-1 px-4 py-6">
        {filteredOrders.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Package size={64} color="#D1D5DB" />
            <Text className="text-xl font-semibold text-gray-500 mt-4">No orders found</Text>
            <Text className="text-gray-400 mt-2">Try changing your search or filter</Text>
          </View>
        ) : (
          filteredOrders.map(order => (
            <View
              key={order.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-4 overflow-hidden"
            >
              {/* Card Header */}
              <View className="p-5 border-b border-gray-100">
                <View className="flex-row justify-between items-start mb-3">
                  <View>
                    <View className="flex-row items-center mb-1">
                      <Phone size={16} color="#4B5563" />
                      <Text className="ml-2 text-lg font-semibold text-gray-900">
                        {order.phone}
                      </Text>
                    </View>
                    <Text className="text-3xl font-bold text-blue-600">{order.code}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedOrder(order)}>
                    <MoreVertical size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center">
                  <Clock size={16} color="#4B5563" />
                  <Text className="ml-2 text-gray-600">
                    {order.date} • {order.time}
                  </Text>
                </View>
              </View>

              {/* Status Row */}
              <View className="p-5 flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm mb-2">Delivery</Text>
                  <DeliveryBadge status={order.delivery} />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-gray-500 text-sm mb-2">Payment</Text>
                  <PaymentBadge status={order.payment} />
                </View>
              </View>

              {/* Quick Actions */}
              <View className="flex-row border-t border-gray-100">
                <TouchableOpacity
                  className="flex-1 py-4 items-center border-r border-gray-100"
                  onPress={() => callCustomer(order.phone)}
                >
                  <Text className="text-blue-600 font-semibold">📞 Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-4 items-center"
                  onPress={() => setSelectedOrder(order)}
                >
                  <Text className="text-gray-700 font-semibold">✏️ Update</Text>
                </TouchableOpacity>
              </View>
            </View>
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
              <Text className="text-xl font-bold">Filter Orders</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text className="text-lg font-semibold mb-4">By Delivery Status</Text>
              {(['all', 'pending', 'onway', 'completed'] as FilterOption[]).map(option => (
                <TouchableOpacity
                  key={option}
                  className={`px-4 py-3 rounded-lg mb-2 ${
                    filterBy === option ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                  onPress={() => {
                    setFilterBy(option);
                    setShowFilterModal(false);
                  }}
                >
                  <Text className={filterBy === option ? 'text-white font-semibold' : 'text-gray-700'}>
                    {option === 'all' ? 'All Orders' :
                     option === 'pending' ? 'Not Taken ⏳' :
                     option === 'onway' ? 'On the Way 🚚' : 'Delivered ✅'}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text className="text-lg font-semibold mt-6 mb-4">By Payment Status</Text>
              <TouchableOpacity
                className={`px-4 py-3 rounded-lg mb-2 ${
                  filterBy === 'unpaid' ? 'bg-red-500' : 'bg-gray-100'
                }`}
                onPress={() => {
                  setFilterBy('unpaid');
                  setShowFilterModal(false);
                }}
              >
                <Text className={filterBy === 'unpaid' ? 'text-white font-semibold' : 'text-gray-700'}>
                  💳 Unpaid Orders
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Action Modal */}
      {selectedOrder && <ActionModal order={selectedOrder} />}
    </SafeAreaView>
  );
};

export default OrdersScreen;