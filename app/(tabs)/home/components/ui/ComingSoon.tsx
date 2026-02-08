import React from "react";
import { View, Text, TouchableOpacity,  Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const ComingSoonPage = ({ 
  title = "Feature Under Construction", 
  icon = "construct-outline",
  hasHeader = false
}: { 
  title?: string; 
  icon?: keyof typeof Ionicons.glyphMap 
  hasHeader?: boolean;
}) => {

  const goBack = () => {
    router.push("/(tabs)/home")
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header  */}
      {!hasHeader && (
        <View className="px-4 pt-5 pb-2 bg-white border-b border-gray-400">
          <View className="flex-row items-center gap-2 pt-3">
            <Ionicons name="arrow-back-sharp" size={24} color="black" onPress={goBack}/>
            <Ionicons name="construct-outline" size={24} color="#1F2937" />
            <Text className="text-xl font-bold text-gray-800">Coming Soon</Text>
          </View>
        </View>
      )}

      <View className="flex-1 justify-center items-center px-8">
        
        {/* Decorative Background Element */}
        <View 
          className="absolute bg-sky-100/90 rounded-full" 
          style={{ width: width * 0.8, height: width * 0.8, top: '20%' }} 
        />

        {/* Icon & Illustration Area */}
        <View className="bg-slate-50 p-8 rounded-[32px] shadow-2xl shadow-slate-200 items-center justify-center mb-8">
          <View className="bg-sky-100 p-6 rounded-full">
            <Ionicons name={icon} size={48} color="#0369a1" />
          </View>
        </View>

        {/* Content */}
        <View className="items-center text-center">
          <Text className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
            {title}
          </Text>
          
          <Text className="text-slate-500 text-center leading-6 text-base mb-10 px-4">
            We appreciate your patience as we build something amazing for you. 
            Our team is working hard to bring this feature to life.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="bg-sky-800 w-full py-4 rounded-2xl shadow-lg shadow-slate-400 flex-row justify-center items-center"
        >
          <Ionicons name="arrow-back" size={18} color="white" className="mr-2" />
          <Text className="text-white font-bold text-lg ml-2">Go Back</Text>
        </TouchableOpacity>

        {/* Minimal Footer */}
        <View className="mt-8 flex-row items-center">
          <View className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-2 animate-pulse" />
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-[2px]">
            In Development
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ComingSoonPage;