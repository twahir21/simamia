import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { 
  TrendingDown,
  DollarSign,
  CreditCard,
  Receipt,
  Building,
  Users,
  Package,
  Calendar,
  Filter,
  Search,
  Plus,
  MoreVertical,
  Download,
  Upload,
  Edit2,
  Trash2,
  Eye,
  BarChart3,
  PieChart,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Tag,
  Percent,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Smartphone,
  Home,
  Coffee,
  Car,
  ShoppingBag,
  Wifi,
  Zap,
  Shield,
  Briefcase,
  Gift,
  Heart
} from "lucide-react-native";
import { useState } from "react";

const EXPENSES = [
  {
    id: "1",
    category: "Office Supplies",
    description: "Printer paper, pens, stationery",
    amount: 245.50,
    date: "2024-12-15",
    payment: "Credit Card",
    vendor: "Office Depot",
    status: "approved",
    receipt: true,
    color: "#3B82F6",
    icon: Package,
    budget: 300,
    recurring: false
  },
  {
    id: "2",
    category: "Software Subscriptions",
    description: "Adobe Creative Cloud monthly",
    amount: 79.99,
    date: "2024-12-14",
    payment: "Bank Transfer",
    vendor: "Adobe Inc.",
    status: "approved",
    receipt: true,
    color: "#8B5CF6",
    icon: Smartphone,
    budget: 100,
    recurring: true
  },
  {
    id: "3",
    category: "Marketing",
    description: "Facebook Ads Campaign",
    amount: 1200.00,
    date: "2024-12-13",
    payment: "Credit Card",
    vendor: "Meta Platforms",
    status: "pending",
    receipt: false,
    color: "#EC4899",
    icon: TrendingUp,
    budget: 1500,
    recurring: false
  },
  {
    id: "4",
    category: "Utilities",
    description: "Monthly electricity bill",
    amount: 345.67,
    date: "2024-12-12",
    payment: "Bank Transfer",
    vendor: "City Power Co.",
    status: "approved",
    receipt: true,
    color: "#06B6D4",
    icon: Zap,
    budget: 400,
    recurring: true
  },
  {
    id: "5",
    category: "Employee Benefits",
    description: "Health insurance premium",
    amount: 2450.00,
    date: "2024-12-10",
    payment: "Direct Debit",
    vendor: "BlueCross Insurance",
    status: "approved",
    receipt: true,
    color: "#10B981",
    icon: Heart,
    budget: 2500,
    recurring: true
  },
  {
    id: "6",
    category: "Travel & Entertainment",
    description: "Client dinner meeting",
    amount: 189.75,
    date: "2024-12-08",
    payment: "Credit Card",
    vendor: "The Prime Steakhouse",
    status: "rejected",
    receipt: true,
    color: "#F59E0B",
    icon: Coffee,
    budget: 200,
    recurring: false
  },
  {
    id: "7",
    category: "Equipment",
    description: "New office chairs",
    amount: 850.00,
    date: "2024-12-05",
    payment: "Bank Transfer",
    vendor: "IKEA Business",
    status: "approved",
    receipt: true,
    color: "#84CC16",
    icon: Home,
    budget: 1000,
    recurring: false
  },
  {
    id: "8",
    category: "Internet & Phone",
    description: "Monthly internet service",
    amount: 129.99,
    date: "2024-12-01",
    payment: "Credit Card",
    vendor: "Verizon Business",
    status: "approved",
    receipt: true,
    color: "#EF4444",
    icon: Wifi,
    budget: 150,
    recurring: true
  },
];

const EXPENSE_CATEGORIES = [
  { name: "All", count: 8, color: "#6B7280", icon: DollarSign },
  { name: "Marketing", count: 1, color: "#EC4899", icon: TrendingUp },
  { name: "Software", count: 1, color: "#8B5CF6", icon: Smartphone },
  { name: "Office", count: 2, color: "#3B82F6", icon: Package },
  { name: "Utilities", count: 2, color: "#06B6D4", icon: Zap },
  { name: "Benefits", count: 1, color: "#10B981", icon: Heart },
  { name: "Travel", count: 1, color: "#F59E0B", icon: Coffee },
];

const MONTHLY_STATS = {
  total: EXPENSES.reduce((sum, exp) => sum + exp.amount, 0),
  approved: EXPENSES.filter(e => e.status === "approved").reduce((sum, exp) => sum + exp.amount, 0),
  pending: EXPENSES.filter(e => e.status === "pending").reduce((sum, exp) => sum + exp.amount, 0),
  recurring: EXPENSES.filter(e => e.recurring).reduce((sum, exp) => sum + exp.amount, 0),
  budget: EXPENSES.reduce((sum, exp) => sum + exp.budget, 0),
  remaining: 0,
};

MONTHLY_STATS.remaining = MONTHLY_STATS.budget - MONTHLY_STATS.total;

const RECURRING_EXPENSES = [
  { name: "Software Subscriptions", amount: 79.99, next: "Jan 14, 2025", icon: Smartphone },
  { name: "Utilities", amount: 345.67, next: "Jan 12, 2025", icon: Zap },
  { name: "Employee Benefits", amount: 2450.00, next: "Jan 10, 2025", icon: Heart },
  { name: "Internet Service", amount: 129.99, next: "Jan 1, 2025", icon: Wifi },
];

export default function ExpensesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("month");
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);

  const statuses = [
    { id: "all", label: "All", count: EXPENSES.length },
    { id: "approved", label: "Approved", count: EXPENSES.filter(e => e.status === "approved").length },
    { id: "pending", label: "Pending", count: EXPENSES.filter(e => e.status === "pending").length },
    { id: "rejected", label: "Rejected", count: EXPENSES.filter(e => e.status === "rejected").length },
  ];

  const filteredExpenses = EXPENSES.filter(expense => {
    const matchesCategory = selectedCategory === "All" || expense.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || expense.status === selectedStatus;
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} color="#10B981" />;
      case "pending":
        return <Clock size={16} color="#F59E0B" />;
      case "rejected":
        return <XCircle size={16} color="#EF4444" />;
      default:
        return <AlertCircle size={16} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  };

  const calculateBudgetUsage = (amount: number, budget: number) => {
    return Math.min(100, (amount / budget) * 100);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-14 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-3xl font-bold text-gray-900">Expenses</Text>
            <Text className="text-gray-500 mt-1">Track and manage business expenses</Text>
          </View>
          <TouchableOpacity className="bg-blue-500 px-4 py-3 rounded-xl flex-row items-center">
            <Plus size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Add Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search expenses by description, vendor, or category..."
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
              { id: "week", label: "This Week" },
              { id: "month", label: "This Month", active: true },
              { id: "quarter", label: "This Quarter" },
              { id: "year", label: "This Year" },
              { id: "custom", label: "Custom Range" },
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

      {/* Monthly Summary */}
      <View className="px-6 pt-4">
        <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-5">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-lg font-bold">December 2024 Summary</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-blue-200 text-sm">View Details</Text>
              <ChevronRight size={16} color="#A5B4FC" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-4">
              <Text className="text-blue-200 text-sm mb-1">Total Expenses</Text>
              <Text className="text-white text-2xl font-bold">{formatCurrency(MONTHLY_STATS.total)}</Text>
              <View className="flex-row items-center mt-1">
                <TrendingDown size={14} color="#FCA5A5" />
                <Text className="text-red-200 text-xs font-medium ml-1">-12% from last month</Text>
              </View>
            </View>
            
            <View className="w-[48%] mb-4">
              <Text className="text-blue-200 text-sm mb-1">Budget Remaining</Text>
              <Text className="text-white text-2xl font-bold">{formatCurrency(MONTHLY_STATS.remaining)}</Text>
              <View className="flex-row items-center mt-1">
                <Percent size={14} color="#86EFAC" />
                <Text className="text-green-200 text-xs font-medium ml-1">
                  {((MONTHLY_STATS.remaining / MONTHLY_STATS.budget) * 100).toFixed(1)}% of budget left
                </Text>
              </View>
            </View>
            
            <View className="w-[48%]">
              <Text className="text-blue-200 text-sm mb-1">Recurring Expenses</Text>
              <Text className="text-white text-2xl font-bold">{formatCurrency(MONTHLY_STATS.recurring)}</Text>
              <Text className="text-blue-200 text-xs mt-1">Monthly subscription costs</Text>
            </View>
            
            <View className="w-[48%]">
              <Text className="text-blue-200 text-sm mb-1">Pending Approval</Text>
              <Text className="text-white text-2xl font-bold">{formatCurrency(MONTHLY_STATS.pending)}</Text>
              <Text className="text-yellow-200 text-xs mt-1">Requires review</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 py-4">
        <View className="flex-row space-x-3">
          {EXPENSE_CATEGORIES.map((category) => {
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
                  <Text className="text-gray-500 text-sm">{category.count} items</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Status Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 pb-4">
        <View className="flex-row space-x-2">
          {statuses.map((status) => (
            <TouchableOpacity
              key={status.id}
              onPress={() => setSelectedStatus(status.id)}
              className={`px-4 py-2 rounded-full flex-row items-center ${
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
      <ScrollView className="flex-1 px-6 pb-24" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Expense Transactions ({filteredExpenses.length})
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

          {/* Expenses List */}
          <View className="space-y-3">
            {filteredExpenses.map((expense) => {
              const Icon = expense.icon;
              const budgetUsage = calculateBudgetUsage(expense.amount, expense.budget);
              
              return (
                <TouchableOpacity
                  key={expense.id}
                  onPress={() => setSelectedExpense(
                    selectedExpense === expense.id ? null : expense.id
                  )}
                  className={`bg-white rounded-2xl p-4 border ${
                    selectedExpense === expense.id 
                      ? 'border-blue-300 shadow-sm' 
                      : 'border-gray-200'
                  }`}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-start flex-1">
                      <View 
                        className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                        style={{ backgroundColor: expense.color + '20' }}
                      >
                        <Icon size={24} color={expense.color} />
                      </View>
                      
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="font-bold text-gray-900">{expense.category}</Text>
                          <Text className="text-xl font-bold text-gray-900">
                            {formatCurrency(expense.amount)}
                          </Text>
                        </View>
                        
                        <Text className="text-gray-600 text-sm mb-2">{expense.description}</Text>
                        
                        <View className="flex-row items-center space-x-3 mb-3">
                          <View className="flex-row items-center">
                            <Building size={12} color="#6B7280" />
                            <Text className="text-gray-500 text-xs ml-1">{expense.vendor}</Text>
                          </View>
                          <View className="flex-row items-center">
                            <Calendar size={12} color="#6B7280" />
                            <Text className="text-gray-500 text-xs ml-1">{expense.date}</Text>
                          </View>
                          <View className="flex-row items-center">
                            <CreditCard size={12} color="#6B7280" />
                            <Text className="text-gray-500 text-xs ml-1">{expense.payment}</Text>
                          </View>
                        </View>
                        
                        <View className="flex-row items-center justify-between">
                          <View className={`px-3 py-1 rounded-full border ${getStatusColor(expense.status)} flex-row items-center`}>
                            {getStatusIcon(expense.status)}
                            <Text className="text-xs font-medium ml-1 capitalize">
                              {expense.status}
                            </Text>
                          </View>
                          
                          <View className="flex-row items-center">
                            {expense.receipt && (
                              <View className="flex-row items-center mr-3">
                                <Receipt size={12} color="#10B981" />
                                <Text className="text-green-600 text-xs ml-1">Receipt</Text>
                              </View>
                            )}
                            {expense.recurring && (
                              <View className="flex-row items-center">
                                <ArrowUpRight size={12} color="#8B5CF6" />
                                <Text className="text-purple-600 text-xs ml-1">Recurring</Text>
                              </View>
                            )}
                          </View>
                        </View>
                        
                        {/* Budget Progress */}
                        <View className="mt-3">
                          <View className="flex-row justify-between mb-1">
                            <Text className="text-gray-700 text-xs">Budget Usage</Text>
                            <Text className="text-gray-700 text-xs font-medium">
                              {formatCurrency(expense.amount)} / {formatCurrency(expense.budget)}
                            </Text>
                          </View>
                          <View className="w-full bg-gray-200 rounded-full h-1.5">
                            <View 
                              className="h-1.5 rounded-full"
                              style={{ 
                                width: `${budgetUsage}%`,
                                backgroundColor: 
                                  budgetUsage > 90 ? "#EF4444" :
                                  budgetUsage > 75 ? "#F59E0B" : "#10B981"
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                    
                    <ChevronRight 
                      size={20} 
                      color="#9CA3AF" 
                      className={`transform mt-2 ${
                        selectedExpense === expense.id ? 'rotate-90' : ''
                      }`}
                    />
                  </View>

                  {/* Expanded Details */}
                  {selectedExpense === expense.id && (
                    <View className="mt-4 pt-4 border-t border-gray-100">
                      <View className="flex-row justify-between mb-4">
                        <Text className="text-gray-800 font-medium">Expense Details</Text>
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
                        <View className="grid grid-cols-2 gap-3">
                          <View>
                            <Text className="text-gray-600 text-sm mb-1">Vendor</Text>
                            <Text className="text-gray-900 font-medium">{expense.vendor}</Text>
                          </View>
                          <View>
                            <Text className="text-gray-600 text-sm mb-1">Payment Method</Text>
                            <Text className="text-gray-900 font-medium">{expense.payment}</Text>
                          </View>
                          <View>
                            <Text className="text-gray-600 text-sm mb-1">Date</Text>
                            <Text className="text-gray-900 font-medium">{expense.date}</Text>
                          </View>
                          <View>
                            <Text className="text-gray-600 text-sm mb-1">Recurring</Text>
                            <Text className="text-gray-900 font-medium">
                              {expense.recurring ? "Yes" : "No"}
                            </Text>
                          </View>
                        </View>
                        
                        <View className="mt-4">
                          <Text className="text-gray-600 text-sm mb-2">Notes</Text>
                          <Text className="text-gray-800">
                            {expense.description} - Budget allocation used: {budgetUsage.toFixed(1)}%
                          </Text>
                        </View>
                      </View>
                      
                      <View className="flex-row space-x-2">
                        <TouchableOpacity className="flex-1 bg-blue-50 py-3 rounded-lg flex-row items-center justify-center">
                          <Receipt size={18} color="#3B82F6" />
                          <Text className="text-blue-700 font-medium ml-2">View Receipt</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-green-50 py-3 rounded-lg flex-row items-center justify-center">
                          <Download size={18} color="#10B981" />
                          <Text className="text-green-700 font-medium ml-2">Export</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recurring Expenses */}
        <View className="mb-20">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Recurring Expenses</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-blue-600 font-medium">Manage Subscriptions</Text>
              <ChevronRight size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          
          <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {RECURRING_EXPENSES.map((expense, index) => {
              const Icon = expense.icon;
              return (
                <View 
                  key={index}
                  className={`p-4 flex-row items-center justify-between ${
                    index < RECURRING_EXPENSES.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-purple-50 rounded-lg items-center justify-center mr-3">
                      <Icon size={20} color="#8B5CF6" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900">{expense.name}</Text>
                      <Text className="text-gray-500 text-sm mt-1">Next charge: {expense.next}</Text>
                    </View>
                  </View>
                  
                  <View className="items-end">
                    <Text className="font-bold text-gray-900">{formatCurrency(expense.amount)}</Text>
                    <Text className="text-purple-600 text-xs font-medium mt-1">Monthly</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Quick Actions Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="px-6 py-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <TrendingDown size={20} color="#EF4444" />
              <Text className="text-gray-900 font-bold ml-2">
                {formatCurrency(MONTHLY_STATS.total)}
              </Text>
              <Text className="text-gray-500 ml-2">Total Expenses</Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="flex-row items-center mr-4">
                <CheckCircle size={14} color="#10B981" />
                <Text className="text-green-600 text-sm ml-1">
                  {EXPENSES.filter(e => e.status === "approved").length} approved
                </Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={14} color="#F59E0B" />
                <Text className="text-yellow-600 text-sm ml-1">
                  {EXPENSES.filter(e => e.status === "pending").length} pending
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
              <Text className="text-white font-bold ml-2">New Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}