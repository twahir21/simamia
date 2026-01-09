import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Types
type DebtStatus = 'pending' | 'partial' | 'overdue' | 'paid';
type DebtPriority = 'high' | 'medium' | 'low';

interface Debt {
  id: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: DebtStatus;
  priority: DebtPriority;
  transactionId: string;
  createdAt: string;
  notes?: string;
}

interface DebtActionsProps {
  debt: Debt;
  onViewDetails: () => void;
  onAddPayment: () => void;
  onSendReminder: () => void;
  onMarkAsPaid: () => void;
}

// Hardcoded Data
const HARDCODED_DEBTS: Debt[] = [
  {
    id: '1',
    customerName: 'John Restaurant',
    customerPhone: '+1 (555) 123-4567',
    amount: 1250.75,
    paidAmount: 500.00,
    remainingAmount: 750.75,
    dueDate: '2024-01-15',
    status: 'partial',
    priority: 'medium',
    transactionId: 'TXN-789012',
    createdAt: '2023-12-20',
    notes: 'Regular customer, always pays on time'
  },
  {
    id: '2',
    customerName: 'Sarah Cafe',
    customerPhone: '+1 (555) 987-6543',
    amount: 850.50,
    paidAmount: 0,
    remainingAmount: 850.50,
    dueDate: '2024-01-10',
    status: 'pending',
    priority: 'high',
    transactionId: 'TXN-345678',
    createdAt: '2023-12-28',
    notes: 'First-time customer, needs follow-up'
  },
  {
    id: '3',
    customerName: 'Mike Grocery Store',
    customerPhone: '+1 (555) 456-7890',
    amount: 3200.00,
    paidAmount: 3200.00,
    remainingAmount: 0,
    dueDate: '2024-01-05',
    status: 'paid',
    priority: 'low',
    transactionId: 'TXN-901234',
    createdAt: '2023-12-15'
  },
  {
    id: '4',
    customerName: 'Lisa Bakery',
    customerPhone: '+1 (555) 234-5678',
    amount: 450.25,
    paidAmount: 0,
    remainingAmount: 450.25,
    dueDate: '2023-12-30',
    status: 'overdue',
    priority: 'high',
    transactionId: 'TXN-567890',
    createdAt: '2023-12-10'
  },
  {
    id: '5',
    customerName: 'David Hotel',
    customerPhone: '+1 (555) 876-5432',
    amount: 2100.00,
    paidAmount: 1500.00,
    remainingAmount: 600.00,
    dueDate: '2024-01-20',
    status: 'partial',
    priority: 'medium',
    transactionId: 'TXN-123456',
    createdAt: '2023-12-25'
  }
];

// Helper Functions
const getStatusColor = (status: DebtStatus): string => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'partial': return 'bg-blue-100 text-blue-800';
    case 'overdue': return 'bg-red-100 text-red-800';
    case 'paid': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityIcon = (priority: DebtPriority) => {
  switch (priority) {
    case 'high':
      return <Ionicons name="warning" size={16} color="#DC2626" />;
    case 'medium':
      return <Ionicons name="alert-circle" size={16} color="#D97706" />;
    case 'low':
      return <Ionicons name="checkmark-circle" size={16} color="#059669" />;
  }
};

const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Status Badge Component
const StatusBadge: React.FC<{ status: DebtStatus }> = ({ status }) => {
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <View className={`px-3 py-1 rounded-full ${getStatusColor(status)}`}>
      <Text className="text-xs font-semibold">{statusText}</Text>
    </View>
  );
};

// Debt Item Component
const DebtItem: React.FC<{ debt: Debt }> = ({ debt }) => {
  const isOverdue = debt.status === 'overdue';
  const isPaid = debt.status === 'paid';
  
  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{debt.customerName}</Text>
          <Text className="text-sm text-gray-600 mt-1">{debt.customerPhone}</Text>
        </View>
        <StatusBadge status={debt.status} />
      </View>
      
      <View className="flex-row items-center mb-1">
        {getPriorityIcon(debt.priority)}
        <Text className="text-xs text-gray-500 ml-1">
          Due {formatDate(debt.dueDate)}
          {isOverdue && ' • Overdue'}
        </Text>
      </View>
      
      <View className="mt-4">
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-600">Total Amount:</Text>
          <Text className="text-sm font-semibold text-gray-900">
            {formatCurrency(debt.amount)}
          </Text>
        </View>
        
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-600">Paid:</Text>
          <Text className="text-sm font-semibold text-green-600">
            {formatCurrency(debt.paidAmount)}
          </Text>
        </View>
        
        <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-100">
          <Text className="text-base font-bold text-gray-900">Remaining:</Text>
          <Text className={`text-lg font-bold ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(debt.remainingAmount)}
          </Text>
        </View>
        
        {debt.notes && (
          <View className="mt-3 pt-3 border-t border-gray-100">
            <Text className="text-sm text-gray-600 italic">{debt.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Debt Actions Component
const DebtActions: React.FC<DebtActionsProps> = ({
  debt,
  onViewDetails,
  onAddPayment,
  onSendReminder,
  onMarkAsPaid,
}) => {
  const isPaid = debt.status === 'paid';
  
  return (
    <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-200">
      <TouchableOpacity
        onPress={onViewDetails}
        className="flex-1 items-center p-2"
      >
        <MaterialIcons name="visibility" size={20} color="#4B5563" />
        <Text className="text-xs text-gray-600 mt-1">Details</Text>
      </TouchableOpacity>
      
      {!isPaid && (
        <>
          <TouchableOpacity
            onPress={onAddPayment}
            className="flex-1 items-center p-2"
          >
            <MaterialIcons name="payment" size={20} color="#059669" />
            <Text className="text-xs text-green-600 mt-1">Payment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onSendReminder}
            className="flex-1 items-center p-2"
          >
            <Ionicons name="notifications" size={20} color="#D97706" />
            <Text className="text-xs text-yellow-600 mt-1">Remind</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onMarkAsPaid}
            className="flex-1 items-center p-2"
          >
            <MaterialIcons name="check-circle" size={20} color="#2563EB" />
            <Text className="text-xs text-blue-600 mt-1">Mark Paid</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// Main Debts Component
const Debts: React.FC = () => {
  const totalDebts = HARDCODED_DEBTS.reduce((sum, debt) => sum + debt.remainingAmount, 0);
  const overdueDebts = HARDCODED_DEBTS
    .filter(debt => debt.status === 'overdue')
    .reduce((sum, debt) => sum + debt.remainingAmount, 0);
  
  const handleViewDetails = (debt: Debt) => {
    console.log('View details:', debt.id);
    // Navigate to debt details screen
  };
  
  const handleAddPayment = (debt: Debt) => {
    console.log('Add payment for:', debt.id);
    // Open payment modal
  };
  
  const handleSendReminder = (debt: Debt) => {
    console.log('Send reminder to:', debt.customerName);
    // Send SMS/Email reminder
  };
  
  const handleMarkAsPaid = (debt: Debt) => {
    console.log('Mark as paid:', debt.id);
    // Update debt status
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Debts Management</Text>
            <Text className="text-gray-600">Track and manage customer debts</Text>
          </View>
          <TouchableOpacity className="bg-blue-500 p-3 rounded-lg">
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Summary Cards */}
        <View className="flex-row justify-between mb-2">
          <View className="bg-blue-50 p-3 rounded-lg flex-1 mr-2">
            <Text className="text-xs text-blue-600 font-medium">Total Outstanding</Text>
            <Text className="text-lg font-bold text-gray-900">
              {formatCurrency(totalDebts)}
            </Text>
          </View>
          <View className="bg-red-50 p-3 rounded-lg flex-1">
            <Text className="text-xs text-red-600 font-medium">Overdue</Text>
            <Text className="text-lg font-bold text-gray-900">
              {formatCurrency(overdueDebts)}
            </Text>
          </View>
        </View>
        
        {/* Stats */}
        <View className="flex-row justify-between mt-2">
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">{HARDCODED_DEBTS.length}</Text>
            <Text className="text-xs text-gray-600">Total Debts</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">
              {HARDCODED_DEBTS.filter(d => d.status === 'paid').length}
            </Text>
            <Text className="text-xs text-gray-600">Paid</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-red-600">
              {HARDCODED_DEBTS.filter(d => d.status === 'overdue').length}
            </Text>
            <Text className="text-xs text-gray-600">Overdue</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-yellow-600">
              {HARDCODED_DEBTS.filter(d => d.status === 'pending').length}
            </Text>
            <Text className="text-xs text-gray-600">Pending</Text>
          </View>
        </View>
      </View>
      
      {/* Filter Bar */}
      <View className="bg-white p-3 border-b border-gray-200">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-2">
            <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full">
              <Text className="text-white font-medium">All</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
              <Text className="text-gray-700">Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
              <Text className="text-gray-700">Overdue</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
              <Text className="text-gray-700">Partial</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
              <Text className="text-gray-700">Paid</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      
      {/* Debts List */}
      <ScrollView className="flex-1 p-4">
        <Text className="text-lg font-bold text-gray-900 mb-3">Active Debts</Text>
        
        {HARDCODED_DEBTS.map((debt) => (
          <View key={debt.id}>
            <DebtItem debt={debt} />
            <DebtActions
              debt={debt}
              onViewDetails={() => handleViewDetails(debt)}
              onAddPayment={() => handleAddPayment(debt)}
              onSendReminder={() => handleSendReminder(debt)}
              onMarkAsPaid={() => handleMarkAsPaid(debt)}
            />
          </View>
        ))}
      </ScrollView>
      
      {/* Bottom Action Bar */}
      <View className="bg-white border-t border-gray-200 p-3">
        <View className="flex-row justify-between">
          <TouchableOpacity className="flex-row items-center p-2">
            <Ionicons name="download-outline" size={20} color="#4B5563" />
            <Text className="text-gray-700 ml-2">Export</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center p-2">
            <Ionicons name="filter" size={20} color="#4B5563" />
            <Text className="text-gray-700 ml-2">Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center p-2">
            <MaterialIcons name="sort" size={20} color="#4B5563" />
            <Text className="text-gray-700 ml-2">Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center p-2">
            <Ionicons name="print-outline" size={20} color="#4B5563" />
            <Text className="text-gray-700 ml-2">Print</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Debts;