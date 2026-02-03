import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react-native';


const FoldableTips = () => {
  const [isExpanded, setIsExpanded] = useState(false); // Suggest 'false' for high-frequency screens

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View className="mt-3 bg-gray-50 rounded-2xl border border-gray-300 overflow-hidden">
      <TouchableOpacity 
        onPress={toggleExpand}
        activeOpacity={0.7}
        className="flex-row items-center justify-between p-4"
      >
        <View className="flex-row items-center">
          <AlertCircle size={18} color={isExpanded ? "#075985" : "#6B7280"} />
          <Text className={`ml-2 font-bold text-sm ${isExpanded ? "text-sky-800" : "text-gray-700"}`}>
            Helpful Tips
          </Text>
        </View>
        
        {isExpanded ? (
          <ChevronUp size={20} color="#075985" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </TouchableOpacity>

      {isExpanded && (
        <View className="px-4 pb-4">
          {/* List Item 1 */}
          <View className="flex-row items-start mb-2.5">
            <View className="h-1.5 w-1.5 rounded-full bg-sky-800 mt-1.5 mr-3" />
            <Text className="flex-1 text-gray-500 text-xs leading-5">
              Hold <Text className="font-bold text-gray-700">+/-</Text> buttons for rapid quantity changes.
            </Text>
          </View>

          {/* List Item 2 */}
          <View className="flex-row items-start">
            <View className="h-1.5 w-1.5 rounded-full bg-sky-800 mt-1.5 mr-3" />
            <Text className="flex-1 text-gray-500 text-xs leading-5">
              <Text className="font-bold text-gray-700">Digital</Text> payments include Lipa kwa Simu, Mobile money, or bank transfers.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default FoldableTips;