import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-sky-800 items-center justify-center px-6">
      {/* Icon */}
      <View className="mb-6 items-center justify-center w-24 h-24 rounded-full bg-neutral-900 border border-neutral-800">
        <Feather name="alert-triangle" size={42} color="#facc15" />
      </View>

      {/* Text */}
      <Text className="text-3xl font-extrabold text-white tracking-tight mb-2">
        404 – Page not found
      </Text>
      <Text className="text-neutral-200 text-center mb-8 leading-6">
        The page you’re looking for doesn’t exist or was moved.
        Don’t worry, this happens even to good routes.
      </Text>

      {/* Actions */}
      <View className="w-full gap-3">
        <Pressable
          onPress={() => router.replace("/home")}
          className="bg-white rounded-2xl py-4 items-center"
        >
          <Text className="text-neutral-900 font-semibold text-base">
            Go Home
          </Text>
        </Pressable>
      </View>

      {/* Footer */}
      <Text className="text-neutral-300 text-xs mt-10">
        If this keeps happening, your routing is broken.
      </Text>
    </View>
  );
}