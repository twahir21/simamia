import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList, Pressable, Modal, Alert, ActivityIndicator } from 'react-native';
import { Search, Package, AlertTriangle, XCircle, Edit3, PlusCircle, Trash2, MapPin, Tag, Plus, Truck, Hash, Calendar, Target, X, Download, PackageSearch } from 'lucide-react-native';
import { BottomActions } from './components/ui/Actions';
import { deleteStock, fetchAllStock, saveStock, searchStock, stockAnalysis, updateStock } from '@/db/stock.sqlite';
import { FetchStock, StockInput } from '@/types/stock.types';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';

const generateStockBatch = (supplierName?: string): string => {
  // 1. Get first 15 letters of supplier (uppercase)
  const sup = (supplierName || "MSAMBAZAJI").substring(0, 15).toUpperCase().replace(/\s+/g, "") ; // removes spaces.
  
  // 2. Get Date in DDMMYY format
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const dateStr = `${day}${month}${year}`;

  // 3. Return the code
  return `${sup}-${dateStr}`;
};


export default function Stock() {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [STOCKS, setStocks] = useState<FetchStock[]>([]);
    const [editingStock, setEditingStock] = useState<FetchStock | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [analysis, setAnalysis] = useState({
      totalItems: 0,
      lowStock: 0,
      outOfStock: 0,
    });

    useEffect(() => {
      const data = fetchAllStock();
      setStocks(data);
      setAnalysis(stockAnalysis())
    }, [refreshKey]);

    const refreshStocks = () => {
      setRefreshKey(prev => prev + 1);
    };


  const renderStockCard = ({ item }: { item: FetchStock }) => {
    const isExpanded = expandedId === item.id;
    
    // Status colors
    const statusColor = item.status === 'in-stock' ? 'text-emerald-600' : item.status === 'low-stock' ? 'text-amber-500' : 'text-red-500';
    const statusBg = item.status === 'in-stock' ? 'bg-emerald-50' : item.status === 'low-stock' ? 'bg-amber-50' : 'bg-red-50';

    const confirmDelete = (name: string, id: string) => {
      Alert.alert(
        'Delete item',
        `Are you sure you want to delete ${name}? This action cannot be undone.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteStock(Number(id));
              refreshStocks();
            },
          },
        ]
      );
    };

    return (
      <View className="bg-white mx-4 mb-3 rounded-2xl border border-slate-400 shadow-sm overflow-hidden">
        <View className="p-4">
          {/* Header Area (Always Visible) */}
          <View className="flex-row justify-between items-start">
            <View className="flex-1 pr-2">
              <Text className="text-lg font-bold text-slate-800 uppercase tracking-tight">{item.productName}</Text>
              <Text className="text-xs text-slate-400 font-mono mt-1">{item.qrCode}</Text>
            </View>
            <View className={`${statusBg} px-2 py-1 rounded-md`}>
              <Text className={`${statusColor} text-[10px] font-bold uppercase`}>{item.status.replace('-', ' ')}</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View className="flex-row justify-between mt-4 items-center">
            <View>
              <Text className="text-[10px] text-slate-400 uppercase font-bold">Quantity</Text>
              <Text className="text-xl font-black text-slate-900">{item.quantity}</Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] text-slate-400 uppercase font-bold">Selling Price</Text>
              <Text className="text-xl font-black text-slate-900">{item.sellingPrice.toLocaleString()} TZS</Text>
            </View>
          </View>
          <View className="flex-row my-2">
            <Text className="text-xs font-bold text-slate-700">Buying Price:</Text>
            <Text className="text-xs text-slate-600 pl-1">{item.buyingPrice?.toLocaleString() || 'N/A'} TZS</Text>
          </View>

          <View className="flex-row my-2">
            <Text className="text-xs font-bold text-slate-700">Cost:</Text>
            <Text className="text-xs text-slate-600 pl-1">{item.totalCost?.toLocaleString() || 'N/A'} TZS</Text>
          </View>

          <View className="flex-row my-2">
            <Text className="text-xs font-bold text-slate-700">Profit per Unit:</Text>
            <Text className="text-xs text-green-600 pl-1">
              {(item.sellingPrice - (item.buyingPrice ?? 0) - (item.totalCost ?? 0)).toLocaleString()} TZS
            </Text>
          </View>


          <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-slate-400">
             <Text className="text-[10px] text-slate-400 italic">Updated: {new Date(item.lastUpdate + 'Z').toLocaleString()}</Text>
             <TouchableOpacity onPress={() => setExpandedId(isExpanded ? null : item.id)}>
                <Text className="text-blue-600 font-bold text-xs">{isExpanded ? "Show Less" : "Show More"}</Text>
             </TouchableOpacity>
          </View>

          {/* Expandable Section */}
          {isExpanded && (
            <View className="mt-4 pt-4 border-t border-slate-400 space-y-3">
              <View className="flex-row flex-wrap gap-x-4 gap-y-4">
                <View className="flex-row items-center">
                  <MapPin size={14} color="#64748b" />
                  <Text className="text-xs text-slate-600">Location: {item.location || 'N/A'}</Text>
                </View>
                <View className="flex-row items-center my-2">
                  <Tag size={14} color="#64748b" />
                  <Text className="text-xs text-slate-600 ml-1">Batch: {item.batchNumber || 'N/A'}</Text>
                </View>
              </View>

              <View className="flex-row my-2">
                <Text className="text-xs font-bold text-slate-700">Expiry Date:</Text>
                <Text className="text-xs text-red-500 pl-1">{item.expiryDate || 'No Expiry'}</Text>
              </View>

              <View className="flex-row my-2">
                <Text className="text-xs font-bold text-slate-700">Minimum Stock:</Text>
                <Text className="text-xs text-slate-600 pl-1">{item.minStock.toLocaleString() || 'N/A'} units</Text>
              </View>

              {item.suppliers && (
                <View>
                  <Text className="text-xs font-bold text-slate-700 mb-1">Suppliers:</Text>
                  {item.suppliers.split(",").map((s, idx) => (
                    <Text key={idx} className="text-xs text-slate-500 ml-2 pb-1">• {s}</Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-4 mb-2">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => { setShowEditModal(true); setEditingStock(item)}}
              className="flex-1 bg-sky-600 flex-row items-center justify-center py-3 rounded-xl"
            >
              <Edit3 size={16} color="white" />
              <Text className="text-white font-bold ml-2 text-xs">
                Edit Stock
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-1 bg-blue-50 border border-blue-600 flex-row items-center justify-center py-3 rounded-xl"
            >
              <PlusCircle size={16} color="#2563eb" />
              <Text className="text-blue-600 font-bold ml-2 text-xs">
                Add to Order
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>  confirmDelete(item.productName, item.id )}
              className="bg-red-50 border border-red-500 p-3 rounded-xl"
            >
              <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Run search whenever query changes
  useEffect(() => {

    setLoading(true);

    // small debounce to avoid too many DB calls
    const timeout = setTimeout(() => {
      try {
        const items = searchStock(query);
        setStocks(items);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);


  return (
    <View className="flex-1 bg-slate-50 pt-4 relative">
      {/* Search Header */}
      <View className="px-4 mb-4">
        <View className="bg-white flex-row items-center px-4 py-1 rounded-2xl border border-slate-200 shadow-sm">
          <Search size={20} color="#94a3b8" />
          <TextInput 
            placeholder="Search name, barcode or category ..." 
            className="flex-1 ml-3 text-slate-700 font-medium"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      {/* Horizontal Analytics Card */}
      <View className="pb-3 border-b border-b-gray-400">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
          <AnalyticsCard title="Total Items" count={analysis.totalItems ?? 0} icon={<Package size={20} color="#6366f1"/>} color="bg-indigo-50" border="border border-purple-300" />
          <AnalyticsCard title="Low Stocks" count={analysis.lowStock} icon={<AlertTriangle size={20} color="#f59e0b"/>} color="bg-amber-50" border="border border-yellow-400"/>
          <AnalyticsCard title="Out of Stock" count={analysis.outOfStock} icon={<XCircle size={20} color="#ef4444"/>} color="bg-red-50" border="border border-red-300"/>
        </ScrollView>
      </View>

      {/* Main Stock List */}
      {loading ? (<>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#075985" />
        <Text className="text-slate-500 mt-2 font-medium">Fetching inventory...</Text>
      </View>
      </>): 
      (<FlatList
        data={STOCKS}
        renderItem={renderStockCard}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
        <View className="flex-1 items-center justify-center py-20">
          <PackageSearch size={48} color="#cbd5e1" />
          <Text className="text-slate-500 font-bold m-4">No items found</Text>
          <Text className="text-slate-400 text-sm">We couldn&apos;t find any products matching your criteria.</Text>
          <TouchableOpacity className="mt-4 bg-sky-800 px-6 py-3 rounded-lg">
            <Text className="text-white font-bold"         
              onPress={() => setShowAddModal(true)}
            >Add New Item</Text>
          </TouchableOpacity>
        </View>
        }
      />)}
      <BottomActions />

      {/* Floating Add Button */}
      <Pressable
        onPress={() => setShowAddModal(true)}
        onLongPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); setQuery(""); }}
        android_ripple={{ color: "rgba(255,255,255,0.2)" }}
        className="absolute top-3 right-3 bg-sky-800 w-16 h-16 rounded-full items-center justify-center shadow-lg"
      >
        <Plus size={28} color="white" />
      </Pressable>

      {/* add stock modal  */}
      <AddStockModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess = {() => refreshStocks()}
      />

      {/* Edit stock modal  */}
      <EditStockModal
        visible={showEditModal}
        stock={editingStock}
        onClose={() => { setShowEditModal(false); setEditingStock(null) }}
        onSuccess={() => { refreshStocks(); setEditingStock(null); setShowEditModal(false); }} 
      />

    </View>
  );
}

// --- SUB-COMPONENTS ---
function AnalyticsCard({ title, count, icon, color, border }: { title: string, count: number, icon: any, color: string; border: string }) {
  return (
  <View className={`${color} p-3 rounded-xl mr-1.5 border border-white shadow-sm ${border}`}>
    {/* First line: icon + title */}
    <View className="flex-row items-center space-x-2">
      <View className="bg-white/50 w-8 h-1 rounded-full items-center justify-center">
        {icon}
      </View>
      <Text className="text-[10px] uppercase font-black text-slate-500 tracking-wider">
        {title}
      </Text>
    </View>

    {/* Second line: count */}
    <Text className="text-xl font-black text-slate-900 mt-2 text-center">{count}</Text>
  </View>

  );
}


function AddStockModal({ visible, onClose, onSuccess }: { visible: boolean; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState<StockInput>({
    productName: '',
    category: '',
    unit: '',
    qrCode: '',
    location: 'Main Store', // Default as requested
    expiryDate: '',
    suppliers: '',
    batchNumber: '',
    targetMax: 0,
    status: 'in-stock',
    quantity: 0,
    sellingPrice: 0,
    buyingPrice: 0,
    totalCost: 0,
    minStock: 5,
  });

  const handleSubmit = () => {
    // Basic validation for Critical fieldsPrice
    if (!form.productName || !form.quantity || !form.sellingPrice || !form.buyingPrice || !form.minStock) {
      Alert.alert(
        "Missing information",
        "Please fill in all required fields with * before saving.",
        [{ text: "OK" }]
      );

      return;
    }

    saveStock({
      ...form,
      quantity: Number(form.quantity),
      sellingPrice: Number(form.sellingPrice),
      targetMax: form.targetMax ? Number(form.targetMax) : null,
      suppliers: form.suppliers,
      batchNumber: generateStockBatch(form.suppliers?.split(",")[0])
    })
    onSuccess(); // trigger refetch
    onClose();
  };

  const InputField = ({ label, value, onChangeText, placeholder, icon: Icon, critical = false, keyboardType = "default" }: any) => (
    <View className="mb-4">
      <View className="flex-row items-center mb-1">
        <Text className="text-slate-600 font-bold text-xs uppercase tracking-widest">{label}</Text>
        {critical && <Text className="text-red-500 ml-1">*</Text>}
      </View>
      <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
        {Icon && <Icon size={16} color="#94a3b8" className="mr-2" />}
        <TextInput
          className="flex-1 text-slate-900 font-medium"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholderTextColor="#cbd5e1"
        />
      </View>
    </View>
  );

  const [importVisible, setImportVisible] = useState(false);


  return <>
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-[40px] h-[90%] p-6 shadow-2xl">
          
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-black text-slate-900">Add Stock</Text>
            <Pressable onPress={onClose} className="bg-slate-100 p-2 rounded-full">
               <Text className="text-slate-500 font-bold px-2">X</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            
            {/* 1. Critical Info Section */}
            <Text className="text-blue-600 font-black text-[10px] uppercase mb-3 tracking-tighter">Critical Information</Text>
            <InputField 
              label="Product Name" 
              critical 
              placeholder="e.g. Azam Juice" 
              value={form.productName} 
              onChangeText={(t: string) => setForm({...form, productName: t})} 
            />
            
            <View className="flex-row gap-3">
              <View className="flex-1">
                <InputField 
                  label="Quantity" 
                  critical 
                  keyboardType="numeric" 
                  placeholder="0" 
                  value={form.quantity} 
                  onChangeText={(t: string) => setForm({...form, quantity: Number(t)})} 
                />
              </View>
              <View className="flex-1">
                <InputField 
                  label="Selling Price (TZS)" 
                  critical 
                  keyboardType="numeric" 
                  placeholder="500" 
                  value={form.sellingPrice} 
                  onChangeText={(t: string) => setForm({...form, sellingPrice: Number(t)})} 
                />
              </View>
            </View>

            <View className='flex-row gap-3'>
              <View className="flex-1">
                <InputField 
                  label="Buying Price (TZS)" 
                  critical 
                  keyboardType="numeric" 
                  placeholder="200" 
                  value={form.buyingPrice} 
                  onChangeText={(t: string) => setForm({...form, buyingPrice: Number(t)})} 
                />
              </View>

              <View className="flex-1">
                <InputField 
                  label="Minimum stock" 
                  critical 
                  keyboardType="numeric" 
                  placeholder="5"
                  value={form.minStock} 
                  onChangeText={(t: string) => setForm({...form, minStock: Number(t)})} 
                />
              </View>
            </View>

              <View className="flex-1">
                <InputField 
                  label="Transport & other costs (TZS)" 
                  critical 
                  keyboardType="numeric" 
                  placeholder="0"
                  value={form.totalCost} 
                  onChangeText={(t: string) => setForm({...form, totalCost: Number(t)})} 
                />
              </View>


            {/* 2. Warehouse & Logistic Section */}
            <Text className="text-blue-600 font-black text-[10px] uppercase mt-4 mb-3 tracking-tighter">Warehouse & Logistics</Text>
            <InputField 
              label="Location / Shop" 
              icon={MapPin} 
              placeholder="Main Store" 
              value={form.location} 
              onChangeText={(t: string) => setForm({...form, location: t})} 
            />

            <InputField 
              label="Supplier Names" 
              icon={Truck} 
              placeholder="Separated by comma (e.g. Azam, Mo)" 
              value={form.suppliers} 
              onChangeText={(t: string) => setForm({...form, suppliers: t})} 
            />

            {/* 3. Optional Metadata */}
            <Text className="text-blue-600 font-black text-[10px] uppercase mt-4 mb-3 tracking-tighter">Additional Details (Optional)</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <InputField label="Category" placeholder="e.g. Drinks" value={form.category} onChangeText={(t: string) => setForm({...form, category: t})} />
              </View>
              <View className="flex-1">
                <InputField label="Unit" placeholder="e.g. kg, pcs" value={form.unit} onChangeText={(t: string) => setForm({...form, unit: t})} />
              </View>
            </View>
            <InputField label="QR/Bar Code" icon={Hash} placeholder="Scan or type code" value={form.qrCode} onChangeText={(t: string) => setForm({...form, qrCode: t})} />
            <InputField label="Expiry Date" icon={Calendar} placeholder="YYYY-MM-DD" value={form.expiryDate} onChangeText={(t: string) => setForm({...form, expiryDate: t})} />
            <InputField label="Target Max Stock" icon={Target} keyboardType="numeric" placeholder="1000" value={form.targetMax} onChangeText={(t: string) => setForm({...form, targetMax: Number(t)})} />

          </ScrollView>

          {/* Action Buttons */}
          <View className="pt-3 flex-row gap-3 bg-white">
            {/* CANCEL BUTTON */}
            <Pressable 
              onPress={onClose} 
              className="flex-1 bg-slate-100 py-4 rounded-2xl items-center flex-row justify-center border border-slate-200"
            >
              <X size={18} color="#475569" />
              <Text className="font-bold text-slate-600 ml-1">Cancel</Text>
            </Pressable>

            {/* IMPORT BUTTON */}
            <Pressable 
              onPress={() => setImportVisible(true)}              
              className="flex-1 bg-blue-50 py-4 rounded-2xl items-center flex-row justify-center border border-blue-200"
            >
              <Download size={18} color="#2563eb" />
              <Text className="font-bold text-blue-600 ml-1">Import</Text>
            </Pressable>

            {/* SAVE BUTTON - The Primary Action */}
            <Pressable 
              onPress={handleSubmit} 
              className="flex-[2] bg-emerald-600 py-4 rounded-2xl items-center flex-row justify-center shadow-lg shadow-emerald-200"
            >
              <Ionicons name="save" size={20} color="white" />
              <Text className="font-bold text-white ml-2 text-lg">Save Product</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>

    <ImportModal
  visible={importVisible}
  onClose={() => setImportVisible(false)}
  onImport={(items) => {
    // items are StockInput[]
    // items.forEach(item => {
    //   saveToDatabase(item);
    // });

    setImportVisible(false);
     // or refreshStocks()
  }}
/>

  </>
}



interface ImportModalProps {
  visible: boolean;
  onClose: () => void;
  onImport: (data: StockInput[]) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ visible, onClose, onImport }) => {
  const [csvData, setCsvData] = useState<string>('');

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      // In a real app, you would parse the CSV file here
      Alert.alert('File Selected', 'CSV file selected for import');
      setCsvData('Sample CSV data would be parsed here...');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to pick file');
    }
  };

  const parseCSVData = (csvText: string): StockInput[] => {
    // Simplified CSV parsing - you would need proper CSV parsing logic
    const lines = csvText.split('\n');
    const parsed: StockInput[] = [];
    
    // Skip header row and process data rows
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',');
      if (columns.length >= 8) {
        parsed.push({
          productName: columns[1]?.trim() || `Imported Product ${i}`,
          category: columns[2]?.trim() || 'General',
          unit: columns[4]?.trim() || 'pcs',
          quantity: parseInt(columns[3]?.trim()) || 0,
          sellingPrice: parseFloat(columns[5]?.trim()) || 0,
          targetMax: null,
          status: 'in-stock',
          qrCode: columns[0]?.trim() || `QR-${Date.now()}-${i}`,
          location: columns[7]?.trim() || 'Warehouse',
          expiryDate: '',
          suppliers: columns[6]?.trim() || 'Supplier',
          buyingPrice: Number("2000"),
          totalCost: 0,
          minStock: 5,
          batchNumber: `BATCH-${Date.now()}`
        });
      }
    }
    
    return parsed.length > 0 ? parsed : [
      {
        productName: 'Imported Product 1',
        category: 'Electronics',
        buyingPrice: Number("2500"),
        unit: 'pcs',
        minStock: 5,
        quantity: 50,
        sellingPrice: 99.99,
        targetMax: null,
        status: 'in-stock',
        qrCode: 'QR-IMPORT-001',
        location: 'Warehouse A',
        expiryDate: '',
        suppliers: 'Import Supplier',
        totalCost: 0,
        batchNumber: 'BATCH-001'
      },
      {
        productName: 'Imported Product 2',
        category: 'Fashion',
        unit: 'pcs',
        quantity: 100,
        minStock: 5,
        buyingPrice: Number("5000"),
        totalCost: 0,
        sellingPrice: 49.99,
        targetMax: null,
        status: 'in-stock',
        qrCode: 'QR-IMPORT-002',
        location: 'Warehouse B',
        expiryDate: '',
        suppliers: 'Import Supplier',
        batchNumber: 'BATCH-002'
      }
    ];
  };

  const handleImportSubmit = () => {
    if (csvData) {
      // Parse CSV data
      const parsedData = parseCSVData(csvData);
      onImport(parsedData);
      onClose();
    } else {
      Alert.alert('Error', 'Please select a CSV file first');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          {/* Header */}
          <View className="flex-row justify-between items-center p-6 border-b border-gray-200">
            <Text className="text-2xl font-bold text-gray-900">Import Stock from CSV</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
            <View>
              <TouchableOpacity
                onPress={handleFilePick}
                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 items-center mb-6"
              >
                <Ionicons name="cloud-upload" size={48} color="#9CA3AF" />
                <Text className="text-lg font-semibold text-gray-900 mt-4">Upload CSV File</Text>
                <Text className="text-gray-500 mt-2">Click to browse or drag and drop</Text>
              </TouchableOpacity>

              <Text className="text-blue-500 mb-6 text-center">Download Sample CSV Template</Text>


              {csvData && (
                <View className="bg-gray-50 rounded-xl p-4 mb-6">
                  <Text className="font-medium text-gray-900 mb-2">Preview:</Text>
                  <Text className="text-gray-600">Product 1, Electronics, 50, pcs, 99.99, Supplier A, Warehouse A</Text>
                  <Text className="text-gray-600">Product 2, Fashion, 100, pcs, 49.99, Supplier B, Warehouse B</Text>
                </View>
              )}

              <View className="bg-blue-50 rounded-xl p-4 mb-6">
                <Text className="font-semibold text-blue-900 mb-2">CSV Format Requirements:</Text>
                <Text className="text-blue-700">• Required columns: Product Name, Quantity, Price</Text>
                <Text className="text-blue-700">• Optional columns: Supplier, Location, QR Code, category, Unit, expiry Date, batch Number, target Max (for maximum number of product to order) </Text>
                <Text className="text-blue-700">• File must be in .csv format</Text>
                <Text className="text-blue-700">• Maximum file size: 10MB</Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row p-6 border-t border-gray-200 gap-5">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-gray-100 py-4 rounded-xl items-center border border-gray-400"
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleImportSubmit}
              className="flex-1 bg-blue-500 py-4 rounded-xl items-center"
              disabled={!csvData}
            >
              <Text className="text-white font-semibold">
                {csvData ? 'Import Data' : 'Select File First'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};



function EditStockModal({ visible, onClose, onSuccess, stock }: { visible: boolean; stock: FetchStock | null; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState<StockInput>({
    productName: '',
    category: '',
    unit: '',
    qrCode: '',
    location: 'Main Store',
    expiryDate: '',
    suppliers: '',
    batchNumber: '',
    targetMax: 0,
    status: 'in-stock',
    quantity: 0,
    sellingPrice: 0,
    buyingPrice: 0,
    totalCost: 0,
    minStock: 5,
  });

  useEffect(() => {
  if (stock) {
    setForm({
      productName: stock.productName ?? '',
      category: stock.category ?? '',
      unit: stock.unit ?? '',
      qrCode: stock.qrCode ?? '',
      location: stock.location ?? 'Main Store',
      expiryDate: stock.expiryDate ?? '',
      suppliers: stock.suppliers ?? '',
      batchNumber: stock.batchNumber ?? '',
      targetMax: stock.targetMax ?? 0,
      status: stock.status ?? 'in-stock',
      quantity: stock.quantity ?? 0,
      sellingPrice: stock.sellingPrice ?? 0,
      buyingPrice: stock.buyingPrice ?? 0,
      totalCost: stock.totalCost ?? 0,
      minStock: stock.minStock ?? 5,
    });
  }
}, [stock]);

  const handleEditSubmit = (id: number) => {
    // Basic validation for Critical fields
    if (!form.productName || !form.quantity || !form.sellingPrice || !form.buyingPrice || !form.minStock) {
      Alert.alert(
        "Missing information",
        "Please fill in all required fields with * before saving.",
        [{ text: "OK" }]
      );

      return;
    }

    updateStock(id, {
      ...form,
      quantity: Number(form.quantity),
      sellingPrice: Number(form.sellingPrice),
      targetMax: form.targetMax ? Number(form.targetMax) : null,
      suppliers: form.suppliers,
      batchNumber: generateStockBatch(form.suppliers?.split(",")[0])
    })
    onSuccess(); // trigger refetch
    onClose();
  };

  const InputField = ({ label, value, onChangeText, placeholder, icon: Icon, critical = false, keyboardType = "default" }: any) => (
    <View className="mb-4">
      <View className="flex-row items-center mb-1">
        <Text className="text-slate-600 font-bold text-xs uppercase tracking-widest">{label}</Text>
        {critical && <Text className="text-red-500 ml-1">*</Text>}
      </View>
      <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
        {Icon && <Icon size={16} color="#94a3b8" className="mr-2" />}
        <TextInput
          className="flex-1 text-slate-900 font-medium"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholderTextColor="#cbd5e1"
        />
      </View>
    </View>
  );

  return <>
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-[40px] h-[90%] p-6 shadow-2xl">
          
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-black text-slate-900">Edit Stock</Text>
            <Pressable onPress={onClose} className="bg-slate-100 p-2 rounded-full">
               <Text className="text-slate-500 font-bold px-2">X</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            
            {/* 1. Critical Info Section */}
            <Text className="text-blue-600 font-black text-[10px] uppercase mb-3 tracking-tighter">Critical Information</Text>
            <InputField 
              label="Product Name" 
              critical 
              placeholder="e.g. Azam Juice" 
              value={form.productName} 
              onChangeText={(t: string) => setForm({...form, productName: t})} 
            />
            
            <View className="flex-row gap-3">
              <View className="flex-1">
                <InputField 
                  label="Quantity" 
                  critical 
                  keyboardType="numeric" 
                  placeholder="0" 
                  value={form.quantity.toLocaleString()} 
                  onChangeText={(t: string) => setForm({...form, quantity: Number(t)})} 
                />
              </View>
              <View className="flex-1">
                <InputField 
                  label="Selling Price (TZS)" 
                  critical 
                  keyboardType="numeric" 
                  placeholder="500" 
                  value={form.sellingPrice.toLocaleString()} 
                  onChangeText={(t: string) => setForm({...form, sellingPrice: Number(t)})} 
                />
              </View>
            </View>

            <View className='flex-row gap-3'>
              <View className="flex-1">
                <InputField 
                  label="Buying Price (TZS)" 
                  critical 
                  keyboardType="numeric" 
                  placeholder="200" 
                  value={form.buyingPrice.toLocaleString()} 
                  onChangeText={(t: string) => setForm({...form, buyingPrice: Number(t)})} 
                />
              </View>

              <View className="flex-1">
                <InputField 
                  label="Minimum stock" 
                  critical 
                  keyboardType="numeric" 
                  placeholder="5"
                  value={form.minStock.toLocaleString()} 
                  onChangeText={(t: string) => setForm({...form, minStock: Number(t)})} 
                />
              </View>
            </View>

              <View className="flex-1">
                <InputField 
                  label="Transport & other costs (TZS)" 
                  critical 
                  keyboardType="numeric" 
                  placeholder="0"
                  value={form.totalCost.toLocaleString()} 
                  onChangeText={(t: string) => setForm({...form, totalCost: Number(t)})} 
                />
              </View>


            {/* 2. Warehouse & Logistic Section */}
            <Text className="text-blue-600 font-black text-[10px] uppercase mt-4 mb-3 tracking-tighter">Warehouse & Logistics</Text>
            <InputField 
              label="Location / Shop" 
              icon={MapPin} 
              placeholder="Main Store" 
              value={form.location} 
              onChangeText={(t: string) => setForm({...form, location: t})} 
            />

            <InputField 
              label="Supplier Names" 
              icon={Truck} 
              placeholder="Separated by comma (e.g. Azam, Mo)" 
              value={form.suppliers} 
              onChangeText={(t: string) => setForm({...form, suppliers: t})} 
            />

            {/* 3. Optional Metadata */}
            <Text className="text-blue-600 font-black text-[10px] uppercase mt-4 mb-3 tracking-tighter">Additional Details (Optional)</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <InputField label="Category" placeholder="e.g. Drinks" value={form.category} onChangeText={(t: string) => setForm({...form, category: t})} />
              </View>
              <View className="flex-1">
                <InputField label="Unit" placeholder="e.g. kg, pcs" value={form.unit} onChangeText={(t: string) => setForm({...form, unit: t})} />
              </View>
            </View>
            <InputField label="QR/Bar Code" icon={Hash} placeholder="Scan or type code" value={form.qrCode} onChangeText={(t: string) => setForm({...form, qrCode: t})} />
            <InputField label="Expiry Date" icon={Calendar} placeholder="YYYY-MM-DD" value={form.expiryDate} onChangeText={(t: string) => setForm({...form, expiryDate: t})} />
            <InputField label="Target Max Stock" icon={Target} keyboardType="numeric" placeholder="1000" value={form.targetMax?.toLocaleString()} onChangeText={(t: string) => setForm({...form, targetMax: Number(t)})} />

          </ScrollView>

          {/* Action Buttons */}
          <View className="pt-3 flex-row gap-3 bg-white">
            {/* CANCEL BUTTON */}
            <Pressable 
              onPress={onClose} 
              className="flex-1 bg-slate-100 py-4 rounded-2xl items-center flex-row justify-center border border-slate-200"
            >
              <X size={18} color="#475569" />
              <Text className="font-bold text-slate-600 ml-1">Cancel</Text>
            </Pressable>

            {/* SAVE BUTTON - The Primary Action */}
            <Pressable 
              onPress={() => handleEditSubmit(stock ? Number(stock.id) : 0)} 
              className="flex-[2] bg-emerald-600 py-4 rounded-2xl items-center flex-row justify-center shadow-lg shadow-emerald-200"
            >
              <Ionicons name="save" size={20} color="white" />
              <Text className="font-bold text-white ml-2 text-lg">Save Product</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>

  </>
}

