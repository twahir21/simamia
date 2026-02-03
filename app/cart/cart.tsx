// extra cart (main Cart)
  //  Steps
  // 1. Save to sales table and salesItems table
  //  Cash sale → paidAmount = totalAmount, balance = 0
  //  Debt sale → paidAmount = 0, balance > 0
  //  Partial → mixed payment


  // todo 2. if debt save sales as unpaid and debts table as open
  //  when customer pays update 
  // debts.amountPaid
  // update sales.paidAmount
  // update sales.balance

//?   When balance === 0:

  // sales.status = 'paid'
  // debts.status = 'paid'


  // user must view receipt in Sales → Today → Tap sale → Receipt
  
import { useCartStore } from '@/store/cart';
import { CartItem } from '@/types/stock.types';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, FlatList, TextInput, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { saveCashSales, saveDigitalSales, validateCartStock } from '@/db/sales.sqlite';
import SuccessToast from '../(tabs)/home/components/ui/Success';
import { useAudioPlayer } from 'expo-audio';
import { PaymentMethod } from '@/types/globals.types';
import FoldableTips from './tips';



// ---------------- Helpers ----------------
const formatTZS = (n: number) => `TZS ${n.toLocaleString('en-TZ')}`;

// ---------------- Component ----------------
export default function ViewCartScreen() {
  const [discount, setDiscount] = useState<number>(0); // flat discount
  const [saleMode, setSaleMode] = useState<PaymentMethod>('cash');
  const [saleAmount, setSaleAmount] = useState<number>(0); // Store sale amount separately
  const [toastVisible, setToastVisible] = useState(false);
  const [lastSaleId, setLastSaleId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);



  const cart = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);
  const updateQty = useCartStore(state => state.updateQty);
  const removeItem = useCartStore(state => state.removeItem);

  const successSound = useAudioPlayer(require("@/assets/sounds/success.mp3"));
  



  // --- quantity hold acceleration ---
  const intervalRef = useRef<number | null>(null);
  const speedRef = useRef<number>(300);


  const startHold = (stockId: number, initialQty: number, delta: 1 | -1) => {
    stopHold();
    Haptics.selectionAsync();

    speedRef.current = 200;

    let currentQty = initialQty;

    intervalRef.current = setInterval(() => {
      currentQty += delta;

      updateQty(stockId, currentQty);

      // accelerate (min speed = 60ms)
      speedRef.current = Math.max(60, speedRef.current - 20);

      // restart interval with new speed
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          currentQty += delta;
          updateQty(stockId, currentQty);
        }, speedRef.current);
      }
    }, speedRef.current);
  };

  const stopHold = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => stopHold, []);

  // ---------------- Totals ----------------
  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const total = Math.max(0, subtotal - discount);

  // ---------------- Actions ----------------
    const clearAll = () => {
    if (!cart.length) return;

    Alert.alert('Clear cart', 'Remove all items?', [
        { text: 'Cancel', style: 'cancel' },
        {
        text: 'Clear',
        style: 'destructive',
        onPress: clearCart,
        },
    ]);
    };

  const saveSale = () => {
    const isQtySafe = validateCartStock(cart);

    if(!isQtySafe.isValid) {
      setErrorMessage(isQtySafe.message || "Insufficient stock for some items");
      return;
    }
    switch(saleMode) {
      case "cash": 
        try {
          // Save the amount BEFORE clearing cart
          const currentSaleAmount = total;
          
          const saleId = saveCashSales(currentSaleAmount, cart);
          
          // Store the sale amount for the toast
          setSaleAmount(currentSaleAmount);
          setLastSaleId(saleId);
          setToastVisible(true);
    
          if (successSound) {
            successSound.seekTo(0);
            successSound.play();
          }
    
          clearCart();
        } catch (e) {
          setErrorMessage(`Database error: Could not save sale. ${e}`);
        }
      break;

      case "debt": 
      Alert.alert('Debts', 'Handling debts is coming soon');
      break;

      case "digital":
        try {
          // Save the amount BEFORE clearing cart
          const currentSaleAmount = total;
          
          const saleId = saveDigitalSales(currentSaleAmount, cart);
          
          // Store the sale amount for the toast
          setSaleAmount(currentSaleAmount);
          setLastSaleId(saleId);
          setToastVisible(true);
    
          if (successSound) {
            successSound.seekTo(0);
            successSound.play();
          }
    
          clearCart();
        } catch (e) {
          setErrorMessage(`Database error: Could not save sale. ${e}`);
        }      
      break;

      case "mixed":
        Alert.alert('Mixed', 'Handling mixed methods is coming soon');
      break;
    }
  };

  const markOrder = () => {
    Alert.alert('Order', 'Marked as order for future processing/delivery');
  };

  const markExpense = () => {
    Alert.alert('Expense', 'Marked as personal expense');
  };

  // ---------------- UI ----------------
  const renderItem = ({ item }: { item: CartItem }) => (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
      <View className="flex-1 pr-2">
        <Text className="text-base font-medium text-gray-900">{item.name}</Text>
        <Text className="text-xs text-gray-500">{formatTZS(item.price)} x {item.qty}</Text>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => updateQty(item.stockId, item.qty - 1)}
          onPressIn={() => startHold(item.stockId, item.qty, -1)}
          onPressOut={stopHold}
          className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 border border-gray-400"
        >
          <Text className="text-lg">−</Text>
        </Pressable>

        <Text className="w-8 text-center font-semibold">{item.qty}</Text>

        <Pressable
          onPress={() => updateQty(item.stockId, item.qty + 1)}
          onPressIn={() => startHold(item.stockId, item.qty, +1)}
          onPressOut={stopHold}
          className="h-8 w-8 items-center justify-center rounded-full bg-sky-800"
        >
          <Text className="text-lg text-white">+</Text>
        </Pressable>

        <Pressable
        onPress={() => removeItem(item.stockId)}
        className="ml-2 rounded-full bg-red-50 px-3 py-1"
        >
        <Trash2 size={20} color="#ef4444" />
        </Pressable>

      </View>
    </View>
  );

  const goBack = () => {
    router.push("/(tabs)/home/sales")
  }

  return <>
    {/* Header */}
    <View className="px-4 pt-8 pb-2 bg-white border-b border-gray-400">
        <View className="flex-row items-center gap-2 pt-3">
            <Ionicons name="arrow-back-sharp" size={24} color="black" onPress={goBack}/>
            <MaterialIcons name="shopping-cart-checkout" size={24} color="#1F2937" />
            <Text className="text-xl font-bold text-gray-800">Cart</Text>
        </View>        
    </View>
    <View className="flex-1 bg-white p-4">
      <SuccessToast
        visible={toastVisible}
        message={`Sale saved — TZS ${saleAmount.toLocaleString()}`} // Use saleAmount, not totalAmount
        onClose={() => setToastVisible(false)}
        onReceipt={() => {
          setToastVisible(false);
          router.push(`/receipt/${lastSaleId}`);
        }}
      />
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xl font-semibold">{cart.length} items</Text>

        <Pressable
          className="flex-row items-center px-4 py-2 bg-red-50 rounded-lg border border-red-200"
          onPress={clearAll}
        >
          <Trash2 size={18} color="#DC2626" />
          <Text className="text-red-600 font-medium ml-2">
            Clear All
          </Text>
        </Pressable>
      </View>

      {/* Error message */}
      {errorMessage && (
        <View className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <View className="flex-row items-center gap-2">
            <Feather name="alert-triangle" size={16} color="#DC2626" />
            <Text className="text-sm text-red-700 flex-1">{errorMessage}</Text>
            <Pressable onPress={() => setErrorMessage(null)}>
              <Feather name="x" size={16} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>
      )}

      {/* Cart List */}
      <FlatList
        data={cart}
        keyExtractor={i => i.stockId.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
        <View className="flex-1 items-center justify-center px-6 py-20">
        <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-6">
            <MaterialCommunityIcons name="cart-off" size={48} color="#9CA3AF" />
        </View>
        <Text className="text-xl font-semibold text-gray-500 mb-2">
            Your cart is empty
        </Text>
        <Pressable className="px-8 py-3 bg-sky-800 rounded-full m-3" onPress={goBack}>
            <Text className="text-white font-semibold">Back to Sales</Text>
        </Pressable>
        </View>
        }
      />

      {/* Discount */}
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-sm text-gray-600">Discount (optional)</Text>
        <TextInput
          keyboardType="numeric"
          placeholder="0"
          value={discount ? String(discount) : ''}
          onChangeText={t => setDiscount(Number(t) || 0)}
          className="w-32 rounded-md border border-gray-300 px-3 py-2 text-right"
        />
      </View>

      {/* Totals */}
      <View className="mt-3 rounded-lg bg-gray-100 border border-gray-300 p-3">
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-600">Subtotal</Text>
          <Text className="text-sm">{formatTZS(subtotal)}</Text>
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-sm font-medium">Total</Text>
          <Text className="text-sm font-semibold">{formatTZS(total)}</Text>
        </View>
      </View>
      
      <FoldableTips />

      {/* Sale Mode (minimal actions) */}
      <View className="mt-3 flex-row rounded-lg border border-gray-400 overflow-hidden">
        {(['cash', 'debt', 'digital', 'mixed'] as PaymentMethod[]).map(m => (
          <Pressable
            key={m}
            onPress={() => setSaleMode(m)}
            className={`flex-1 items-center py-2 ${saleMode === m ? 'bg-sky-800' : 'bg-white'}`}
          >
            <Text className={`${saleMode === m ? 'text-white' : 'text-gray-700'} text-xs font-medium`}>
              {m.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Primary / Secondary Actions */}
      <View className="mt-3 flex-row gap-2">
        {/* Save Sale */}
        <View className="flex-1">
          <Pressable
            onPress={saveSale}
            disabled={cart.length === 0}
            className={`w-full rounded-lg ${cart.length === 0 ? 'bg-gray-300' : 'bg-sky-800'} py-3 items-center justify-center`}
          >
            <Text className="text-white font-semibold text-sm text-center">
              Save Sale
            </Text>
          </Pressable>
        </View>

        {/* Order */}
        <View className="flex-1">
          <Pressable
            disabled={cart.length === 0}
            onPress={markOrder}
            className={`w-full rounded-lg border border-gray-300 bg-white py-3 items-center justify-center`}
          >
            <Text className="text-gray-700 text-sm font-medium text-center">
              <Feather name="bookmark" size={14} color="black" className='pr-1'/> Order
            </Text>
          </Pressable>
        </View>

        {/* Expense */}
        <View className="flex-1">
          <Pressable
            onPress={markExpense}
            disabled={cart.length === 0}
            className="w-full rounded-lg border border-gray-300 bg-white py-3 items-center justify-center"
          >
            <Text className="text-gray-700 text-sm font-medium text-center">
              <MaterialCommunityIcons name="newspaper-variant-outline" size={14} color="black" className='pr-1' /> Expense
            </Text>
          </Pressable>
        </View>
      </View>

    </View>
  </>
}
