import { CameraView, useCameraPermissions } from "expo-camera";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Load beep sound once
  useEffect(() => {
    (async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../../../assets/sounds/beep.wav"), // add your beep file
        { volume: 1 }
      );
      soundRef.current = sound;
    })();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);

    // Feedback
    await soundRef.current?.replayAsync();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Business logic
    console.log("QR DATA:", data);
  };

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-6">
        <Text className="text-white text-center mb-4">
          Camera permission is required to scan QR codes
        </Text>

        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        className="flex-1"
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleScan}
      />

      {/* Overlay */}
      <View className="absolute inset-0 items-center justify-center">
        <View className="w-64 h-64 border-2 border-white rounded-xl" />
        <Text className="text-white mt-4 opacity-80">
          Align QR code inside the box
        </Text>
      </View>

      {scanned && (
        <TouchableOpacity
          onPress={() => setScanned(false)}
          className="absolute bottom-10 self-center bg-white px-6 py-3 rounded-full"
        >
          <Text className="text-black font-semibold">Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
