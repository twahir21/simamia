import { View } from "react-native";
import CartPreview from "./components/cartPreview";
import SalesLayout from "./components/salesLayout";

export default function Sales() {
  return <>
  <View className="flex-1 bg-white">
    <SalesLayout />
    <CartPreview />
  </View>
  </>
}