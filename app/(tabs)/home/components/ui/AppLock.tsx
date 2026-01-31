import React, { useState, useEffect, useRef } from 'react';
import { AppState, View, Text, TouchableOpacity, AppStateStatus, Image } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const GRACE_PERIOD = 30000; // 30 seconds in milliseconds

export default function AppLock({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const appState = useRef(AppState.currentState);
  const lastBackgroundTime = useRef<number | null>(null);

  const authenticate = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      setIsLocked(false);
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Simamia Shop: Ingia kuendelea',
      fallbackLabel: 'Tumia Passcode',
    });

    if (result.success) {
      setIsLocked(false);
    }
  };

  useEffect(() => {
    authenticate();

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Record the exact time the user left
        lastBackgroundTime.current = Date.now();
      }

      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const currentTime = Date.now();
        const timeAway = lastBackgroundTime.current ? currentTime - lastBackgroundTime.current : 0;

        if (timeAway > GRACE_PERIOD) {
          // Locked only if away for more than 30s
          setIsLocked(true);
          authenticate();
        } else {
          // Return without locking
          setIsLocked(false);
        }
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  if (isLocked) {
    return (
      <View className="flex-1 bg-sky-200 justify-center items-center px-6">
        <Image source={require('@/assets/images/logo.png')} className="w-24 h-24" />
        <Text className="text-2xl font-bold m-2 mt-5">Mpemba Shop</Text>
        <Text className="mb-8 text-center">Ili kulinda data zako, tafadhali thibitisha utambulisho wako</Text>
        
        <TouchableOpacity 
          onPress={authenticate}
          className="bg-sky-800 px-8 py-4 rounded-2xl shadow-lg"
        >
          <Text className="text-white font-bold text-lg">FUNGUA SASA</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}