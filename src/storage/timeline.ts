import AsyncStorage from '@react-native-async-storage/async-storage';

const START_DATE_KEY = 'WATCHER_START_DATE';

// call ONCE when user starts
export async function setStartDate(date: string) {
  await AsyncStorage.setItem(START_DATE_KEY, date);
}

export async function getStartDate() {
  return AsyncStorage.getItem(START_DATE_KEY);
}

// generate all dates from start → today
export async function getAllDates(): Promise<string[]> {
  const start = await getStartDate();
  if (!start) return [];

  const startDate = new Date(start);
  const today = new Date();

  const dates: string[] = [];

  const current = new Date(startDate);
  while (current <= today) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates.reverse(); // latest first
}

