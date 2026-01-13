import AsyncStorage from '@react-native-async-storage/async-storage';

export const getItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error('Error reading AsyncStorage', err);
    return null;
  }
};

export const setItem = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error writing AsyncStorage', err);
  }
};
