import { ActionItem } from "@/types/globals.types";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  actions: ActionItem[];
};

export default function ActionBar ({ actions }: Props) {
  return (
    <View className="bg-white border-t border-gray-200 p-3">
      <View className="flex-row justify-between">
        {actions.map(action => (
          <TouchableOpacity
            key={action.key}
            onPress={action.onPress}
            disabled={action.disabled}
            className={`flex-row items-center p-2 ${
              action.disabled ? "opacity-40" : ""
            }`}
          >
            {action.icon}
            <Text className="text-gray-700 ml-2">
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

