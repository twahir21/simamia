import { CameraView, useCameraPermissions } from "expo-camera";
import { useAudioPlayer } from "expo-audio";
import { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";

export default function ScanScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Preload beep sound via expo-audio hook
  const beepPlayer = useAudioPlayer(require("../../../../assets/sounds/beep.wav"));

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white mb-4">Camera permission required</Text>
        <Text className="text-blue-400" onPress={requestPermission}>
          Grant Permission
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}        // more reliable than className for preview
        facing="back"               // ensure rear camera to avoid black preview
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "code128", "upc_a", "upc_e"],
        }}
        onBarcodeScanned={({ data }) => {
          if (scanned) return;
          setScanned(true);

          // Replay beep from start
          beepPlayer.seekTo(0);
          beepPlayer.play();

          console.log("SCANNED:", data);

          // Optional: auto-reset after a short delay for continuous scanning
        //   setTimeout(() => setScanned(false), 4000);
        }}
      />

      {/* Scan box overlay */}
      <View className="absolute inset-0 items-center justify-center">
        {/* <View className="w-64 h-64 border-2 border-white rounded-xl" /> */}
              {/* Clear scan window */}
      <View className="w-64 h-64">
        {/* Top left */}
        <View className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-xl" />
        {/* Top right */}
        <View className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-xl" />
        {/* Bottom left */}
        <View className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-xl" />
        {/* Bottom right */}
        <View className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-xl" />
      </View>
        <Text className="text-white mt-3 opacity-70">Align barcode in box</Text>

        {scanned && (
          <TouchableOpacity
            className="mt-4 px-4 py-2 bg-blue-500 rounded"
            onPress={() => setScanned(false)}
          >
            <Text className="text-white">Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
