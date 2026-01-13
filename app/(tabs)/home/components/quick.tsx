import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Animated, StyleSheet } from "react-native";
import * as Haptics from 'expo-haptics';


function NumberPad({
  onPress,
}: {
  onPress: (v: string, long?: boolean) => void;
}) {
  const keys = [
    "1","2","3",
    "4","5","6",
    "7","8","9",
    ".","0","⌫",
  ];

  return (
    <View className="flex-row flex-wrap mt-1">
      {keys.map((k) => (
        <TouchableOpacity
            key={k}
            onPress={() => onPress(k)}
            onLongPress={k === "⌫" ? () => onPress("⌫", true) : undefined}
            delayLongPress={300}
            className="w-1/3 px-2 py-1"
        >

          <View className="bg-slate-100 rounded-2xl h-10 items-center justify-center border border-gray-300">
            <Text className="text-2xl font-semibold">{k}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}


export default function QuickSaleScreen({ onAdd }: { onAdd: (item: any) => void }) {
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("1");
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState<boolean>(false);

  const handlePad = (v: string, long = false) => {
    if (v === "⌫") {
        setPrice((p) => (long ? "" : p.slice(0, -1)));
        return;
    }
    if (v === "." && price.includes(".")) return;
        setPrice((p) => p + v);
  };


  const submit = () => {
    // const p = parseFloat(price);
    // const q = parseInt(qty || "1", 10);

    // if (!p || p <= 0) return;

    // onAdd({
    //   type: "quick",
    //   price: p,
    //   qty: q,
    //   note: note.trim() || undefined,
    // });

    setFeedback(true);
        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        fadeAnim.setValue(0);
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
            setFeedback(false);
            });
          }, 1500);
        });

    // reset
    setPrice("");
    setQty("1");
    setNote("");
  };

const fadeAnim = useRef(new Animated.Value(0)).current;
  

  return (
    <ScrollView className="flex-1 bg-white px-4 py-2">
        {feedback && (
        <Animated.View 
          style={[styles.feedbackToast, { opacity: fadeAnim }]}
          className="absolute top-4 left-4 right-4 bg-green-50 border border-green-200 rounded-xl p-4 flex-row items-center z-50"
        >
          <Feather name="check-circle" size={24} color="#10b981" />
          <View className="ml-3 flex-1">
            <Text className="text-green-800 font-semibold">Added to cart!</Text>
            <Text className="text-green-700 text-sm">{note ? note.trim() : "Service"}</Text>
          </View>
          <Text className="text-green-600 font-bold">{price}</Text>
        </Animated.View>
      )}
        <View>
        {/* Price Display */}
        <View className="bg-slate-50 rounded-2xl px-4 py-1 border border-slate-400">
            <Text className="text-slate-400 text-sm">Price</Text>
            <Text className="text-3xl font-bold">
             {price ? Intl.NumberFormat("en-US").format(Number(price)) : "0"}
            </Text>
        </View>

        {/* Quantity + Note */}
        <View className="flex-row mt-2 gap-3">
            <View className="flex-1">
            <Text className="text-xs text-slate-400 mb-1">Qty</Text>
            <TextInput
                value={qty}
                onChangeText={setQty}
                keyboardType="number-pad"
                className="border border-slate-300 rounded-xl px-3 py-1 text-lg"
            />
            </View>

            <View className="flex-[2]">
            <Text className="text-xs text-slate-400 mb-1">Note (optional)</Text>
            <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Service / repair"
                className="border border-slate-300 rounded-xl px-3 py-2"
            />
            </View>
        </View>

        {/* Number Pad */}
        <NumberPad onPress={handlePad} />

        {/* Action */}
        <TouchableOpacity
            disabled={!price}
            onPress={submit}
            className={`mt-2 py-3 rounded-3xl mb-5 ${
            price ? "bg-sky-800" : "bg-gray-300 border border-gray-400"
            }`}
        >
            <Text className="text-white text-center text-lg font-bold">
            <MaterialCommunityIcons name="cart-variant" size={20} color="#ffff" className="mr-2" /> Add to Cart
            </Text>
        </TouchableOpacity>
        </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  feedbackToast: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});