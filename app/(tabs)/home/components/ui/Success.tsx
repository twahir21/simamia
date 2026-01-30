import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  message: string;
  duration?: number;
  onClose: () => void;
  onReceipt?: () => void;
};

export default function SuccessToast({
  visible,
  message,
  duration = 180000,
  onClose,
  onReceipt,
}: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    if (!visible) return;

    // slide in
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    // progress bar
    Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onClose, progress, translateY]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{ transform: [{ translateY }] }}
      className="absolute top-3 left-3 right-3 z-50 bg-green-600 rounded-xl shadow-lg overflow-hidden"
    >
      <View className="px-4 py-3 flex-row items-center gap-3">
        <Feather name="check-circle" size={18} color="white" />

        <Text className="text-white font-semibold flex-1" numberOfLines={2}>
          {message}
        </Text>

        {onReceipt && (
          <Pressable
            onPress={onReceipt}
            className="px-3 py-1 rounded-lg bg-white/20"
          >
            <Text className="text-white font-bold text-xs">Receipt</Text>
          </Pressable>
        )}

        <Pressable onPress={onClose}>
          <Feather name="x" size={18} color="white" />
        </Pressable>
      </View>

      {/* Progress bar */}
      <Animated.View
        className="h-1 bg-white/60"
        style={{
          width: progress.interpolate({
            inputRange: [0, 1],
            outputRange: ["0%", "100%"],
          }),
        }}
      />
    </Animated.View>
  );
}
