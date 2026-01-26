import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { 
  Building,
  Phone,
  Mail,
  MapPin,
  Globe,
  Package,
  Truck,
  DollarSign,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Users,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
  Calendar,
  Shield,
  Award,
  CreditCard,
  MessageCircle,
  ShoppingBag,
  BarChart3,
  Percent,
  FileText,
  ExternalLink,
  Heart,
  Activity,
  Briefcase,
  Smartphone,
  Home
} from "lucide-react-native";
import { useState } from "react";

const SUPPLIERS = [
  {
    id: "1",
    name: "TechGlobal Inc.",
    category: "Electronics",
    contact: "John Smith",
    phone: "+1 (555) 123-4567",
    email: "orders@techglobal.com",
    website: "www.techglobal.com",
    location: "Shenzhen, China",
    rating: 4.8,
    reliability: 98,
    deliveryTime: "3-5 days",
    minOrder: 50,
    paymentTerms: "Net 30",
    status: "active",
    products: ["Headphones", "Chargers", "Cables"],
    totalOrders: 245,
    totalSpent: 45250.75,
    lastOrder: "2024-12-15",
    color: "#3B82F6",
    icon: Building,
    preferred: true
  },
  {
    id: "2",
    name: "EcoWear Fabrics",
    category: "Textiles",
    contact: "Sarah Johnson",
    phone: "+1 (555) 987-6543",
    email: "info@ecowear.com",
    website: "www.ecowear.com",
    location: "Portland, OR",
    rating: 4.7,
    reliability: 95,
    deliveryTime: "5-7 days",
    minOrder: 100,
    paymentTerms: "Net 45",
    status: "active",
    products: ["Cotton Fabric", "Organic Materials"],
    totalOrders: 128,
    totalSpent: 28750.40,
    lastOrder: "2024-12-14",
    color: "#10B981",
    icon: Shield,
    preferred: true
  },
  {
    id: "3",
    name: "PowerTech Industries",
    category: "Electronics",
    contact: "Michael Chen",
    phone: "+1 (555) 456-7890",
    email: "sales@powertech.com",
    website: "www.powertech.com",
    location: "San Jose, CA",
    rating: 4.9,
    reliability: 99,
    deliveryTime: "2-4 days",
    minOrder: 100,
    paymentTerms: "Net 15",
    status: "active",
    products: ["Chargers", "Power Banks", "Adapters"],
    totalOrders: 312,
    totalSpent: 68920.15,
    lastOrder: "2024-12-13",
    color: "#8B5CF6",
    icon: Award,
    preferred: true
  },
  {
    id: "4",
    name: "HomeGoods Manufacturing",
    category: "Home & Kitchen",
    contact: "Robert Davis",
    phone: "+1 (555) 234-5678",
    email: "orders@homegoods.com",
    website: "www.homegoods.com",
    location: "Chicago, IL",
    rating: 4.6,
    reliability: 96,
    deliveryTime: "3-5 days",
    minOrder: 40,
    paymentTerms: "Net 30",
    status: "active",
    products: ["Ceramics", "Kitchenware", "Decor"],
    totalOrders: 89,
    totalSpent: 15670.80,
    lastOrder: "2024-12-12",
    color: "#F59E0B",
    icon: Home,
    preferred: false
  },
  {
    id: "5",
    name: "Sustainable Textiles",
    category: "Textiles",
    contact: "Lisa Wang",
    phone: "+1 (555) 876-5432",
    email: "orders@sustainable.com",
    website: "www.sustainable.com",
    location: "Vancouver, Canada",
    rating: 4.4,
    reliability: 88,
    deliveryTime: "7-10 days",
    minOrder: 200,
    paymentTerms: "Net 60",
    status: "pending",
    products: ["Recycled Fabrics", "Eco Materials"],
    totalOrders: 45,
    totalSpent: 9850.25,
    lastOrder: "2024-12-05",
    color: "#EC4899",
    icon: Heart,
    preferred: false
  },
  {
    id: "6",
    name: "AudioMasters Co.",
    category: "Electronics",
    contact: "David Miller",
    phone: "+1 (555) 345-6789",
    email: "sales@audiomasters.com",
    website: "www.audiomasters.com",
    location: "Taipei, Taiwan",
    rating: 4.5,
    reliability: 92,
    deliveryTime: "5-7 days",
    minOrder: 30,
    paymentTerms: "Net 30",
    status: "inactive",
    products: ["Speakers", "Headphones", "Audio Equipment"],
    totalOrders: 167,
    totalSpent: 32580.60,
    lastOrder: "2024-11-28",
    color: "#EF4444",
    icon: AlertCircle,
    preferred: false
  },
  {
    id: "7",
    name: "FastPack Solutions",
    category: "Packaging",
    contact: "Emma Wilson",
    phone: "+1 (555) 654-3210",
    email: "info@fastpack.com",
    website: "www.fastpack.com",
    location: "Dallas, TX",
    rating: 4.3,
    reliability: 90,
    deliveryTime: "1-3 days",
    minOrder: 25,
    paymentTerms: "Net 15",
    status: "active",
    products: ["Boxes", "Bubble Wrap", "Tape"],
    totalOrders: 201,
    totalSpent: 18750.30,
    lastOrder: "2024-12-10",
    color: "#06B6D4",
    icon: Package,
    preferred: false
  },
];

const SUPPLIER_CATEGORIES = [
  { name: "All", count: 7, color: "#6B7280", icon: Building },
  { name: "Electronics", count: 3, color: "#3B82F6", icon: Smartphone },
  { name: "Textiles", count: 2, color: "#10B981", icon: Shield },
  { name: "Home & Kitchen", count: 1, color: "#F59E0B", icon: Home },
  { name: "Packaging", count: 1, color: "#06B6D4", icon: Package },
];

const SUPPLIER_STATS = {
  total: SUPPLIERS.length,
  active: SUPPLIERS.filter(s => s.status === "active").length,
  preferred: SUPPLIERS.filter(s => s.preferred).length,
  totalSpent: SUPPLIERS.reduce((sum, s) => sum + s.totalSpent, 0),
  totalOrders: SUPPLIERS.reduce((sum, s) => sum + s.totalOrders, 0),
  avgRating: (SUPPLIERS.reduce((sum, s) => sum + s.rating, 0) / SUPPLIERS.length).toFixed(1),
};

const PERFORMANCE_METRICS = [
  { label: "On-Time Delivery", value: "94%", trend: "up", icon: Truck },
  { label: "Quality Rating", value: "4.7/5", trend: "up", icon: Star },
  { label: "Response Time", value: "2.4h", trend: "down", icon: Clock },
  { label: "Cost Efficiency", value: "88%", trend: "up", icon: DollarSign },
];

export default function SuppliersPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [showOnlyPreferred, setShowOnlyPreferred] = useState(false);

  const statuses = [
    { id: "all", label: "All", count: SUPPLIERS.length },
    { id: "active", label: "Active", count: SUPPLIERS.filter(s => s.status === "active").length },
    { id: "pending", label: "Pending", count: SUPPLIERS.filter(s => s.status === "pending").length },
    { id: "inactive", label: "Inactive", count: SUPPLIERS.filter(s => s.status === "inactive").length },
  ];

  const filteredSuppliers = SUPPLIERS.filter(supplier => {
    const matchesCategory = selectedCategory === "All" || supplier.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || supplier.status === selectedStatus;
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPreferred = !showOnlyPreferred || supplier.preferred;
    
    return matchesCategory && matchesStatus && matchesSearch && matchesPreferred;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle size={16} color="#10B981" />;
      case "pending":
        return <Clock size={16} color="#F59E0B" />;
      case "inactive":
        return <AlertCircle size={16} color="#EF4444" />;
      default:
        return <AlertCircle size={16} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  };

  const calculateReliabilityColor = (reliability: number) => {
    if (reliability >= 95) return "#10B981";
    if (reliability >= 85) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-14 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-3xl font-bold text-gray-900">Suppliers</Text>
            <Text className="text-gray-500 mt-1">Manage your suppliers and vendors</Text>
          </View>
          <TouchableOpacity className="bg-blue-500 px-4 py-3 rounded-xl flex-row items-center">
            <Plus size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Add Supplier</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search suppliers by name, contact, or email..."
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

        {/* Quick Stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
          <View className="flex-row space-x-4">
            <View className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 min-w-[160px]">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-bold">Total Suppliers</Text>
                <Building size={20} color="white" />
              </View>
              <Text className="text-white text-2xl font-bold">{SUPPLIER_STATS.total}</Text>
              <Text className="text-blue-100 text-sm">{SUPPLIER_STATS.active} active</Text>
            </View>
            
            <View className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 min-w-[160px]">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-bold">Total Spent</Text>
                <DollarSign size={20} color="white" />
              </View>
              <Text className="text-white text-2xl font-bold">
                {formatCurrency(SUPPLIER_STATS.totalSpent)}
              </Text>
              <Text className="text-purple-100 text-sm">{SUPPLIER_STATS.totalOrders} orders</Text>
            </View>
            
            <View className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 min-w-[160px]">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-bold">Avg Rating</Text>
                <Star size={20} color="white" />
              </View>
              <Text className="text-white text-2xl font-bold">{SUPPLIER_STATS.avgRating}/5</Text>
              <Text className="text-green-100 text-sm">{SUPPLIER_STATS.preferred} preferred</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 py-4">
        <View className="flex-row space-x-3">
          {SUPPLIER_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <TouchableOpacity
                key={category.name}
                onPress={() => setSelectedCategory(category.name)}
                className={`px-4 py-3 rounded-xl flex-row items-center ${
                  selectedCategory === category.name
                    ? "border-2 bg-white"
                    : "bg-white border border-gray-200"
                }`}
                style={selectedCategory === category.name ? { borderColor: category.color } : {}}
              >
                <View 
                  className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  <Icon size={20} color={category.color} />
                </View>
                <View>
                  <Text
                    className={`font-medium ${
                      selectedCategory === category.name
                        ? "font-bold"
                        : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </Text>
                  <Text className="text-gray-500 text-sm">{category.count} suppliers</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Performance Metrics */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 pb-4">
        <View className="flex-row space-x-3">
          {PERFORMANCE_METRICS.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <View key={index} className="bg-white rounded-xl p-3 border border-gray-200 min-w-[140px]">
                <View className="flex-row items-center justify-between mb-2">
                  <Icon size={18} color="#4B5563" />
                  {metric.trend === "up" ? (
                    <TrendingUp size={16} color="#10B981" />
                  ) : (
                    <TrendingDown size={16} color="#EF4444" />
                  )}
                </View>
                <Text className="text-2xl font-bold text-gray-900">{metric.value}</Text>
                <Text className="text-gray-500 text-sm">{metric.label}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Filter Controls */}
      <View className="px-6 py-2">
        <View className="flex-row items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
          <View className="flex-row items-center space-x-4">
            {/* Status Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
              <View className="flex-row space-x-2">
                {statuses.map((status) => (
                  <TouchableOpacity
                    key={status.id}
                    onPress={() => setSelectedStatus(status.id)}
                    className={`px-3 py-2 rounded-full flex-row items-center ${
                      selectedStatus === status.id
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedStatus === status.id
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {status.label}
                    </Text>
                    <View className={`ml-2 px-1.5 py-0.5 rounded-full ${
                      selectedStatus === status.id
                        ? "bg-blue-600"
                        : "bg-gray-200"
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
          </View>
          
          {/* Preferred Toggle */}
          <TouchableOpacity 
            onPress={() => setShowOnlyPreferred(!showOnlyPreferred)}
            className={`flex-row items-center px-3 py-2 rounded-full ${
              showOnlyPreferred ? "bg-purple-100" : "bg-gray-100"
            }`}
          >
            <Star size={16} color={showOnlyPreferred ? "#8B5CF6" : "#6B7280"} />
            <Text className={`ml-2 text-sm font-medium ${
              showOnlyPreferred ? "text-purple-700" : "text-gray-700"
            }`}>
              Preferred
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-6 pb-24" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Supplier Directory ({filteredSuppliers.length})
            </Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity className="p-2">
                <Download size={18} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity className="p-2">
                <Upload size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Suppliers List */}
          <View className="space-y-3">
            {filteredSuppliers.map((supplier) => {
              const Icon = supplier.icon;
              return (
                <TouchableOpacity
                  key={supplier.id}
                  onPress={() => setSelectedSupplier(
                    selectedSupplier === supplier.id ? null : supplier.id
                  )}
                  className={`bg-white rounded-2xl p-4 border ${
                    selectedSupplier === supplier.id 
                      ? 'border-blue-300 shadow-sm' 
                      : 'border-gray-200'
                  }`}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-start flex-1">
                      <View 
                        className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                        style={{ backgroundColor: supplier.color + '20' }}
                      >
                        <Icon size={28} color={supplier.color} />
                        {supplier.preferred && (
                          <View className="absolute -top-1 -right-1">
                            <Star size={14} color="#F59E0B" fill="#F59E0B" />
                          </View>
                        )}
                      </View>
                      
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="font-bold text-gray-900">{supplier.name}</Text>
                          <View className="flex-row items-center">
                            <View className={`px-3 py-1 rounded-full border ${getStatusColor(supplier.status)} flex-row items-center mr-2`}>
                              {getStatusIcon(supplier.status)}
                              <Text className="text-xs font-medium ml-1 capitalize">
                                {supplier.status}
                              </Text>
                            </View>
                            <ChevronRight 
                              size={20} 
                              color="#9CA3AF" 
                              className={`transform ${
                                selectedSupplier === supplier.id ? 'rotate-90' : ''
                              }`}
                            />
                          </View>
                        </View>
                        
                        <Text className="text-gray-600 text-sm mb-3">{supplier.category}</Text>
                        
                        {/* Contact Info */}
                        <View className="flex-row items-center space-x-4 mb-3">
                          <View className="flex-row items-center">
                            <Users size={12} color="#6B7280" />
                            <Text className="text-gray-500 text-xs ml-1">{supplier.contact}</Text>
                          </View>
                          <View className="flex-row items-center">
                            <Phone size={12} color="#6B7280" />
                            <Text className="text-gray-500 text-xs ml-1">{supplier.phone}</Text>
                          </View>
                          <View className="flex-row items-center">
                            <MapPin size={12} color="#6B7280" />
                            <Text className="text-gray-500 text-xs ml-1">{supplier.location}</Text>
                          </View>
                        </View>
                        
                        {/* Performance Metrics */}
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center space-x-4">
                            <View className="flex-row items-center">
                              <Star size={12} color="#F59E0B" />
                              <Text className="text-gray-700 text-sm ml-1">{supplier.rating}/5</Text>
                            </View>
                            <View className="flex-row items-center">
                              <Shield size={12} color={calculateReliabilityColor(supplier.reliability)} />
                              <Text className="text-gray-700 text-sm ml-1">{supplier.reliability}%</Text>
                            </View>
                            <View className="flex-row items-center">
                              <Truck size={12} color="#3B82F6" />
                              <Text className="text-gray-700 text-sm ml-1">{supplier.deliveryTime}</Text>
                            </View>
                          </View>
                          
                          <View className="flex-row items-center">
                            <ShoppingBag size={12} color="#10B981" />
                            <Text className="text-gray-700 text-sm ml-1">{supplier.totalOrders} orders</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Expanded Details */}
                  {selectedSupplier === supplier.id && (
                    <View className="mt-4 pt-4 border-t border-gray-100">
                      <View className="flex-row justify-between mb-4">
                        <Text className="text-gray-800 font-medium">Supplier Details</Text>
                        <View className="flex-row space-x-2">
                          <TouchableOpacity className="p-2">
                            <Eye size={18} color="#6B7280" />
                          </TouchableOpacity>
                          <TouchableOpacity className="p-2">
                            <Edit2 size={18} color="#6B7280" />
                          </TouchableOpacity>
                          <TouchableOpacity className="p-2">
                            <Trash2 size={18} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      
                      <View className="bg-gray-50 rounded-xl p-4 mb-3">
                        <View className="grid grid-cols-2 gap-4">
                          <View>
                            <Text className="text-gray-600 text-sm mb-1">Email</Text>
                            <Text className="text-gray-900 font-medium flex-row items-center">
                              <Mail size={14} color="#6B7280" className="mr-2" />
                              {supplier.email}
                            </Text>
                          </View>
                          <View>
                            <Text className="text-gray-600 text-sm mb-1">Website</Text>
                            <TouchableOpacity className="flex-row items-center">
                              <Globe size={14} color="#3B82F6" className="mr-2" />
                              <Text className="text-blue-600 font-medium">{supplier.website}</Text>
                            </TouchableOpacity>
                          </View>
                          <View>
                            <Text className="text-gray-600 text-sm mb-1">Payment Terms</Text>
                            <Text className="text-gray-900 font-medium">{supplier.paymentTerms}</Text>
                          </View>
                          <View>
                            <Text className="text-gray-600 text-sm mb-1">Min Order</Text>
                            <Text className="text-gray-900 font-medium">{supplier.minOrder} units</Text>
                          </View>
                          <View>
                            <Text className="text-gray-600 text-sm mb-1">Total Spent</Text>
                            <Text className="text-gray-900 font-bold">{formatCurrency(supplier.totalSpent)}</Text>
                          </View>
                          <View>
                            <Text className="text-gray-600 text-sm mb-1">Last Order</Text>
                            <Text className="text-gray-900 font-medium">{supplier.lastOrder}</Text>
                          </View>
                        </View>
                        
                        <View className="mt-4">
                          <Text className="text-gray-600 text-sm mb-2">Products Supplied</Text>
                          <View className="flex-row flex-wrap gap-2">
                            {supplier.products.map((product, index) => (
                              <View 
                                key={index}
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full"
                              >
                                <Text className="text-gray-700 text-sm">{product}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      </View>
                      
                      <View className="flex-row space-x-2">
                        <TouchableOpacity className="flex-1 bg-blue-50 py-3 rounded-lg flex-row items-center justify-center">
                          <Phone size={18} color="#3B82F6" />
                          <Text className="text-blue-700 font-medium ml-2">Call Supplier</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-green-50 py-3 rounded-lg flex-row items-center justify-center">
                          <Mail size={18} color="#10B981" />
                          <Text className="text-green-700 font-medium ml-2">Send Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-purple-50 py-3 rounded-lg flex-row items-center justify-center">
                          <ShoppingBag size={18} color="#8B5CF6" />
                          <Text className="text-purple-700 font-medium ml-2">Place Order</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Supplier Performance Summary */}
        <View className="mb-20">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Top Performers</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-blue-600 font-medium">View Analytics</Text>
              <ChevronRight size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          
          <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {SUPPLIERS.filter(s => s.preferred)
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 3)
              .map((supplier, index) => (
                <View 
                  key={supplier.id}
                  className={`p-4 flex-row items-center justify-between ${
                    index < 2 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    <View 
                      className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                      style={{ backgroundColor: supplier.color + '20' }}
                    >
                      <Star size={20} color={supplier.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900">{supplier.name}</Text>
                      <View className="flex-row items-center mt-1">
                        <View className="flex-row items-center">
                          <Star size={12} color="#F59E0B" fill="#F59E0B" />
                          <Text className="text-gray-600 text-xs ml-1">{supplier.rating}/5</Text>
                        </View>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text className="text-gray-600 text-xs">{supplier.totalOrders} orders</Text>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text className="text-gray-600 text-xs">{supplier.reliability}% reliable</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View className="items-end">
                    <Text className="font-bold text-gray-900">{formatCurrency(supplier.totalSpent)}</Text>
                    <Text className="text-green-600 text-xs font-medium mt-1">Top Performer</Text>
                  </View>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>

      {/* Quick Actions Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="px-6 py-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Building size={20} color="#3B82F6" />
              <Text className="text-gray-900 font-bold ml-2">{SUPPLIER_STATS.total}</Text>
              <Text className="text-gray-500 ml-2">Total Suppliers</Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="flex-row items-center mr-4">
                <CheckCircle size={14} color="#10B981" />
                <Text className="text-green-600 text-sm ml-1">
                  {SUPPLIER_STATS.active} active
                </Text>
              </View>
              <View className="flex-row items-center">
                <Star size={14} color="#F59E0B" />
                <Text className="text-yellow-600 text-sm ml-1">
                  {SUPPLIER_STATS.preferred} preferred
                </Text>
              </View>
            </View>
          </View>
          
          <View className="flex-row space-x-2">
            <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center">
              <BarChart3 size={18} color="#6B7280" />
              <Text className="text-gray-700 font-medium ml-2">Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-blue-500 py-3 rounded-xl flex-row items-center justify-center">
              <Plus size={18} color="white" />
              <Text className="text-white font-bold ml-2">New Supplier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}