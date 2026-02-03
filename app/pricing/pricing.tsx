import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Image, 
} from 'react-native';
import { Star, ShieldCheck, CreditCard, CheckCircle2 } from 'lucide-react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Reuse your interface
interface PricingPackage {
  id: string;
  title: string;
  duration: string;
  originalPrice: number;
  discountedPrice: number;
  dailyRate: number;
  discountPercentage: number;
  savings: number;
  isPopular?: boolean;
  features: string[];
}


export default function Pricing () {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    
    // Function to handle back press
    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };
    
    const handleNext = () => {
        if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    };

    const goBack = () => {
        router.push("/(tabs)/settings")
    }

    // Step 1
    const Packages = () => {
    const [selectedPackage, setSelectedPackage] = useState<string>('month');

    const pricingPackages: PricingPackage[] = [
        { id: 'day', title: 'Day Pass', duration: '1 Day', originalPrice: 500, discountedPrice: 500, dailyRate: 500, discountPercentage: 0, savings: 0, features: ['24-hour access', 'Basic features'] },
        { id: 'week', title: 'Weekly', duration: '7 Days', originalPrice: 3500, discountedPrice: 3297, dailyRate: 471, discountPercentage: 5, savings: 203, features: ['All day features', 'Priority support'] },
        { id: 'month', title: 'Monthly', duration: '30 Days', originalPrice: 15000, discountedPrice: 13500, dailyRate: 450, discountPercentage: 10, savings: 1500, isPopular: true, features: ['All weekly features', 'Advanced analytics'] },
        { id: 'quarter', title: '3 Months', duration: '90 Days', originalPrice: 45000, discountedPrice: 38000, dailyRate: 422, discountPercentage: 15, savings: 7000, features: ['All monthly features', 'Custom integrations'] },
        { id: 'half-year', title: '6 Months', duration: '180 Days', originalPrice: 90000, discountedPrice: 72000, dailyRate: 400, discountPercentage: 20, savings: 18000, features: ['Dedicated manager', 'Training sessions'] },
        { id: 'year', title: 'Yearly', duration: '365 Days', originalPrice: 182490, discountedPrice: 136500, dailyRate: 374, discountPercentage: 25, savings: 45990, features: ['Custom development', 'VIP support'] }
    ];

    const formatCurrency = (amount: number): string => `TSh ${amount.toLocaleString()}`;

    const selectedPkg = pricingPackages.find(pkg => pkg.id === selectedPackage);


    return <>
        <View className="flex-1 mx-4">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            
            {/* Header */}
            <View className="px-2 pt-2 pb-4">
            <Text className="text-slate-500 mt-2 text-base">
                Get unlimited access to all features, exclusive content, and an ad-free experience.
            </Text>
            </View>

            {/* Horizontal Card Scroller or Vertical List? 
                For Mobile, a Vertical List with radio-style selection is often more professional */}
            {pricingPackages.map((pkg) => (
            <TouchableOpacity
                key={pkg.id}
                activeOpacity={0.7}
                onPress={() => setSelectedPackage(pkg.id)}
                className={`relative p-5 rounded-3xl border-2 bg-white mb-4 ${
                selectedPackage === pkg.id ? 'border-blue-600' : 'border-slate-200'
                }`}
            >
                {pkg.isPopular && (
                <View className="absolute -top-3 right-6 bg-blue-600 px-3 py-1 rounded-full flex-row items-center z-10">
                    <Star size={12} color="white" fill="white" />
                    <Text className="text-white text-[10px] font-bold uppercase ml-1">Most Popular</Text>
                </View>
                )}

                {/* TOP ROW: Title and Total Price */}
                <View className="flex-row justify-between items-start mb-4">
                <View>
                    <Text className="text-xl font-bold text-slate-900">{pkg.title}</Text>
                    <Text className="text-slate-500 text-sm">{pkg.duration}</Text>
                </View>
                
                <View className="items-end">
                    <Text className="text-xl font-black text-slate-900">
                    {formatCurrency(pkg.discountedPrice)}
                    </Text>
                    {pkg.savings > 0 && (
                    <Text className="text-[11px] text-slate-400 line-through">
                        {formatCurrency(pkg.originalPrice)}
                    </Text>
                    )}
                </View>
                </View>

                {/* BOTTOM ROW: Badges and Radio Button (Full Width) */}
                <View className="flex-row items-center justify-between w-full pt-3">
                {/* LEFT SIDE: Badges */}
                <View className="flex-row items-center">
                    <View className="bg-blue-100 px-2 py-1 rounded-md mr-2">
                    <Text className="text-blue-700 font-bold text-[10px]">
                        {formatCurrency(pkg.dailyRate)}/day
                    </Text>
                    </View>

                    {pkg.discountPercentage > 0 && (
                    <View className="bg-emerald-100 px-2 py-1 rounded-md">
                        <Text className="text-emerald-700 font-bold text-[10px]">
                        SAVE {pkg.discountPercentage}%
                        </Text>
                    </View>
                    )}
                </View>

                {/* RIGHT SIDE: Custom Radio Indicator */}
                <View
                    className={`h-6 w-6 rounded-full border-2 items-center justify-center ${
                    selectedPackage === pkg.id
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-slate-300'
                    }`}
                >
                    {selectedPackage === pkg.id && (
                    <View className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                </View>
                </View>
            </TouchableOpacity>
            ))}

            {/* Order Summary Section */}
            {selectedPkg && (
            <View className="mx-3 mt-4 p-6 bg-slate-800 rounded-3xl shadow-xl shadow-slate-400">
                <Text className="text-white text-lg font-bold mb-4">Summary</Text>
                
                <View className="flex-row justify-between mb-2">
                <Text className="text-slate-400">Selected Plan</Text>
                <Text className="text-white font-medium">{selectedPkg.title}</Text>
                </View>

                <View className="flex-row justify-between mb-2">
                <Text className="text-slate-400">Total Savings</Text>
                <Text className="text-emerald-400 font-medium">-{formatCurrency(selectedPkg.savings)}</Text>
                </View>

                <View className="h-[1px] bg-slate-600 my-4" />

                <View className="flex-row justify-between items-end mb-6">
                <Text className="text-white">Total to Pay</Text>
                <View className="items-end">
                    <Text className="text-3xl font-black text-white">
                    {formatCurrency(selectedPkg.discountedPrice)}/=
                    </Text>
                </View>
                </View>

                <TouchableOpacity 
                className="bg-sky-500 py-4 rounded-2xl items-center flex-row justify-center"
                style={{ elevation: 4 }}
                onPress={handleNext}
                >
                <ShieldCheck size={20} color="white" />
                <Text className="text-white font-bold text-lg ml-2">Continue to checkout</Text>
                </TouchableOpacity>
                
                <Text className="text-slate-500 text-[10px] text-center mt-4">
                Terms and conditions applies • Cancel Anytime
                </Text>
            </View>
            )}
        </ScrollView>
        </View>
    </>
    };

    const InstructionRow = ({ number, text }: { number: string; text: string }) => (
      <View className="flex-row items-start mb-3">
        <View className="bg-blue-600 w-6 h-6 rounded-full items-center justify-center mr-3">
          <Text className="text-white text-xs font-bold">{number}</Text>
        </View>
        <Text className="text-slate-300 flex-1 leading-5">{text}</Text>
      </View>
    );
    

    // Step 2
    const Payment = () => {
          const [method, setMethod] = useState<'lipa' | 'normal'>('lipa');
        
          const LipaImage = ({ active }: { active: boolean }) => (
            <View className={` mb-2 ${active ? 'bg-blue-100' : 'bg-slate-50'}`}>
              <Image
                source={require('@/assets/images/lipa.png')}
                resizeMode="stretch"
                className="w-24 h-12"
              />
            </View>
          );
        
            const MixxImage = ({ active }: { active: boolean }) => (
            <View className={` mb-2 ${active ? 'bg-blue-100' : 'bg-slate-50'}`}>
              <Image
                source={require('@/assets/images/mixx.png')}
                resizeMode="stretch"
                className="w-24 h-12"
              />
            </View>
          );
        
          return (
            <View className="flex-1 px-1 m-4">
              <Text className="text-xl font-bold text-slate-900 mb-2">Payment Method</Text>
              <Text className="text-slate-500 mb-6 text-sm">
                Select how you would like to pay with TigoPesa
              </Text>
        
              <View className="flex-row gap-3 mb-8">
                {/* Lipa kwa TigoPesa */}
                <TouchableOpacity
                  onPress={() => setMethod('lipa')}
                  activeOpacity={0.8}
                  className={`flex-1 p-4 rounded-3xl border-2 bg-white items-center justify-center ${
                    method === 'lipa' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100'
                  }`}
                >
                  <LipaImage active={method === 'lipa'} />
        
                  <Text
                    className={`font-bold text-center ${
                      method === 'lipa' ? 'text-blue-600' : 'text-slate-600'
                    }`}
                  >
                    Lipa - Mixx by Yas
                  </Text>
        
                  {method === 'lipa' && (
                    <View className="absolute top-2 right-2">
                      <CheckCircle2 size={16} color="#2563eb" fill="#dbeafe" />
                    </View>
                  )}
                </TouchableOpacity>
        
                {/* Normal TigoPesa */}
                <TouchableOpacity
                  onPress={() => setMethod('normal')}
                  activeOpacity={0.8}
                  className={`flex-1 p-4 rounded-3xl border-2 bg-white items-center justify-center ${
                    method === 'normal' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100'
                  }`}
                >
                  <MixxImage active={method === 'normal'} />
        
                  <Text
                    className={`font-bold text-center ${
                      method === 'normal' ? 'text-blue-600' : 'text-slate-600'
                    }`}
                  >
                    Normal - Mixx by Yas
                  </Text>
        
                  {method === 'normal' && (
                    <View className="absolute top-2 right-2">
                      <CheckCircle2 size={16} color="#2563eb" fill="#dbeafe" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
        
              {/* Instructions Box */}
              <View className={`${method === "lipa" ? "bg-slate-800" : "bg-blue-950"} p-6 rounded-2xl`}>
                <Text className={`text-white font-bold text-lg mb-4`}>
                  📋 Payment Instructions
                </Text>
        
                {method === 'lipa' ? (
                  <View>
                    <InstructionRow number="1" text="Dial *150*01# on your phone" />
                    <InstructionRow number="2" text="Select 5 - Lipa kwa TigoPesa" />
                    <InstructionRow number="3" text="Enter Merchant Number: 123456" />
                    <InstructionRow number="4" text="Enter Amount and PIN to confirm" />
                  </View>
                ) : (
                  <View>
                    <InstructionRow number="1" text="Dial *150*01# on your phone" />
                    <InstructionRow number="2" text="Select 1 - Send Money" />
                    <InstructionRow number="3" text="Enter Phone: 0712 000 000" />
                    <InstructionRow number="4" text="Enter Amount and PIN to confirm" />
                  </View>
                )}
        
                <View className="mt-6 pt-4 border-t border-slate-700">
                  <Text className={`text-slate-400 text-xs italic text-center`}>
                    Once you complete the transfer, click the Verify Payment button below.
                  </Text>
                </View>

                <TouchableOpacity 
                    className="bg-sky-500 py-4 mt-3 rounded-2xl items-center flex-row justify-center"
                    style={{ elevation: 4 }}
                    onPress={handleNext}
                >
                    <ShieldCheck size={20} color="white" />
                    <Text className="text-white font-bold text-lg ml-2">Verify Payment</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
    }
    // Step 3: 
  const PaymentStep = () => (
    <View className="flex-1 items-center justify-center py-10">
      <View className="bg-blue-100 p-6 rounded-full mb-6">
        <CreditCard size={40} color="#2563eb" />
      </View>
      <Text className="text-2xl font-bold text-slate-900 text-center">Finalize Payment</Text>
      <Text className="text-slate-500 text-center mt-2 px-6">
        Click below to securely pay via your preferred method.
      </Text>
    </View>
  );

    return <View className='flex-1'>
        {/* Header */}
        <View className="px-4 pt-8 pb-2 bg-white border-b border-gray-400">
            <View className="flex-row items-center gap-2 pt-3">
                <Ionicons name="arrow-back-sharp" size={24} color="black" onPress={goBack}/>
                <MaterialIcons name="attach-money" size={24} color="#1F2937" />
                <Text className="text-xl font-bold text-gray-800">Pricing</Text>
            </View>        
        </View>
        {/* TOP NAVIGATION BAR */}
        <View className="px-6 py-1 flex-row items-center justify-between bg-sky-200">
            <TouchableOpacity 
            onPress={handleBack} 
            disabled={currentStep === 1}
            className={`p-2 rounded-full ${currentStep === 1 ? 'opacity-0' : 'bg-slate-100'}`}
            >
            <MaterialIcons name="arrow-back-ios-new" size={18} color="#0f172a" />
            </TouchableOpacity>
            
            {/* Step Indicator Bullets */}
            <View className="flex-row items-center gap-2">
            {[1, 2, 3].map((step) => (
                <View 
                key={step} 
                className={`h-2 rounded-full ${
                    step === currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-slate-400'
                }`} 
                />
            ))}
            </View>

            <View className="w-10" /> 
        </View>

        {/* Pages  */}
        <View className='flex-1'>
            {currentStep === 1 && <Packages />}
            {currentStep === 2 && <Payment />}
            {currentStep === 3 && <PaymentStep />}
        </View>

        <Text className="text-center text-slate-600 text-[11px] p-2 bg-sky-200">
            Step {currentStep} of {totalSteps} — {currentStep === 1 ? 'Plan Selection' : currentStep === 2 ? 'Payment Method' : 'Verify Payment'}
        </Text>
    </View>
}