import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

interface Habit {
  id: string;
  name: string;
  streak: number;
  target: number;
  completedToday: boolean;
  weeklyProgress: boolean[];
  category: string;
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Morning Exercise',
      streak: 5,
      target: 7,
      completedToday: false,
      weeklyProgress: [true, true, false, true, true, false, false],
      category: 'Health',
    },
    {
      id: '2',
      name: 'Leetcode Practice',
      streak: 12,
      target: 30,
      completedToday: true,
      weeklyProgress: [true, true, true, true, true, true, false],
      category: 'Learning',
    },
  ]);

  const [newHabit, setNewHabit] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleHabit = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = !habit.completedToday;
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1),
        };
      }
      return habit;
    }));
  };

  const addHabit = () => {
    if (newHabit.trim()) {
      const newHabitObj: Habit = {
        id: Date.now().toString(),
        name: newHabit,
        streak: 0,
        target: 7,
        completedToday: false,
        weeklyProgress: [false, false, false, false, false, false, false],
        category: 'Personal',
      };
      
      setHabits([...habits, newHabitObj]);
      setNewHabit('');
      setShowAddForm(false);
    }
  };

  const getDayLabels = () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Habit Tracker</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Text style={styles.addButtonText}>+ Add Habit</Text>
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Enter new habit..."
            value={newHabit}
            onChangeText={setNewHabit}
            onSubmitEditing={addHabit}
          />
          <View style={styles.formButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={addHabit}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowAddForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {habits.map((habit) => (
        <View key={habit.id} style={styles.habitCard}>
          <View style={styles.habitHeader}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                habit.completedToday ? styles.checkboxCompleted : styles.checkboxEmpty
              ]}
              onPress={() => toggleHabit(habit.id)}
            >
              {habit.completedToday && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            
            <View style={styles.habitInfo}>
              <Text style={styles.habitName}>{habit.name}</Text>
              <Text style={styles.habitStats}>
                🔥 {habit.streak} day streak • Target: {habit.target} days
              </Text>
            </View>
          </View>

          <View style={styles.weeklyProgress}>
            {getDayLabels().map((day, index) => (
              <View key={index} style={styles.dayColumn}>
                <Text style={styles.dayLabel}>{day}</Text>
                <View 
                  style={[
                    styles.dayCircle,
                    habit.weeklyProgress[index] ? styles.dayCompleted : styles.dayEmpty
                  ]}
                >
                  {habit.weeklyProgress[index] && (
                    <Text style={styles.dayCheckmark}>✓</Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.progressBar}>
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(habit.streak / habit.target) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {habit.streak}/{habit.target} days
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  addForm: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  habitCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxEmpty: {
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  checkboxCompleted: {
    borderColor: '#10b981',
    backgroundColor: '#10b981',
  },
  checkmark: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  habitStats: {
    fontSize: 14,
    color: '#6b7280',
  },
  weeklyProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  dayCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayEmpty: {
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  dayCompleted: {
    borderColor: '#10b981',
    backgroundColor: '#10b981',
  },
  dayCheckmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});