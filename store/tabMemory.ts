import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_TAB_KEY = "last_active_tab";

export async function saveLastTab(tab: string) {
  try {
    await AsyncStorage.setItem(LAST_TAB_KEY, tab);
  } catch {
    // ignore – this should never block UX
  }
}

export async function getLastTab(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LAST_TAB_KEY);
  } catch {
    return null;
  }
}
