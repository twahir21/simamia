import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { 
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Download,
  Filter,
  Calendar,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CreditCard,
  Truck,
  RefreshCw,
  ChevronRight,
  ShoppingBag,
  Percent,
  Star,
  AlertCircle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  PieChart
} from "lucide-react-native";
import { useState } from "react";

const RECENT_SALES = [
  {
    id: "1",
    customer: "John Smith",
    email: "john.smith@email.com",
    amount: 425.50,
    status: "completed",
    payment: "Credit Card",
    items: 3,
    date: "Today, 10:30 AM",
    orderId: "#ORD-7894",
    color: "#10B981"
  },
  {
    id: "2",
    customer: "Emma Johnson",
    email: "emma.j@email.com",
    amount: 850.00,
    status: "processing",
    payment: "PayPal",
    items: 5,
    date: "Today, 9:15 AM",
    orderId: "#ORD-7893",
    color: "#F59E0B"
  },
  {
    id: "3",
    customer: "Michael Brown",
    email: "m.brown@email.com",
    amount: 129.99,
    status: "completed",
    payment: "Credit Card",
    items: 1,
    date: "Yesterday, 4:45 PM",
    orderId: "#ORD-7892",
    color: "#10B981"
  },
  {
    id: "4",
    customer: "Sarah Wilson",
    email: "sarah.w@email.com",
    amount: 2450.75,
    status: "shipped",
    payment: "Bank Transfer",
    items: 8,
    date: "Yesterday, 2:20 PM",
    orderId: "#ORD-7891",
    color: "#3B82F6"
  },
  {
    id: "5",
    customer: "David Lee",
    email: "david.lee@email.com",
    amount: 65.25,
    status: "pending",
    payment: "Credit Card",
    items: 2,
    date: "Dec 13, 2024",
    orderId: "#ORD-7890",
    color: "#EC4899"
  },
  {
    id: "6",
    customer: "Lisa Garcia",
    email: "lisa.g@email.com",
    amount: 320.40,
    status: "completed",
    payment: "PayPal",
    items: 4,
    date: "Dec 13, 2024",
    orderId: "#ORD-7889",
    color: "#10B981"
  },
];

const SALES_METRICS = [
  {
    title: "Total Revenue",
    value: "$28,450.80",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "#10B981",
    period: "This Month"
  },
  {
    title: "Total Orders",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "#3B82F6",
    period: "This Month"
  },
  {
    title: "Average Order",
    value: "$182.44",
    change: "+4.1%",
    trend: "up",
    icon: TrendingUp,
    color: "#8B5CF6",
    period: "This Month"
  },
  {
    title: "Conversion Rate",
    value: "3.8%",
    change: "+0.7%",
    trend: "up",
    icon: Percent,
    color: "#EC4899",
    period: "This Month"
  }
];

const TOP_PRODUCTS = [
  { name: "Wireless Headphones", sales: 142, revenue: "$12,850", growth: "+24%" },
  { name: "Smart Watch Series 5", sales: 98, revenue: "$9,800", growth: "+18%" },
  { name: "Laptop Backpack", sales: 76, revenue: "$3,800", growth: "+12%" },
  { name: "USB-C Charger", sales: 210, revenue: "$4,200", growth: "+32%" },
];

const SALES_BY_CATEGORY = [
  { category: "Electronics", amount: "$15,240", percentage: 53, color: "#3B82F6" },
  { category: "Clothing", amount: "$6,850", percentage: 24, color: "#10B981" },
  { category: "Home & Garden", amount: "$3,420", percentage: 12, color: "#F59E0B" },
  { category: "Accessories", amount: "$2,940", percentage: 10, color: "#EC4899" },
];

export default function SalesPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [timeRange, setTimeRange] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSale, setSelectedSale] = useState<string | null>(null);

  const statuses = [
    { id: "all", label: "All Sales", count: 156 },
    { id: "completed", label: "Completed", count: 124 },
    { id: "processing", label: "Processing", count: 18 },
    { id: "shipped", label: "Shipped", count: 9 },
    { id: "pending", label: "Pending", count: 5 },
  ];

  const filteredSales = RECENT_SALES.filter(sale => {
    const matchesSearch = 
      sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === "all" || 
      sale.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = SALES_METRICS[0].value;
  const totalOrders = SALES_METRICS[1].value;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} color="#10B981" />;
      case "processing":
        return <RefreshCw size={16} color="#F59E0B" />;
      case "shipped":
        return <Truck size={16} color="#3B82F6" />;
      case "pending":
        return <Clock size={16} color="#EC4899" />;
      default:
        return <AlertCircle size={16} color="#9CA3AF" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-14 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-3xl font-bold text-gray-900">Sales Dashboard</Text>
            <Text className="text-gray-500 mt-1">Monitor and manage your sales</Text>
          </View>
          <View className="flex-row space-x-2">
            <TouchableOpacity className="bg-gray-100 p-3 rounded-xl">
              <Download size={20} color="#4B5563" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-blue-500 p-3 rounded-xl">
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search sales by customer or order ID..."
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

        {/* Time Range Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
          <View className="flex-row space-x-2">
            {[
              { id: "today", label: "Today" },
              { id: "week", label: "This Week" },
              { id: "month", label: "This Month", active: true },
              { id: "quarter", label: "This Quarter" },
              { id: "year", label: "This Year" },
              { id: "custom", label: "Custom" },
            ].map((range) => (
              <TouchableOpacity
                key={range.id}
                onPress={() => setTimeRange(range.id)}
                className={`px-4 py-2 rounded-full flex-row items-center ${
                  timeRange === range.id
                    ? "bg-blue-500"
                    : "bg-gray-100"
                }`}
              >
                <Calendar 
                  size={16} 
                  color={timeRange === range.id ? "white" : "#6B7280"} 
                />
                <Text
                  className={`ml-2 font-medium ${
                    timeRange === range.id
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Key Metrics */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 pt-4">
        <View className="flex-row space-x-4 pb-2">
          {SALES_METRICS.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <View key={index} className="bg-white rounded-2xl p-4 min-w-[180px] border border-gray-200">
                <View className="flex-row items-center justify-between mb-3">
                  <View 
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: metric.color + '20' }}
                  >
                    <Icon size={24} color={metric.color} />
                  </View>
                  {metric.trend === "up" ? (
                    <ArrowUpRight size={20} color="#10B981" />
                  ) : (
                    <ArrowDownRight size={20} color="#EF4444" />
                  )}
                </View>
                
                <Text className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</Text>
                <Text className="text-gray-500 text-sm mb-2">{metric.title}</Text>
                
                <View className="flex-row items-center">
                  <View className={`px-2 py-1 rounded-full ${
                    metric.trend === "up" 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    <Text className={`text-xs font-bold ${
                      metric.trend === "up" 
                        ? 'text-green-700' 
                        : 'text-red-700'
                    }`}>
                      {metric.change}
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-xs ml-2">{metric.period}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Status Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 py-4">
        <View className="flex-row space-x-2">
          {statuses.map((status) => (
            <TouchableOpacity
              key={status.id}
              onPress={() => setSelectedStatus(status.id)}
              className={`px-4 py-3 rounded-xl flex-row items-center ${
                selectedStatus === status.id
                  ? "bg-blue-100 border border-blue-300"
                  : "bg-white border border-gray-200"
              }`}
            >
              {selectedStatus === status.id && (
                <Filter size={14} color="#3B82F6" className="mr-2" />
              )}
              <Text
                className={`font-medium ${
                  selectedStatus === status.id
                    ? "text-blue-700"
                    : "text-gray-700"
                }`}
              >
                {status.label}
              </Text>
              <View className={`ml-2 px-2 py-1 rounded-full ${
                selectedStatus === status.id
                  ? "bg-blue-600"
                  : "bg-gray-100"
              }`}>
                <Text
                  className={`text-xs font-bold ${
                    selectedStatus === status.id
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  {status.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Main Content */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Recent Sales */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Recent Sales</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-blue-600 font-medium">View All</Text>
              <ChevronRight size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {filteredSales.map((sale, index) => (
              <TouchableOpacity
                key={sale.id}
                onPress={() => setSelectedSale(
                  selectedSale === sale.id ? null : sale.id
                )}
                className={`p-4 ${index < filteredSales.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View 
                      className="w-12 h-12 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: sale.color + '20' }}
                    >
                      <Text className="font-bold text-lg" style={{ color: sale.color }}>
                        {sale.customer.charAt(0)}
                      </Text>
                    </View>
                    
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="font-semibold text-gray-900">{sale.customer}</Text>
                        <Text className="text-lg font-bold text-gray-900">
                          ${sale.amount.toFixed(2)}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center mt-1">
                        <Text className="text-gray-500 text-sm">{sale.orderId}</Text>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text className="text-gray-500 text-sm">{sale.date}</Text>
                      </View>
                      
                      <View className="flex-row items-center mt-2">
                        <View className={`px-3 py-1 rounded-full ${getStatusColor(sale.status)} flex-row items-center`}>
                          {getStatusIcon(sale.status)}
                          <Text className="text-xs font-medium ml-1 capitalize">{sale.status}</Text>
                        </View>
                        <View className="flex-row items-center ml-3">
                          <ShoppingBag size={12} color="#6B7280" />
                          <Text className="text-gray-600 text-xs ml-1">{sale.items} items</Text>
                        </View>
                        <View className="flex-row items-center ml-3">
                          <CreditCard size={12} color="#6B7280" />
                          <Text className="text-gray-600 text-xs ml-1">{sale.payment}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  <ChevronRight 
                    size={20} 
                    color="#9CA3AF" 
                    className={`transform ${
                      selectedSale === sale.id ? 'rotate-90' : ''
                    }`}
                  />
                </View>

                {/* Expanded Details */}
                {selectedSale === sale.id && (
                  <View className="mt-4 pt-4 border-t border-gray-100">
                    <View className="flex-row justify-between mb-4">
                      <Text className="text-gray-700 font-medium">Order Details</Text>
                      <View className="flex-row">
                        <TouchableOpacity className="p-2 mr-2">
                          <Eye size={18} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity className="p-2 mr-2">
                          <Edit2 size={18} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity className="p-2">
                          <Trash2 size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View className="bg-gray-50 rounded-xl p-4">
                      <View className="flex-row justify-between mb-3">
                        <View>
                          <Text className="text-gray-600 text-sm">Customer Email</Text>
                          <Text className="text-gray-900">{sale.email}</Text>
                        </View>
                        <View>
                          <Text className="text-gray-600 text-sm">Order Total</Text>
                          <Text className="text-gray-900 font-bold">${sale.amount.toFixed(2)}</Text>
                        </View>
                      </View>
                      
                      <View className="flex-row space-x-4">
                        <TouchableOpacity className="flex-1 bg-blue-50 py-3 rounded-lg flex-row items-center justify-center">
                          <ShoppingBag size={16} color="#3B82F6" />
                          <Text className="text-blue-700 font-medium ml-2">View Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-green-50 py-3 rounded-lg flex-row items-center justify-center">
                          <Truck size={16} color="#10B981" />
                          <Text className="text-green-700 font-medium ml-2">Track Shipment</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Charts Section */}
        <View className="mb-20">
          <View className="flex-row flex-wrap justify-between">
            {/* Top Products */}
            <View className="w-full lg:w-[48%] mb-4">
              <View className="bg-white rounded-2xl p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="font-bold text-gray-900">Top Products</Text>
                  <TouchableOpacity className="flex-row items-center">
                    <BarChart3 size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-1">Details</Text>
                  </TouchableOpacity>
                </View>
                
                {TOP_PRODUCTS.map((product, index) => (
                  <View 
                    key={index} 
                    className={`flex-row items-center justify-between py-3 ${
                      index < TOP_PRODUCTS.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <View className="flex-1">
                      <Text className="font-medium text-gray-900">{product.name}</Text>
                      <Text className="text-gray-500 text-sm mt-1">{product.sales} units sold</Text>
                    </View>
                    
                    <View className="items-end">
                      <Text className="font-bold text-gray-900">{product.revenue}</Text>
                      <View className="flex-row items-center mt-1">
                        <ArrowUpRight size={12} color="#10B981" />
                        <Text className="text-green-600 text-xs font-medium ml-1">
                          {product.growth}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Sales by Category */}
            <View className="w-full lg:w-[48%] mb-4">
              <View className="bg-white rounded-2xl p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="font-bold text-gray-900">Sales by Category</Text>
                  <TouchableOpacity className="flex-row items-center">
                    <PieChart size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-1">View Chart</Text>
                  </TouchableOpacity>
                </View>
                
                {SALES_BY_CATEGORY.map((item, index) => (
                  <View key={index} className="mb-4">
                    <View className="flex-row items-center justify-between mb-1">
                      <View className="flex-row items-center">
                        <View 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <Text className="text-gray-700">{item.category}</Text>
                      </View>
                      <Text className="font-bold text-gray-900">{item.amount}</Text>
                    </View>
                    
                    <View className="w-full bg-gray-200 rounded-full h-2">
                      <View 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </View>
                    
                    <Text className="text-gray-500 text-xs mt-1 text-right">
                      {item.percentage}% of total
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Quick Stats Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <DollarSign size={20} color="#10B981" />
            <Text className="text-gray-900 font-bold ml-2">{totalRevenue}</Text>
            <Text className="text-gray-500 ml-2">Revenue</Text>
          </View>
          
          <View className="flex-row items-center">
            <ShoppingCart size={20} color="#3B82F6" />
            <Text className="text-gray-900 font-bold ml-2">{totalOrders}</Text>
            <Text className="text-gray-500 ml-2">Orders</Text>
          </View>
          
          <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full flex-row items-center">
            <TrendingUp size={16} color="white" />
            <Text className="text-white font-medium ml-2">New Sale</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}