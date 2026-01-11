import { View } from "react-native";
import CartPreview from "./components/cartPreview";
import SalesTabs from "./components/salesLayout";

export default function Sales() {
  return <>
  <View className="flex-1 bg-white">
    <SalesTabs />
    <CartPreview />
  </View>
  </>
}