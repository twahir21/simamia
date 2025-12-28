import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';


export default function App() {
    const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null; // or splash screen
  }
  return (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>BlackCoder</Text>
        <Text style={styles.subtitle}>
          My journey into mobile app development starts here.
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Coming Soon</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold', 
  },
  subtitle: {
    fontSize: 16,
    color: '#dcdcdc',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Poppins_400Regular',  

  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: '#2c5364',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: '600',
  },
});
