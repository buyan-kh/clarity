// User data persistence utilities
export interface UserData {
  longTermGoals: string[];
  dailyGoals: string[];
  schedules: string[];
  habits: { name: string; completed: boolean; date: string }[];
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
}

const STORAGE_KEY = 'clarity-user-data';

// Get user data from localStorage
export function getUserData(): UserData {
  if (typeof window === 'undefined') return getDefaultUserData();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...getDefaultUserData(), ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load user data:', error);
  }
  
  return getDefaultUserData();
}

// Save user data to localStorage
export function saveUserData(data: Partial<UserData>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const currentData = getUserData();
    const updatedData = { ...currentData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
}

// Get default user data structure
function getDefaultUserData(): UserData {
  return {
    longTermGoals: [],
    dailyGoals: [],
    schedules: [],
    habits: [],
    preferences: {
      theme: 'system',
      notifications: true,
    },
  };
}

// Add a long-term goal
export function addLongTermGoal(goal: string): void {
  const data = getUserData();
  data.longTermGoals.push(goal);
  saveUserData(data);
}

// Add a daily goal
export function addDailyGoal(goal: string): void {
  const data = getUserData();
  data.dailyGoals.push(goal);
  saveUserData(data);
}

// Add a schedule
export function addSchedule(schedule: string): void {
  const data = getUserData();
  data.schedules.push(schedule);
  saveUserData(data);
}

// Update habit completion
export function updateHabit(name: string, completed: boolean): void {
  const data = getUserData();
  const today = new Date().toISOString().split('T')[0];
  
  // Remove any existing entry for today
  data.habits = data.habits.filter(h => !(h.name === name && h.date === today));
  
  // Add new entry
  data.habits.push({ name, completed, date: today });
  
  saveUserData(data);
}

// Get habits for today
export function getTodayHabits(): { name: string; completed: boolean }[] {
  const data = getUserData();
  const today = new Date().toISOString().split('T')[0];
  
  return data.habits.filter(h => h.date === today);
}

// Clear all user data
export function clearUserData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}