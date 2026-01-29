import React from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ErrorModalProps {
  visible: boolean;
  message: string | null;
  onRetry?: () => void;
  onClose?: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  visible,
  message,
  onRetry,
  onClose,
}) => {
  if (!message) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Pressable
        className="flex-1 bg-black/40 items-center justify-center px-6"
        onPress={onClose}
      >
        <View className="bg-white w-full max-w-md rounded-2xl p-6">
          <View className="items-center">
            <MaterialCommunityIcons
              name="database-alert-outline"
              size={56}
              color="#ef4444"
            />

            <Text className="text-gray-800 font-semibold text-lg mt-3">
              Something went wrong
            </Text>

            {/* Error message (sanitized) */}
            <Text
              className="text-gray-600 text-center text-sm mt-2"
              numberOfLines={3}
            >
              {message}
            </Text>

            {/* Guidance */}
            <Text className="text-gray-400 text-center text-xs mt-2">
              Please try again. If the problem continues, restart the app.
            </Text>
          </View>

          {/* Actions */}
          <View className="flex-row mt-6 gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-300 items-center"
            >
              <Text className="text-gray-700 font-medium">Close</Text>
            </TouchableOpacity>

            {onRetry && (
              <TouchableOpacity
                onPress={onRetry}
                className="flex-1 py-3 rounded-xl bg-sky-600 items-center"
                activeOpacity={0.85}
              >
                <Text className="text-white font-semibold">Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ErrorModal;
