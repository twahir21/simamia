import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { 
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  Printer,
  Share2,
  Eye,
  MoreVertical,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Clock,
  RefreshCw,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  FileText,
  Activity,
  Target
} from "lucide-react-native";
import { useState } from "react";

const { width } = Dimensions.get('window');

const REPORTS = [
  {
    id: "1",
    title: "Sales Report",
    description: "Monthly sales performance and trends",
    icon: BarChart3,
    color: "#3B82F6",
    value: "$45,820",
    change: "+12.5%",
    trend: "up",
    lastUpdated: "Today, 9:30 AM",
    frequency: "Daily",
    category: "Revenue"
  },
  {
    id: "2",
    title: "Revenue Analysis",
    description: "Detailed revenue breakdown by category",
    icon: DollarSign,
    color: "#10B981",
    value: "$28,450",
    change: "+8.2%",
    trend: "up",
    lastUpdated: "Today, 8:15 AM",
    frequency: "Weekly",
    category: "Revenue"
  },
  {
    id: "3",
    title: "Customer Analytics",
    description: "Customer demographics and behavior",
    icon: Users,
    color: "#8B5CF6",
    value: "1,248",
    change: "+5.3%",
    trend: "up",
    lastUpdated: "Yesterday, 4:20 PM",
    frequency: "Monthly",
    category: "Customers"
  },
  {
    id: "4",
    title: "Inventory Report",
    description: "Stock levels and turnover rates",
    icon: Package,
    color: "#F59E0B",
    value: "845 Items",
    change: "-2.1%",
    trend: "down",
    lastUpdated: "2 days ago",
    frequency: "Weekly",
    category: "Inventory"
  },
  {
    id: "5",
    title: "Order Summary",
    description: "Daily orders and fulfillment status",
    icon: ShoppingBag,
    color: "#EC4899",
    value: "324 Orders",
    change: "+15.7%",
    trend: "up",
    lastUpdated: "Today, 10:00 AM",
    frequency: "Daily",
    category: "Orders"
  },
  {
    id: "6",
    title: "Performance Dashboard",
    description: "Key performance indicators overview",
    icon: Activity,
    color: "#EF4444",
    value: "94.2%",
    change: "+3.8%",
    trend: "up",
    lastUpdated: "Today, 11:45 AM",
    frequency: "Real-time",
    category: "Performance"
  },
  {
    id: "7",
    title: "Expense Report",
    description: "Monthly expenses and cost analysis",
    icon: TrendingDown,
    color: "#06B6D4",
    value: "$8,240",
    change: "-4.2%",
    trend: "down",
    lastUpdated: "3 days ago",
    frequency: "Monthly",
    category: "Finance"
  },
  {
    id: "8",
    title: "Profit & Loss",
    description: "Quarterly profit and loss statement",
    icon: Target,
    color: "#84CC16",
    value: "$37,580",
    change: "+18.9%",
    trend: "up",
    lastUpdated: "Last week",
    frequency: "Quarterly",
    category: "Finance"
  }
];

const RECENT_REPORTS = [
  {
    id: "r1",
    title: "Q4 Sales Summary",
    date: "Dec 15, 2024",
    type: "PDF",
    size: "2.4 MB",
    status: "completed",
    generatedBy: "John Smith"
  },
  {
    id: "r2",
    title: "Annual Revenue Report",
    date: "Dec 10, 2024",
    type: "Excel",
    size: "5.7 MB",
    status: "completed",
    generatedBy: "System Auto"
  },
  {
    id: "r3",
    title: "Customer Retention",
    date: "Dec 8, 2024",
    type: "PDF",
    size: "1.8 MB",
    status: "completed",
    generatedBy: "Sarah Wilson"
  },
  {
    id: "r4",
    title: "Inventory Analysis",
    date: "Dec 5, 2024",
    type: "CSV",
    size: "3.2 MB",
    status: "processing",
    generatedBy: "System Auto"
  },
  {
    id: "r5",
    title: "Marketing ROI",
    date: "Dec 1, 2024",
    type: "PDF",
    size: "4.1 MB",
    status: "completed",
    generatedBy: "David Lee"
  }
];

const QUICK_METRICS = [
  { label: "Total Sales Today", value: "$12,450", change: "+24%" },
  { label: "New Customers", value: "48", change: "+12%" },
  { label: "Orders Processed", value: "156", change: "+8%" },
  { label: "Inventory Alert", value: "12 Items", change: "-3%" },
];

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [timeRange, setTimeRange] = useState("month");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const categories = ["all", "Revenue", "Customers", "Inventory", "Orders", "Finance", "Performance"];
  
  const filteredReports = selectedCategory === "all" 
    ? REPORTS 
    : REPORTS.filter(report => report.category === selectedCategory);

  const getTrendIcon = (trend: string) => {
    if (trend === "up") {
      return <TrendingUp size={16} color="#10B981" />;
    }
    return <TrendingDown size={16} color="#EF4444" />;
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-14 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-3xl font-bold text-gray-900">Reports & Analytics</Text>
            <Text className="text-gray-500 mt-1">Insights and performance metrics</Text>
          </View>
          <View className="flex-row space-x-2">
            <TouchableOpacity className="bg-blue-500 p-3 rounded-xl">
              <RefreshCw size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 p-3 rounded-xl">
              <Share2 size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Range Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row space-x-2">
            {[
              { id: "today", label: "Today" },
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

      {/* Quick Metrics */}
      <View className="px-6 pt-4">
        <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-lg font-bold">Quick Overview</Text>
            <TouchableOpacity>
              <Eye size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row flex-wrap justify-between">
            {QUICK_METRICS.map((metric, index) => (
              <View key={index} className="w-[48%] mb-4">
                <Text className="text-blue-100 text-sm mb-1">{metric.label}</Text>
                <View className="flex-row items-center">
                  <Text className="text-white text-xl font-bold mr-2">{metric.value}</Text>
                  <View className={`flex-row items-center px-2 py-1 rounded-full ${
                    metric.change.startsWith('+') 
                      ? 'bg-green-500/30' 
                      : 'bg-red-500/30'
                  }`}>
                    <Text className={`text-xs font-bold ${
                      metric.change.startsWith('+') 
                        ? 'text-green-200' 
                        : 'text-red-200'
                    }`}>
                      {metric.change}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 py-4">
        <View className="flex-row space-x-2">
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full flex-row items-center ${
                selectedCategory === category
                  ? "bg-blue-100 border border-blue-300"
                  : "bg-white border border-gray-200"
              }`}
            >
              {selectedCategory === category && (
                <Filter size={14} color="#3B82F6" className="mr-2" />
              )}
              <Text
                className={`font-medium ${
                  selectedCategory === category
                    ? "text-blue-700"
                    : "text-gray-600"
                }`}
              >
                {category === "all" ? "All Reports" : category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Reports Grid */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Available Reports ({filteredReports.length})
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Info size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-1 text-sm">Guide</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {filteredReports.map((report) => {
              const Icon = report.icon;
              return (
                <TouchableOpacity
                  key={report.id}
                  onPress={() => setSelectedReport(
                    selectedReport === report.id ? null : report.id
                  )}
                  className="w-[48%] mb-4"
                >
                  <View className={`bg-white rounded-2xl p-4 border ${
                    selectedReport === report.id 
                      ? 'border-blue-300 shadow-sm' 
                      : 'border-gray-200'
                  }`}>
                    {/* Report Header */}
                    <View className="flex-row items-center justify-between mb-3">
                      <View 
                        className="w-12 h-12 rounded-xl items-center justify-center"
                        style={{ backgroundColor: report.color + '20' }}
                      >
                        <Icon size={24} color={report.color} />
                      </View>
                      <TouchableOpacity>
                        <MoreVertical size={20} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>

                    {/* Report Info */}
                    <Text className="font-bold text-gray-900 mb-1">{report.title}</Text>
                    <Text className="text-gray-500 text-xs mb-3">{report.description}</Text>

                    {/* Metrics */}
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-2xl font-bold text-gray-900">
                        {report.value}
                      </Text>
                      <View className="flex-row items-center">
                        {getTrendIcon(report.trend)}
                        <Text className={`ml-1 text-sm font-bold ${
                          report.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          {report.change}
                        </Text>
                      </View>
                    </View>

                    {/* Footer */}
                    <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                      <View className="flex-row items-center">
                        <Clock size={12} color="#9CA3AF" />
                        <Text className="text-gray-500 text-xs ml-1">{report.lastUpdated}</Text>
                      </View>
                      <View className="px-2 py-1 bg-gray-100 rounded">
                        <Text className="text-gray-600 text-xs">{report.frequency}</Text>
                      </View>
                    </View>

                    {/* Expanded Actions */}
                    {selectedReport === report.id && (
                      <View className="mt-4 pt-4 border-t border-gray-100">
                        <View className="flex-row space-x-2">
                          <TouchableOpacity className="flex-1 bg-blue-50 py-2 rounded-lg flex-row items-center justify-center">
                            <Eye size={16} color="#3B82F6" />
                            <Text className="text-blue-700 font-medium text-sm ml-2">View</Text>
                          </TouchableOpacity>
                          <TouchableOpacity className="flex-1 bg-gray-100 py-2 rounded-lg flex-row items-center justify-center">
                            <Download size={16} color="#6B7280" />
                            <Text className="text-gray-700 font-medium text-sm ml-2">Export</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recent Reports */}
        <View className="mb-20">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Recent Reports</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-blue-600 font-medium">View All</Text>
              <ChevronRight size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {RECENT_REPORTS.map((report, index) => (
              <View 
                key={report.id}
                className={`p-4 flex-row items-center justify-between ${
                  index < RECENT_REPORTS.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 bg-blue-50 rounded-lg items-center justify-center mr-3">
                    <FileText size={20} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">{report.title}</Text>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-gray-500 text-xs">{report.date}</Text>
                      <Text className="text-gray-400 mx-2">•</Text>
                      <Text className="text-gray-500 text-xs">{report.type}</Text>
                      <Text className="text-gray-400 mx-2">•</Text>
                      <Text className="text-gray-500 text-xs">{report.size}</Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <View className="flex-row items-center mr-4">
                    {report.status === "completed" ? (
                      <CheckCircle size={14} color="#10B981" />
                    ) : (
                      <AlertCircle size={14} color="#F59E0B" />
                    )}
                    <Text className={`text-xs font-medium ml-1 ${
                      report.status === "completed" ? "text-green-600" : "text-yellow-600"
                    }`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </Text>
                  </View>
                  
                  <View className="flex-row space-x-2">
                    <TouchableOpacity className="p-2">
                      <Download size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2">
                      <Printer size={16} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View className="absolute bottom-6 right-6 flex-row items-center">
        <TouchableOpacity className="bg-white w-12 h-12 rounded-full items-center justify-center shadow-lg mr-3 flex-row">
          <Printer size={20} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-gradient-to-r from-blue-500 to-purple-600 w-14 h-14 rounded-full items-center justify-center shadow-lg flex-row">
          <BarChart3 size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}