import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Platform, Alert } from "react-native";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { fetchSaleById } from "@/db/sales.sqlite";
import { PaymentMethod, SaleItem } from "@/types/globals.types";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// Types for your receipt data

interface ReceiptData {
  id: number;
  receiptNo: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashier: string;
}

export default function ReceiptPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);



  // Fetch receipt data by ID
  useEffect(() => {
    const fetchReceipt = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        // Fetch from your database
        const saleData = fetchSaleById(parseInt(id));

        if (saleData) {
            // 1. Calculate the subtotal from the items array
            const calculatedSubtotal = saleData.items.reduce(
                (acc, item) => acc + (item.price * item.qty), 
                0
            );
          // Format the data for receipt display
        // 1. Create the date object from the DB string
        const dateObj = new Date(saleData.createdAt);

        // 2. Add 3 hours in milliseconds (3 * 60min * 60sec * 1000ms)
        const EAT_OFFSET = 3 * 60 * 60 * 1000;
        const localDate = new Date(dateObj.getTime() + EAT_OFFSET); // East African time

        const formattedReceipt: ReceiptData = {
        id: saleData.id,
        receiptNo: `INV-${String(saleData.id).padStart(6, '0')}`,
        date: localDate.toLocaleString('en-GB', { // en-GB gives DD/MM/YYYY
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }),
        items: saleData.items || [],
        subtotal: calculatedSubtotal,
        total: saleData.totalAmount,
        paymentMethod: saleData.paymentType || "Cash",
        cashier: "System"
        };

        setReceipt(formattedReceipt);
        }
      } catch (error) {
        console.error("Error fetching receipt:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

    const col1 = "flex-[2]"; // Item Name (takes most space)
    const col2 = "w-12 text-center"; // Quantity (fixed small width)
    const col3 = "w-24 text-right";  // Total (fixed medium width)

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#075985" />
        <Text className="text-slate-500 mt-2 font-medium">Inapakia Risiti...</Text>
      </View>
    );
  }

  if (!receipt) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-4">
        <Feather name="file-text" size={48} color="#9CA3AF" />
        <Text className="text-lg text-gray-600 mt-4">Risiti haipatikani</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 px-6 py-3 bg-sky-800 rounded-lg"
        >
          <Text className="text-white font-bold">Rudi Nyuma</Text>
        </Pressable>
      </View>
    );
  }


  const generateHTML = (receipt: ReceiptData) => {
    const itemsHTML = receipt.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.qty}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ${(item.price * item.qty).toLocaleString()}
        </td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receipt ${receipt.receiptNo}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            color: #111827;
            display: flex;
            justify-content: center;   /* horizontal center */
            align-items: flex-start;   /* NOT center vertically */
          }
          .receipt {
            width: auto;
            height: auto;
            margin: 0 auto;
            border: 1px solid #9ca3af;
            border-radius: 8px;
            padding: 20px;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 2px dashed #d1d5db;
          }
          .store-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .store-details {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.5;
          }
          .receipt-info {
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            text-align: left;
            padding: 10px;
            border-bottom: 2px solid #e5e7eb;
            font-weight: bold;
            color: #374151;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 20px;
            font-weight: bold;
            padding: 15px 0;
            border-top: 2px dashed #d1d5db;
            border-bottom: 2px dashed #d1d5db;
            margin: 20px 0;
          }
          .payment-info {
            background: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px dashed #d1d5db;
          }
          .thank-you {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
          }
          .paid-badge {
            padding: 5px;
            margin-left: 4px;
            font-size: 14px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="store-name">Duka la Simamia</div>
            <div class="store-details">
              Mtaa wa Biashara 123<br>
              Simu: +255 123 456 789
            </div>
          </div>
          
          <div class="receipt-info">
            <div class="info-row">
              <span>Risiti:</span>
              <span><strong>${receipt.receiptNo}</strong></span>
            </div>
            <div class="info-row">
              <span>Tarehe:</span>
              <span>${receipt.date}</span>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Bidhaa</th>
                <th style="text-align: center;">Kiasi</th>
                <th style="text-align: right;">Jumla</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <div class="total-row">
            <span>JUMLA:</span>
            <span>TZS ${receipt.total.toLocaleString()}/=</span>
          </div>
          
          <div class="payment-info">
            <div class="info-row">
              <span>Njia ya Malipo:</span>
              <span><strong>${receipt.paymentMethod}</strong></span>
            </div>
            <div class="info-row">
              <span>Hali ya Malipo:</span>
              <span class="paid-badge">IMELIPWA</span>
            </div>
          </div>
          
          <div class="thank-you">Asante kununua! 🙏</div>
          <div style="text-align: center; color: #6b7280; margin-bottom: 20px;">
            Karibu Tena Dukani Kwetu
          </div>
          
          <div class="footer">
            POWERED BY SIMAMIA APP<br>
          </div>
        </div>
      </body>
      </html>
    `;
  };


  const handleShare = async () => {
    if (!receipt) return;
    
    try {
      setIsGeneratingPDF(true);
      
      // Generate HTML content
      const htmlContent = generateHTML(receipt);
      
      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      
      
      // For iOS/Android - Share the PDF
      if (Platform.OS !== 'web') {

        // Check if sharing is available
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: `Download Receipt: ${receipt.receiptNo}`,
            UTI: 'com.adobe.pdf',
          });
        } else {
          Alert.alert(
            'PDF Generated',
            `PDF saved to: ${uri}`,
            [{ text: 'OK' }]
          );
        }
      } else {
        // For web - trigger download
        const link = document.createElement('a');
        link.href = uri;
        link.download = `Receipt_${receipt.receiptNo}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };


  const handlePrint = async () => {
    if (!receipt) return;
    
    try {
      setIsGeneratingPDF(true);
      
      // Generate HTML content
      const htmlContent = generateHTML(receipt);
      
      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      await Print.printAsync({
        uri,
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-2">
          <Pressable
            onPress={() => router.back()}
            className="p-2 rounded-full bg-gray-100"
          >
            <Feather name="arrow-left" size={20} color="#374151" />
          </Pressable>
          
          <Text className="text-xl font-bold text-gray-900">Risiti</Text>
          
          <Pressable
            onPress={() => router.back()}
            className="p-2 rounded-full bg-gray-100"
          >
            <Feather name="x" size={20} color="#374151" />
          </Pressable>
        </View>

        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-600 text-sm">Namba ya Risiti:</Text>
            <Text className="text-gray-900 font-bold text-lg">
              {receipt.receiptNo}
            </Text>
          </View>
          
          <View className="items-end">
            <Text className="text-gray-600 text-sm">Tarehe:</Text>
            <Text className="text-gray-900 font-medium text-sm">
              {receipt.date}
            </Text>
          </View>
        </View>
      </View>

      {/* Receipt Content */}
      <ScrollView className="flex-1 px-4 py-6 mb-9 mx-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Receipt Paper Simulation */}
        <View className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">

          {/* Store Header */}
          <View className="items-center mb-1">
            <Text className="text-xl font-bold text-gray-900">Duka la Simamia</Text>
            <Text className="text-gray-600 text-sm mt-1">Mtaa wa Biashara 123</Text>
            <Text className="text-gray-600 text-sm">Simu: +255 123 456 789</Text>
          </View>
          
          {/* Store Details Separator - Dashed */}
          <View style={styles.dashedLine} />
          
          {/* Receipt Details */}
          <View className="my-2">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Risiti:</Text>
              <Text className="text-gray-900 font-medium">{receipt.receiptNo}</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Tarehe:</Text>
              <Text className="text-gray-900 font-medium">{receipt.date}</Text>
            </View>
            {/* <View className="flex-row justify-between">
              <Text className="text-gray-600">Mkaguzi:</Text>
              <Text className="text-gray-900 font-medium">{receipt.cashier}</Text>
            </View> */}
          </View>
          
          {/* Details Separator - Dashed */}
          <View style={styles.dashedLine} />
          
          <View className="bg-white px-2">
              {/* Items Header */}
              <View className="flex-row border-b border-gray-300 py-2">
                <Text className={`font-bold text-gray-900 ${col1}`}>Bidhaa</Text>
                <Text className={`font-bold text-gray-900 ${col2}`}>Kiasi</Text>
                <Text className={`font-bold text-gray-900 ${col3}`}>Jumla</Text>
              </View>

              {/* Items List */}
              {receipt.items.map((item, index) => (
                <View
                  key={index}
                  className={`flex-row items-center py-3 ${
                    index < receipt.items.length - 1 ? "border-b border-gray-300" : ""
                  }`}
                >
                  {/* Column 1: Name & Unit Price */}
                  <View className={col1}>
                    <Text className="font-medium text-gray-900" numberOfLines={1}>
                      {item.productName}
                    </Text>
                    <Text className="text-gray-500 text-[10px]">
                      {item.qty.toLocaleString()} x {item.price.toLocaleString()}
                    </Text>
                  </View>

                  {/* Column 2: Quantity */}
                  <Text className={`font-medium text-gray-800 ${col2}`}>
                    {item.qty}
                  </Text>

                  {/* Column 3: Total Price */}
                  <Text className={`font-bold text-gray-900 ${col3}`}>
                    {/* We use .toLocaleString() but no TZS here to keep it clean */}
                    {(item.qty * item.price).toLocaleString()}
                  </Text>
                </View>
              ))}
          </View>
          
          {/* Items Separator - Dashed */}
          <View style={styles.dashedLine} />
          
          {/* Totals */}
          <View className="py-3">            
            <View className="flex-row justify-between">
              <Text className="text-2xl font-bold text-gray-900">JUMLA: </Text>
              <Text className="text-2xl font-bold text-gray-900">
                TZS {receipt.total.toLocaleString()}/=
              </Text>
            </View>
          </View>
          
          {/* Total Separator - Dashed */}
          <View style={styles.dashedLine} />
          
          {/* Payment Info */}
          <View className="py-2">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">Njia ya Malipo:</Text>
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-green-500" />
                <Text className="font-medium text-gray-900">
                  {receipt.paymentMethod}
                </Text>
              </View>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Hali ya Malipo:</Text>
              <Text className="font-medium text-green-600">IMELIPWA</Text>
            </View>
          </View>
          
          {/* Payment Separator - Dashed */}
          <View style={styles.dashedLine} />
          
          {/* Thank You Message */}
          <View className="py-3">
            <Text className="text-center text-gray-800 font-bold text-lg mb-2">
              Asante kununua! 🙏
            </Text>
            <Text className="text-center text-gray-600 text-sm mb-4">
              Karibu Tena Dukani Kwetu
            </Text>
            
            {/* Footer Separator - Dashed */}
            <View style={styles.dashedLine} />
            
            {/* Powered By */}
            <Text className="text-center text-gray-400 text-xs mt-2">
              POWERED BY SIMAMIA APP
            </Text>
          </View>
        </View>
        
        {/* Action Buttons Space */}
        <View className="h-20" />
      </ScrollView>

      {/* Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <View className="flex-row gap-3">
          <Pressable
            className="flex-1 border border-sky-800 bg-white rounded-xl py-4 flex-row items-center justify-center gap-2"
            onPress={handleShare}
          >
            <Feather name="share-2" size={18} color="#075985" />
            <Text className="text-sky-800 font-bold">Share</Text>
          </Pressable>

          <Pressable
            className="flex-1 bg-sky-800 rounded-xl py-4 flex-row items-center justify-center gap-2"
            onPress={handlePrint}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <FontAwesome6 name="print" size={18} color="white" />
            )}
            <Text className="text-white font-bold">
              {isGeneratingPDF ? 'Generating PDF...' : 'Print'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// Style for dashed lines
const styles = StyleSheet.create({
  dashedLine: {
    height: 1,
    width: '100%',
    marginVertical: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
});