import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getUsage(date: string) {
  const raw = await AsyncStorage.getItem(`USAGE_${date}`);
  return raw ? JSON.parse(raw) : [];
}

export async function saveUsage(date: string, data: any) {
  await AsyncStorage.setItem(`USAGE_${date}`, JSON.stringify(data));
}

