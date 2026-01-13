import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export function BottomActions () {
    return <>
      {/* Bottom Action Bar */}
      <View className="bg-white border-t border-gray-200 p-3">
        <View className="flex-row justify-between">
          <TouchableOpacity className="flex-row items-center p-2">
            <Ionicons name="download-outline" size={20} color="#4B5563" />
            <Text className="text-gray-700 ml-2">Export</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center p-2"
          >
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
    </>
}