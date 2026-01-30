import { CameraView, useCameraPermissions } from "expo-camera";
import { useAudioPlayer } from "expo-audio";
import { useState, useRef } from "react";
import { Text, View, TouchableOpacity, Animated } from "react-native";
import * as Haptics from 'expo-haptics';
import { addToCart, checkIfProductExists } from "@/db/stock.sqlite";
import { useCartStore } from "@/store/cart";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scanResult, setScanResult] = useState<null | "success" | "error">(null);
  const [flashColor, setFlashColor] = useState("rgba(0, 255, 0, 0.3)"); // default green

  // store
  const addItem = useCartStore(state => state.addItem);

  
  // Animation value for the green flash
  const flashAnim = useRef(new Animated.Value(0)).current;
  
  // Preload sounds
  const errorBeep = useAudioPlayer(require("@/assets/sounds/error.wav"));
  const successBeep = useAudioPlayer(require("@/assets/sounds/beep.wav")); // Add success sound

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <View className="mb-8">
          <View className="bg-sky-500 p-6 rounded-full">
            <Text className="text-4xl">📷</Text>
          </View>
        </View>
        
        <Text className="text-2xl font-bold text-center mb-3">
          Camera Access Required
        </Text>
        
        <Text className="text-center text-base leading-6 mb-8 max-w-sm">
          To scan Bar codes and capture numbers, we need access to your camera.
        </Text>
        
        <TouchableOpacity
          onPress={requestPermission}
          activeOpacity={0.8}
          className="bg-sky-500 px-8 py-4 rounded-xl w-full max-w-xs items-center shadow-lg shadow-blue-500/20"
        >
          <Text className="text-white font-semibold text-lg">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Function to trigger green flash animation
  const triggerSuccessFlash = () => {
    // Reset animation value
    flashAnim.setValue(0);
    setFlashColor("rgba(0, 255, 0, 0.3)"); // green
    
    // Animate the flash
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.delay(100),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
    setScanSuccess(true);
  };


  const triggerErrorFlash = () => {
    // Reset animation value
    flashAnim.setValue(0);
    setFlashColor("rgba(255, 0, 0, 0.3)"); // red
    
    // Animate the flash
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.delay(100),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
    setScanSuccess(false);
  };



  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    const productId = checkIfProductExists(data);

    if (productId) {
      // SUCCESS: Product found
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Play success sound
      if (successBeep) {
        successBeep.seekTo(0);
        successBeep.play();
      }
      
      // Trigger green flash
      setScanResult("success")
      triggerSuccessFlash();
      
      const stockFromDb = addToCart(productId);

      if (stockFromDb) {
        addItem({
          stockId: stockFromDb.id,
          name: stockFromDb.productName,
          price: stockFromDb.sellingPrice,
          qty: 1
        })
      }
      
      // Auto-reset for continuous scanning
      setTimeout(() => setScanSuccess(false), 500);
      setTimeout(() => setScanned(false), 1000);
      setTimeout(() => setScanResult(null), 1000)
    } else {
      // ERROR: Product not found
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      setScanResult("error");
      
      // Play error sound
      if (errorBeep) {
        errorBeep.seekTo(0);
        errorBeep.play();
      }
      
      // Red flash for error
      triggerErrorFlash();      
    }
  };

  return (
    <View className="flex-1">
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "code128", "upc_a", "upc_e"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />

        {/* Green Flash Overlay */}
        <Animated.View
          className="absolute inset-0"
          style={{
            backgroundColor: flashColor,
            opacity: flashAnim,
            pointerEvents: 'none',
          }}
        />

        {/* Scan box overlay */}
        <View className="absolute inset-0 items-center justify-center">
          {/* Clear scan window */}
          <View className="w-60 h-60">
            {/* Animated border on success */}
            <Animated.View
              className="absolute inset-0"
              style={{
                borderWidth: scanSuccess ? 4 : 0,
                borderColor: '#4ade80',
                borderRadius: 12,
                opacity: scanSuccess ? 0.8 : 0,
              }}
            />
            
            {/* Corners */}
            <View className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-xl" />
            <View className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-xl" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-xl" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-xl" />
          </View>
          
          <Text className="text-white mt-3 opacity-70 text-xl font-bold">Align barcode/Qrcode in box</Text>

          {/* Success Feedback Message */}
          {scanResult === "success" && (
            <View className="mt-2 px-4 py-2 bg-green-500/90 rounded-lg">
              <Text className="text-white font-semibold">✓ Added to cart</Text>
            </View>
          )}

          {/* Error Feedback Message */}
          {scanResult === "error" && (
            <View className="mt-2 items-center">
              <TouchableOpacity
                className="px-4 py-2 bg-red-500/90 rounded"
                onPress={() => { setScanned(false); setScanResult(null)}}
              >
                <Text className="text-white font-semibold">Product not found, Tap to Scan Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
    </View>
  )
}