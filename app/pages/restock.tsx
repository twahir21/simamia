import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch } from "react-native";
import { 
  Package,
  Truck,
  Building,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Percent,
  DollarSign,
  ShoppingBag,
  PackagePlus,
  PackageCheck,
  PackageX,
  Users,
  CreditCard,
  Send,
  MessageSquare,
  Star,
  Shield,
  Award
} from "lucide-react-native";
import { useState } from "react";

// Product with multiple suppliers
const PRODUCTS = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    sku: "PROD-001",
    currentStock: 12,
    minStock: 25,
    maxStock: 100,
    price: 89.99,
    category: "Electronics",
    status: "low",
    suppliers: [
      {
        id: "s1",
        name: "TechGlobal Inc.",
        rating: 4.8,
        deliveryTime: "3-5 days",
        price: 79.99,
        minOrder: 50,
        reliability: 98,
        contact: "+1 (555) 123-4567",
        email: "orders@techglobal.com",
        location: "Shenzhen, China",
        status: "preferred"
      },
      {
        id: "s2",
        name: "AudioMasters Co.",
        rating: 4.5,
        deliveryTime: "5-7 days",
        price: 75.50,
        minOrder: 30,
        reliability: 92,
        contact: "+1 (555) 987-6543",
        email: "sales@audiomasters.com",
        location: "Taipei, Taiwan",
        status: "approved"
      },
      {
        id: "s3",
        name: "SoundTech Solutions",
        rating: 4.2,
        deliveryTime: "7-10 days",
        price: 72.25,
        minOrder: 100,
        reliability: 85,
        contact: "+1 (555) 456-7890",
        email: "info@soundtech.com",
        location: "Seoul, South Korea",
        status: "approved"
      }
    ],
    lastOrdered: "2024-11-15",
    reorderQuantity: 75,
    estimatedCost: 5999.25,
    notes: "Best seller, need to maintain stock"
  },
  {
    id: "2",
    name: "USB-C Fast Charger 65W",
    sku: "PROD-002",
    currentStock: 45,
    minStock: 50,
    maxStock: 200,
    price: 34.99,
    category: "Electronics",
    status: "medium",
    suppliers: [
      {
        id: "s4",
        name: "PowerTech Industries",
        rating: 4.9,
        deliveryTime: "2-4 days",
        price: 28.50,
        minOrder: 100,
        reliability: 99,
        contact: "+1 (555) 234-5678",
        email: "sales@powertech.com",
        location: "San Jose, CA",
        status: "preferred"
      },
      {
        id: "s5",
        name: "ChargeRight Co.",
        rating: 4.3,
        deliveryTime: "4-6 days",
        price: 26.75,
        minOrder: 50,
        reliability: 90,
        contact: "+1 (555) 876-5432",
        email: "orders@chargeright.com",
        location: "Austin, TX",
        status: "approved"
      }
    ],
    lastOrdered: "2024-12-01",
    reorderQuantity: 150,
    estimatedCost: 4282.50,
    notes: "Fast moving item, multiple variants available"
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    sku: "PROD-003",
    currentStock: 8,
    minStock: 30,
    maxStock: 150,
    price: 24.99,
    category: "Clothing",
    status: "critical",
    suppliers: [
      {
        id: "s6",
        name: "EcoWear Fabrics",
        rating: 4.7,
        deliveryTime: "5-7 days",
        price: 18.50,
        minOrder: 100,
        reliability: 95,
        contact: "+1 (555) 345-6789",
        email: "info@ecowear.com",
        location: "Portland, OR",
        status: "preferred"
      },
      {
        id: "s7",
        name: "Sustainable Textiles",
        rating: 4.4,
        deliveryTime: "7-10 days",
        price: 16.75,
        minOrder: 200,
        reliability: 88,
        contact: "+1 (555) 654-3210",
        email: "orders@sustainable.com",
        location: "Vancouver, Canada",
        status: "approved"
      },
      {
        id: "s8",
        name: "CottonDirect Ltd.",
        rating: 4.1,
        deliveryTime: "10-14 days",
        price: 15.25,
        minOrder: 50,
        reliability: 82,
        contact: "+1 (555) 765-4321",
        email: "sales@cottondirect.com",
        location: "Mumbai, India",
        status: "new"
      }
    ],
    lastOrdered: "2024-11-20",
    reorderQuantity: 120,
    estimatedCost: 2220.00,
    notes: "Popular design, need to reorder all sizes"
  },
  {
    id: "4",
    name: "Ceramic Coffee Mug Set",
    sku: "PROD-004",
    currentStock: 35,
    minStock: 20,
    maxStock: 80,
    price: 29.99,
    category: "Home & Kitchen",
    status: "good",
    suppliers: [
      {
        id: "s9",
        name: "HomeGoods Manufacturing",
        rating: 4.6,
        deliveryTime: "3-5 days",
        price: 22.00,
        minOrder: 40,
        reliability: 96,
        contact: "+1 (555) 432-1098",
        email: "orders@homegoods.com",
        location: "Chicago, IL",
        status: "preferred"
      }
    ],
    lastOrdered: "2024-12-05",
    reorderQuantity: 45,
    estimatedCost: 990.00,
    notes: "Seasonal item, stock levels adequate"
  },
];

const REORDER_STATS = {
  critical: PRODUCTS.filter(p => p.status === "critical").length,
  low: PRODUCTS.filter(p => p.status === "low").length,
  medium: PRODUCTS.filter(p => p.status === "medium").length,
  good: PRODUCTS.filter(p => p.status === "good").length,
  totalCost: PRODUCTS.reduce((sum, p) => sum + p.estimatedCost, 0),
  totalItems: PRODUCTS.reduce((sum, p) => sum + p.reorderQuantity, 0),
};

export default function RestockPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [showOnlyPreferred, setShowOnlyPreferred] = useState(false);
  const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({});

  const statuses = [
    { id: "all", label: "All Products", icon: Package, color: "#6B7280" },
    { id: "critical", label: "Critical", icon: AlertCircle, color: "#EF4444" },
    { id: "low", label: "Low Stock", icon: TrendingDown, color: "#F59E0B" },
    { id: "medium", label: "Medium", icon: Clock, color: "#3B82F6" },
    { id: "good", label: "Good", icon: CheckCircle, color: "#10B981" },
  ];

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === "all" || 
      product.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "good":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertCircle size={14} color="#EF4444" />;
      case "low":
        return <TrendingDown size={14} color="#F59E0B" />;
      case "medium":
        return <Clock size={14} color="#3B82F6" />;
      case "good":
        return <CheckCircle size={14} color="#10B981" />;
      default:
        return <Package size={14} color="#6B7280" />;
    }
  };

  const getSupplierStatusColor = (status: string) => {
    switch (status) {
      case "preferred":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const updateOrderQuantity = (productId: string, supplierId: string, quantity: number) => {
    const key = `${productId}-${supplierId}`;
    setOrderQuantities(prev => ({
      ...prev,
      [key]: Math.max(0, quantity)
    }));
  };

  const calculateSupplierCost = (productId: string, supplierId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    const supplier = product?.suppliers.find(s => s.id === supplierId);
    const key = `${productId}-${supplierId}`;
    const quantity = orderQuantities[key] || 0;
    return quantity * (supplier?.price || 0);
  };

  const totalOrderCost = Object.keys(orderQuantities).reduce((total, key) => {
    const [productId, supplierId] = key.split('-');
    return total + calculateSupplierCost(productId, supplierId);
  }, 0);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-14 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-3xl font-bold text-gray-900">Re-Stock Management</Text>
            <Text className="text-gray-500 mt-1">Restock products from suppliers</Text>
          </View>
          <TouchableOpacity className="bg-blue-500 px-4 py-3 rounded-xl flex-row items-center">
            <Send size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Place Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search products by name or SKU..."
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
            <View className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 min-w-[180px]">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-bold">Critical</Text>
                <AlertCircle size={20} color="white" />
              </View>
              <Text className="text-white text-2xl font-bold">{REORDER_STATS.critical}</Text>
              <Text className="text-red-100 text-sm">Needs immediate attention</Text>
            </View>
            
            <View className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 min-w-[180px]">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-bold">Total Cost</Text>
                <DollarSign size={20} color="white" />
              </View>
              <Text className="text-white text-2xl font-bold">
                ${REORDER_STATS.totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </Text>
              <Text className="text-blue-100 text-sm">Estimated reorder cost</Text>
            </View>
            
            <View className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 min-w-[180px]">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-bold">Total Items</Text>
                <PackagePlus size={20} color="white" />
              </View>
              <Text className="text-white text-2xl font-bold">{REORDER_STATS.totalItems}</Text>
              <Text className="text-green-100 text-sm">Items to reorder</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Status Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 py-4">
        <View className="flex-row space-x-2">
          {statuses.map((status) => {
            const Icon = status.icon;
            return (
              <TouchableOpacity
                key={status.id}
                onPress={() => setSelectedStatus(status.id)}
                className={`px-4 py-3 rounded-xl flex-row items-center ${
                  selectedStatus === status.id
                    ? "border-2"
                    : "border border-gray-200 bg-white"
                }`}
                style={selectedStatus === status.id ? { borderColor: status.color } : {}}
              >
                <Icon size={18} color={selectedStatus === status.id ? status.color : "#6B7280"} />
                <Text
                  className={`ml-2 font-medium ${
                    selectedStatus === status.id
                      ? "font-bold"
                      : "text-gray-700"
                  }`}
                  style={selectedStatus === status.id ? { color: status.color } : {}}
                >
                  {status.label}
                </Text>
                <View className={`ml-2 px-2 py-1 rounded-full ${
                  selectedStatus === status.id
                    ? "bg-white"
                    : "bg-gray-100"
                }`}>
                  <Text
                    className={`text-xs font-bold ${
                      selectedStatus === status.id
                        ? "text-gray-800"
                        : "text-gray-600"
                    }`}
                  >
                    {PRODUCTS.filter(p => status.id === "all" || p.status === status.id).length}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Filter Toggle */}
      <View className="px-6 py-2">
        <View className="bg-white rounded-xl p-4 border border-gray-200 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Star size={18} color="#8B5CF6" />
            <Text className="text-gray-800 font-medium ml-2">Show only preferred suppliers</Text>
          </View>
          <Switch
            value={showOnlyPreferred}
            onValueChange={setShowOnlyPreferred}
            trackColor={{ false: "#D1D5DB", true: "#8B5CF6" }}
            thumbColor={showOnlyPreferred ? "#FFFFFF" : "#FFFFFF"}
          />
        </View>
      </View>

      {/* Products List */}
      <ScrollView className="flex-1 px-6 pb-24" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Products to Re-stock ({filteredProducts.length})
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Download size={18} color="#6B7280" />
              <Text className="text-gray-600 ml-1">Export List</Text>
            </TouchableOpacity>
          </View>

          {filteredProducts.map((product) => (
            <View key={product.id} className="mb-4">
              {/* Product Card */}
              <TouchableOpacity
                onPress={() => setSelectedProduct(
                  selectedProduct === product.id ? null : product.id
                )}
                className={`bg-white rounded-2xl p-4 border ${
                  selectedProduct === product.id 
                    ? 'border-blue-300 shadow-sm' 
                    : 'border-gray-200'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mr-3">
                      <Package size={24} color="#3B82F6" />
                    </View>
                    
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="font-bold text-gray-900">{product.name}</Text>
                        <View className={`px-3 py-1 rounded-full border ${getStatusColor(product.status)} flex-row items-center`}>
                          {getStatusIcon(product.status)}
                          <Text className="text-xs font-medium ml-1 capitalize">
                            {product.status} Stock
                          </Text>
                        </View>
                      </View>
                      
                      <View className="flex-row items-center mt-2">
                        <Text className="text-gray-500 text-sm">{product.sku}</Text>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text className="text-gray-500 text-sm">{product.category}</Text>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text className="text-gray-500 text-sm">Stock: {product.currentStock}/{product.maxStock}</Text>
                      </View>
                      
                      {/* Stock Progress */}
                      <View className="mt-3">
                        <View className="flex-row justify-between mb-1">
                          <Text className="text-gray-700 text-sm">
                            Stock Level: {product.currentStock} / {product.maxStock}
                          </Text>
                          <Text className="text-gray-700 text-sm font-medium">
                            Min: {product.minStock}
                          </Text>
                        </View>
                        <View className="w-full bg-gray-200 rounded-full h-2">
                          <View 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${(product.currentStock / product.maxStock) * 100}%`,
                              backgroundColor: 
                                product.status === "critical" ? "#EF4444" :
                                product.status === "low" ? "#F59E0B" :
                                product.status === "medium" ? "#3B82F6" : "#10B981"
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  <ChevronRight 
                    size={20} 
                    color="#9CA3AF" 
                    className={`transform ${
                      selectedProduct === product.id ? 'rotate-90' : ''
                    }`}
                  />
                </View>

                {/* Expanded Suppliers */}
                {selectedProduct === product.id && (
                  <View className="mt-4 pt-4 border-t border-gray-100">
                    <View className="flex-row items-center justify-between mb-4">
                      <Text className="text-gray-800 font-bold">Available Suppliers ({product.suppliers.length})</Text>
                      <TouchableOpacity className="flex-row items-center">
                        <Truck size={16} color="#6B7280" />
                        <Text className="text-gray-600 text-sm ml-1">Compare All</Text>
                      </TouchableOpacity>
                    </View>

                    {product.suppliers
                      .filter(supplier => !showOnlyPreferred || supplier.status === "preferred")
                      .map((supplier) => (
                        <TouchableOpacity
                          key={supplier.id}
                          onPress={() => setSelectedSupplier(
                            selectedSupplier === supplier.id ? null : supplier.id
                          )}
                          className={`bg-gray-50 rounded-xl p-4 mb-3 border ${
                            selectedSupplier === supplier.id 
                              ? 'border-blue-300' 
                              : 'border-gray-200'
                          }`}
                        >
                          <View className="flex-row items-start justify-between">
                            {/* Supplier Info */}
                            <View className="flex-1">
                              <View className="flex-row items-center justify-between mb-2">
                                <View className="flex-row items-center">
                                  <Building size={16} color="#4B5563" />
                                  <Text className="font-semibold text-gray-900 ml-2">
                                    {supplier.name}
                                  </Text>
                                </View>
                                <View className="flex-row items-center">
                                  <View className={`px-2 py-1 rounded-full border ${getSupplierStatusColor(supplier.status)}`}>
                                    <Text className="text-xs font-medium capitalize">
                                      {supplier.status}
                                    </Text>
                                  </View>
                                  {supplier.status === "preferred" && (
                                    <Star size={14} color="#8B5CF6" className="ml-2" />
                                  )}
                                </View>
                              </View>

                              {/* Supplier Details */}
                              <View className="space-y-2">
                                <View className="flex-row items-center">
                                  <DollarSign size={12} color="#6B7280" />
                                  <Text className="text-gray-700 text-sm ml-2">
                                    Unit Price: ${supplier.price.toFixed(2)}
                                  </Text>
                                  <Text className="text-gray-400 mx-2">•</Text>
                                  <Text className="text-gray-700 text-sm">
                                    Min Order: {supplier.minOrder}
                                  </Text>
                                </View>
                                
                                <View className="flex-row items-center">
                                  <Truck size={12} color="#6B7280" />
                                  <Text className="text-gray-700 text-sm ml-2">
                                    Delivery: {supplier.deliveryTime}
                                  </Text>
                                  <Text className="text-gray-400 mx-2">•</Text>
                                  <Text className="text-gray-700 text-sm">
                                    Reliability: {supplier.reliability}%
                                  </Text>
                                </View>

                                <View className="flex-row items-center">
                                  <Star size={12} color="#F59E0B" />
                                  <Text className="text-gray-700 text-sm ml-2">
                                    Rating: {supplier.rating}/5.0
                                  </Text>
                                  <Text className="text-gray-400 mx-2">•</Text>
                                  <MapPin size={12} color="#6B7280" />
                                  <Text className="text-gray-700 text-sm ml-1">{supplier.location}</Text>
                                </View>
                              </View>

                              {/* Order Controls */}
                              {selectedSupplier === supplier.id && (
                                <View className="mt-4 pt-4 border-t border-gray-200">
                                  <View className="flex-row items-center justify-between mb-3">
                                    <Text className="text-gray-800 font-medium">Order Quantity</Text>
                                    <Text className="text-gray-500 text-sm">
                                      Min: {supplier.minOrder} units
                                    </Text>
                                  </View>
                                  
                                  <View className="flex-row items-center space-x-4">
                                    <View className="flex-1 bg-white border border-gray-300 rounded-lg p-3">
                                      <View className="flex-row items-center justify-between">
                                        <Text className="text-gray-700">Quantity</Text>
                                        <View className="flex-row items-center space-x-3">
                                          <TouchableOpacity 
                                            onPress={() => {
                                              const key = `${product.id}-${supplier.id}`;
                                              const current = orderQuantities[key] || 0;
                                              updateOrderQuantity(product.id, supplier.id, current - 10);
                                            }}
                                            className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                                          >
                                            <Text className="text-gray-600 font-bold">-</Text>
                                          </TouchableOpacity>
                                          
                                          <Text className="text-gray-900 font-bold text-lg">
                                            {orderQuantities[`${product.id}-${supplier.id}`] || 0}
                                          </Text>
                                          
                                          <TouchableOpacity 
                                            onPress={() => {
                                              const key = `${product.id}-${supplier.id}`;
                                              const current = orderQuantities[key] || 0;
                                              updateOrderQuantity(product.id, supplier.id, current + 10);
                                            }}
                                            className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                                          >
                                            <Text className="text-gray-600 font-bold">+</Text>
                                          </TouchableOpacity>
                                        </View>
                                      </View>
                                    </View>
                                    
                                    <View className="flex-1 bg-white border border-gray-300 rounded-lg p-3">
                                      <View className="flex-row items-center justify-between">
                                        <Text className="text-gray-700">Total Cost</Text>
                                        <Text className="text-green-600 font-bold">
                                          ${calculateSupplierCost(product.id, supplier.id).toFixed(2)}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>

                                  {/* Contact Actions */}
                                  <View className="flex-row space-x-2 mt-4">
                                    <TouchableOpacity className="flex-1 bg-blue-50 py-2 rounded-lg flex-row items-center justify-center">
                                      <Phone size={16} color="#3B82F6" />
                                      <Text className="text-blue-700 font-medium ml-2">Call</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-1 bg-green-50 py-2 rounded-lg flex-row items-center justify-center">
                                      <Mail size={16} color="#10B981" />
                                      <Text className="text-green-700 font-medium ml-2">Email</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-1 bg-purple-50 py-2 rounded-lg flex-row items-center justify-center">
                                      <MessageSquare size={16} color="#8B5CF6" />
                                      <Text className="text-purple-700 font-medium ml-2">Message</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              )}
                            </View>
                            
                            {selectedSupplier !== supplier.id && (
                              <ChevronRight size={20} color="#9CA3AF" />
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Order Summary Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="px-6 py-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-900 font-bold">Order Summary</Text>
            <Text className="text-2xl font-bold text-green-600">
              ${totalOrderCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </Text>
          </View>
          
          <View className="flex-row space-x-2">
            <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center">
              <RefreshCw size={18} color="#6B7280" />
              <Text className="text-gray-700 font-medium ml-2">Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-blue-500 py-3 rounded-xl flex-row items-center justify-center">
              <ShoppingBag size={18} color="white" />
              <Text className="text-white font-bold ml-2">Place Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}