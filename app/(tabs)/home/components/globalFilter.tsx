import { MODULE_FILTERS, ModuleType } from "@/helpers/actionHandler.help";
import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";

type Props = {
  visible: boolean;
  module: ModuleType;
  active: Record<string, string>;
  onSelect: (key: string, value: string) => void;
  onClose: () => void;
  onApply: () => void;
};

const GlobalFilterModal: React.FC<Props> = ({
  visible,
  module,
  active,
  onSelect,
  onClose,
  onApply,
}) => {
  const config = MODULE_FILTERS[module];

  if (!config) return null;

return (
    <Modal
        visible={visible}
        transparent
        animationType="slide"
    >
        {/* Overlay */}
        <View className="flex-1 bg-black/40 justify-end">

        {/* Bottom Sheet */}
        <View className="bg-white rounded-t-3xl p-4 max-h-[80%]">

            <Text className="text-xl font-bold mb-4 mt-2">
            {config.title}
            </Text>

            <ScrollView>

            {config.sections.map(section => (
                <View key={section.key} className="mb-5">

                <Text className="font-semibold mb-2">
                    {section.title}
                </Text>

                <View className="flex-row flex-wrap">

                    {section.options.map(opt => {
                    const selected =
                        active[section.key] === opt.value;

                    return (
                        <TouchableOpacity
                        key={opt.value}
                        onPress={() =>
                            onSelect(section.key, opt.value)
                        }
                        className={`
                            px-3 py-2 mr-2 mb-2 rounded-lg border
                            ${selected
                            ? "bg-blue-600 border-blue-600"
                            : "bg-gray-100 border-gray-300"}
                        `}
                        >
                        <Text
                            className={
                            selected
                                ? "text-white"
                                : "text-gray-700"
                            }
                        >
                            {opt.label}
                        </Text>
                        </TouchableOpacity>
                    );
                    })}

                </View>
                </View>
            ))}

            </ScrollView>

            <View className="flex-row justify-between mt-4">

            <TouchableOpacity onPress={onClose}>
                <Text className="text-gray-500">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onApply}>
                <Text className="text-blue-600 font-bold">
                Apply Filters
                </Text>
            </TouchableOpacity>

            </View>

        </View>
        </View>
    </Modal>
);

};

export default GlobalFilterModal;
