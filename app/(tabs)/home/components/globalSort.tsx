import { MODULE_SORTS, ModuleType } from "@/helpers/actionHandler.help";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  module: ModuleType;
  selected?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

const GlobalSortModal: React.FC<Props> = ({
  visible,
  module,
  selected,
  onSelect,
  onClose,
}) => {
  const config = MODULE_SORTS[module];
  if (!config) return null;

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View className="flex-1 bg-black/40 justify-end">

        <View className="bg-white rounded-t-3xl p-4">

          <Text className="text-xl font-bold mb-3 mt-3">
            {config.title}
          </Text>

          {config.options.map(opt => {
            const active = selected === opt.value;

            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => onSelect(opt.value)}
                className={`
                  p-3 rounded-xl mb-2 border
                  ${active
                    ? "bg-blue-600 border-blue-600"
                    : "bg-gray-100 border-gray-300"}
                `}
              >
                <Text className={active ? "text-white" : ""}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={onClose}
            className="mt-3 items-center"
          >
            <Text className="text-gray-500">
              Close
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default GlobalSortModal;