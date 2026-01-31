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
  duration = 1800,
  onClose,
  onReceipt,
}: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-60)).current;

  
  
  useEffect(() => {
      if (!visible) {
      // Reset animations when toast hides
      progress.setValue(0);
      translateY.setValue(-60);
      return;
    }
    
    // Clear any existing animations
    progress.stopAnimation();
    translateY.stopAnimation();
    
    // Reset to initial values
    progress.setValue(0);
    translateY.setValue(-60);
    

    // Slide in animation
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 12,
    }).start();

    // Progress bar animation
    Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start(() => {
      // Animation completed callback
      if (visible) {
        onClose();
      }
    });

    // Fallback timer in case animation fails
    const timer = setTimeout(() => {
      if (visible) {
        onClose();
      }
    }, duration + 100); // Slightly longer than animation

    return () => {
      clearTimeout(timer);
      // Clean up animations when component unmounts or visibility changes
      progress.stopAnimation();
      translateY.stopAnimation();
    };
  }, [visible, duration, onClose, progress, translateY]);

  // Early return - keep this to prevent rendering when not visible
  if (!visible) return null;

  const stopAutoClose = () => {
    progress.stopAnimation();
    translateY.stopAnimation();
  };

  return (
    <Animated.View
      style={{ transform: [{ translateY }] }}
      className="absolute bottom-2 left-3 right-3 z-50 bg-green-600 rounded-xl shadow-lg overflow-hidden"
    >
      <View className="px-4 py-2.5 flex-row items-center gap-3">
        <Feather name="check-circle" size={18} color="white" />

        <Text className="text-white font-semibold flex-1" numberOfLines={3}>
          {message}
        </Text>

        {onReceipt && (
          <Pressable
            onPress={() => {
              stopAutoClose();     // 🔑 cancel auto close
              onReceipt?.();       // open modal / navigate
              onClose();           // optional: close toast immediately
            }}
            className="px-3 py-2 rounded-lg bg-white/20 active:bg-white/30"
          >
            <Text className="text-white font-bold text-xs">Receipt</Text>
          </Pressable>
        )}

        <Pressable 
          onPress={onClose}
          className="active:opacity-70"
        >
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