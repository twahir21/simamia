import { MODULE_FILTERS, ModuleType } from "@/helpers/actionHandler.help";
import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, Modal, View } from "react-native";

const DynamicFilterModal = ({ 
  visible, 
  module, 
  currentFilter, 
  onSelect, 
  onClose 
}: { 
  visible: boolean, 
  module: ModuleType, 
  currentFilter: string, 
  onSelect: (val: string) => void, 
  onClose: () => void 
}) => {
  const config = MODULE_FILTERS[module];

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-slate-800">{config.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather size={24} name="x-circle" color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {config.sections.map((section) => (
              <View key={section.title} className="mb-6">
                <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                  {section.title}
                </Text>
                {section.options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      onSelect(option.value);
                      onClose();
                    }}
                    className={`px-4 py-4 rounded-2xl mb-2 flex-row justify-between items-center ${
                      currentFilter === option.value 
                        ? (option.color || 'bg-blue-600') 
                        : 'bg-slate-50 border border-slate-100'
                    }`}
                  >
                    <Text className={`font-bold ${currentFilter === option.value ? 'text-white' : 'text-slate-700'}`}>
                      {option.label}
                    </Text>
                    {currentFilter === option.value && <Feather name="check" size={18} color="white" />}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DynamicFilterModal;