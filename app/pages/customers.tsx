import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { 
  Search, 
  Plus, 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
  Edit2,
  Trash2,
  MessageCircle,
  PhoneCall,
  ChevronRight,
  Download,
  Upload,
  CheckCircle,
  XCircle
} from "lucide-react-native";
import { useState } from "react";

const CUSTOMERS = [
  { 
    id: "1", 
    name: "John Smith", 
    email: "john.smith@email.com", 
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "2024-01-15",
    avatarColor: "#3B82F6",
    totalSpent: 5248.50,
    orders: 24,
    status: "active",
    tier: "Gold",
    lastOrder: "2 days ago",
    notes: "Preferred customer, likes email notifications"
  },
  { 
    id: "2", 
    name: "Emma Johnson", 
    email: "emma.j@email.com", 
    phone: "+1 (555) 987-6543",
    location: "Los Angeles, CA",
    joinDate: "2023-11-08",
    avatarColor: "#10B981",
    totalSpent: 3210.75,
    orders: 18,
    status: "active",
    tier: "Silver",
    lastOrder: "1 week ago",
    notes: "Frequent buyer, responsive to SMS"
  },
  { 
    id: "3", 
    name: "Michael Brown", 
    email: "m.brown@email.com", 
    phone: "+1 (555) 456-7890",
    location: "Chicago, IL",
    joinDate: "2024-02-20",
    avatarColor: "#8B5CF6",
    totalSpent: 890.25,
    orders: 5,
    status: "inactive",
    tier: "Bronze",
    lastOrder: "3 weeks ago",
    notes: "New customer, needs follow-up"
  },
  { 
    id: "4", 
    name: "Sarah Wilson", 
    email: "sarah.w@email.com", 
    phone: "+1 (555) 234-5678",
    location: "Miami, FL",
    joinDate: "2023-09-12",
    avatarColor: "#EC4899",
    totalSpent: 7650.00,
    orders: 32,
    status: "active",
    tier: "Platinum",
    lastOrder: "Yesterday",
    notes: "VIP customer, high-value orders"
  },
  { 
    id: "5", 
    name: "David Lee", 
    email: "david.lee@email.com", 
    phone: "+1 (555) 876-5432",
    location: "Seattle, WA",
    joinDate: "2024-03-05",
    avatarColor: "#F59E0B",
    totalSpent: 1245.90,
    orders: 7,
    status: "active",
    tier: "Silver",
    lastOrder: "5 days ago",
    notes: "Tech products only"
  },
  { 
    id: "6", 
    name: "Lisa Garcia", 
    email: "lisa.g@email.com", 
    phone: "+1 (555) 345-6789",
    location: "Austin, TX",
    joinDate: "2023-12-30",
    avatarColor: "#EF4444",
    totalSpent: 4320.60,
    orders: 21,
    status: "inactive",
    tier: "Gold",
    lastOrder: "1 month ago",
    notes: "Seasonal customer"
  },
  { 
    id: "7", 
    name: "Robert Chen", 
    email: "robert.c@email.com", 
    phone: "+1 (555) 654-3210",
    location: "Boston, MA",
    joinDate: "2024-01-28",
    avatarColor: "#06B6D4",
    totalSpent: 2980.30,
    orders: 15,
    status: "active",
    tier: "Silver",
    lastOrder: "3 days ago",
    notes: "B2B customer, bulk orders"
  },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const filteredCustomers = CUSTOMERS.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    
    const matchesStatus = 
      selectedStatus === "all" || 
      customer.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: CUSTOMERS.length,
    active: CUSTOMERS.filter(c => c.status === "active").length,
    totalRevenue: CUSTOMERS.reduce((sum, c) => sum + c.totalSpent, 0),
    totalOrders: CUSTOMERS.reduce((sum, c) => sum + c.orders, 0),
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-14 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-3xl font-bold text-gray-900">Customers</Text>
            <Text className="text-gray-500 mt-1">Manage your customer relationships</Text>
          </View>
          <TouchableOpacity className="bg-blue-500 px-4 py-3 rounded-xl flex-row items-center">
            <Plus size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Add Customer</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search customers by name, email, or phone..."
            className="flex-1 ml-3 text-gray-800"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text className="text-blue-500 font-medium">Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
          <View className="flex-row space-x-2">
            {[
              { id: "all", label: "All Customers", count: stats.total },
              { id: "active", label: "Active", count: stats.active },
              { id: "inactive", label: "Inactive", count: stats.total - stats.active },
              { id: "vip", label: "VIP", count: 2 },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setSelectedStatus(tab.id)}
                className={`px-4 py-2 rounded-full flex-row items-center ${
                  selectedStatus === tab.id
                    ? "bg-blue-500"
                    : "bg-gray-100"
                }`}
              >
                <Text
                  className={`font-medium ${
                    selectedStatus === tab.id
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {tab.label}
                </Text>
                <View className={`ml-2 px-2 py-1 rounded-full ${
                  selectedStatus === tab.id
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }`}>
                  <Text
                    className={`text-xs font-bold ${
                      selectedStatus === tab.id
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Stats Overview */}
      <View className="px-6 pt-4">
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-900">Overview</Text>
            <TouchableOpacity className="flex-row items-center">
              <Calendar size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-2">Last 30 days</Text>
              <ChevronRight size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mb-2">
                <User size={24} color="#3B82F6" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">{stats.total}</Text>
              <Text className="text-gray-500 text-sm">Total Customers</Text>
            </View>
            
            <View className="items-center flex-1 border-l border-r border-gray-200">
              <View className="w-12 h-12 bg-green-100 rounded-xl items-center justify-center mb-2">
                <CreditCard size={24} color="#10B981" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                ${stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </Text>
              <Text className="text-gray-500 text-sm">Total Revenue</Text>
            </View>
            
            <View className="items-center flex-1">
              <View className="w-12 h-12 bg-purple-100 rounded-xl items-center justify-center mb-2">
                <ShoppingBag size={24} color="#8B5CF6" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">{stats.totalOrders}</Text>
              <Text className="text-gray-500 text-sm">Total Orders</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Customers List */}
      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        <View className="mb-24">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Customer List ({filteredCustomers.length})
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Download size={18} color="#6B7280" />
              <Text className="text-gray-600 ml-1">Export</Text>
            </TouchableOpacity>
          </View>

          {filteredCustomers.map((customer) => (
            <TouchableOpacity
              key={customer.id}
              onPress={() => setSelectedCustomer(
                selectedCustomer === customer.id ? null : customer.id
              )}
              className={`bg-white rounded-2xl p-4 mb-3 shadow-sm border ${
                selectedCustomer === customer.id 
                  ? 'border-blue-300' 
                  : 'border-gray-200'
              }`}
            >
              <View className="flex-row items-start">
                {/* Avatar */}
                <View 
                  className="w-14 h-14 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: customer.avatarColor + '20' }}
                >
                  <Text className="text-2xl font-bold" style={{ color: customer.avatarColor }}>
                    {customer.name.charAt(0)}
                  </Text>
                </View>

                {/* Customer Info */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Text className="font-bold text-lg text-gray-900">
                        {customer.name}
                      </Text>
                      {customer.status === "active" ? (
                        <CheckCircle size={16} color="#10B981" className="ml-2" />
                      ) : (
                        <XCircle size={16} color="#EF4444" className="ml-2" />
                      )}
                    </View>
                    <View className="flex-row items-center">
                      <View className={`px-3 py-1 rounded-full ${
                        customer.tier === "Platinum" ? "bg-purple-100" :
                        customer.tier === "Gold" ? "bg-yellow-100" :
                        customer.tier === "Silver" ? "bg-gray-100" :
                        "bg-orange-100"
                      }`}>
                        <Text className={`text-xs font-bold ${
                          customer.tier === "Platinum" ? "text-purple-800" :
                          customer.tier === "Gold" ? "text-yellow-800" :
                          customer.tier === "Silver" ? "text-gray-800" :
                          "text-orange-800"
                        }`}>
                          {customer.tier}
                        </Text>
                      </View>
                      <ChevronRight 
                        size={20} 
                        color="#9CA3AF" 
                        className={`ml-2 transform ${
                          selectedCustomer === customer.id ? 'rotate-90' : ''
                        }`}
                      />
                    </View>
                  </View>

                  <View className="flex-row items-center mt-2">
                    <Mail size={14} color="#6B7280" />
                    <Text className="text-gray-600 ml-2 mr-4">{customer.email}</Text>
                  </View>

                  <View className="flex-row items-center mt-1">
                    <Phone size={14} color="#6B7280" />
                    <Text className="text-gray-600 ml-2 mr-4">{customer.phone}</Text>
                    <MapPin size={14} color="#6B7280" />
                    <Text className="text-gray-600 ml-2">{customer.location}</Text>
                  </View>

                  <View className="flex-row items-center justify-between mt-3">
                    <View className="flex-row items-center">
                      <CreditCard size={14} color="#6B7280" />
                      <Text className="text-gray-700 ml-2 font-medium">
                        ${customer.totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <ShoppingBag size={14} color="#6B7280" />
                      <Text className="text-gray-700 ml-2 font-medium">
                        {customer.orders} orders
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Calendar size={14} color="#6B7280" />
                      <Text className="text-gray-600 ml-2">
                        {customer.lastOrder}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Expanded Details */}
              {selectedCustomer === customer.id && (
                <View className="mt-4 pt-4 border-t border-gray-100">
                  <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-700 font-medium">Customer Details</Text>
                    <View className="flex-row">
                      <TouchableOpacity className="p-2 mr-2">
                        <Edit2 size={18} color="#6B7280" />
                      </TouchableOpacity>
                      <TouchableOpacity className="p-2">
                        <Trash2 size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="bg-gray-50 rounded-xl p-4 mb-3">
                    <Text className="text-gray-600 mb-2">Notes</Text>
                    <Text className="text-gray-800">{customer.notes}</Text>
                  </View>

                  <View className="flex-row space-x-2">
                    <TouchableOpacity className="flex-1 bg-blue-50 py-3 rounded-lg flex-row items-center justify-center">
                      <MessageCircle size={18} color="#3B82F6" />
                      <Text className="text-blue-700 font-semibold ml-2">Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-green-50 py-3 rounded-lg flex-row items-center justify-center">
                      <PhoneCall size={18} color="#10B981" />
                      <Text className="text-green-700 font-semibold ml-2">Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-lg flex-row items-center justify-center">
                      <ShoppingBag size={18} color="#6B7280" />
                      <Text className="text-gray-700 font-semibold ml-2">Orders</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Quick Action Buttons */}
      <View className="absolute bottom-6 right-6 flex-row items-center">
        <TouchableOpacity className="bg-white w-12 h-12 rounded-full items-center justify-center shadow-lg mr-3">
          <Upload size={20} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg">
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}