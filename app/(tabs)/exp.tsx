import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar, X } from 'lucide-react-native';

const ExpiryDatePicker = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // 1. If user hits 'Cancel' on Android
    if (event.type === 'dismissed') {
      setShow(false);
      return;
    }

    if (Platform.OS === 'android') setShow(false);

    if (selectedDate) {
      setDate(selectedDate);
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setFormattedDate(`${year}-${month}-${day}`);
    }
  };

  const clearDate = () => {
    setFormattedDate(null); // Resets the display
    setDate(new Date());    // Resets the internal picker state
  };

  return (
    <View className="p-4 mt-8">
      <Text className="text-slate-700 font-bold mb-2">Product Expiry Date (Optional)</Text>
      
      <View className="flex-row items-center">
        <TouchableOpacity 
          onPress={() => setShow(true)}
          className={`flex-row items-center bg-white border p-4 rounded-xl shadow-sm flex-1 ${
            formattedDate ? 'border-blue-500' : 'border-slate-300'
          }`}
        >
          <Calendar size={20} color={formattedDate ? "#2563eb" : "#64748b"} />
          <Text className={`ml-3 font-medium ${formattedDate ? 'text-slate-800' : 'text-slate-400'}`}>
            {formattedDate || 'No Expiry Set'}
          </Text>
        </TouchableOpacity>

        {/* RESET BUTTON - Only shows if a date is selected */}
        {formattedDate && (
          <TouchableOpacity 
            onPress={clearDate}
            className="ml-2 bg-red-50 p-4 rounded-xl border border-red-100"
          >
            <X size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};

export default ExpiryDatePicker