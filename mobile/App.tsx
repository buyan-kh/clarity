import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { HabitTracker } from './src/components/HabitTracker';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [dailyGoal, setDailyGoal] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);

  const handleSubmit = () => {
    if (dailyGoal.trim()) {
      setShowSchedule(true);
    }
  };

  const renderNavigation = () => (
    <View style={styles.navigation}>
      <TouchableOpacity
        style={[styles.navButton, currentPage === 'home' && styles.navButtonActive]}
        onPress={() => setCurrentPage('home')}
      >
        <Text style={[styles.navText, currentPage === 'home' && styles.navTextActive]}>
          Daily
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.navButton, currentPage === 'habits' && styles.navButtonActive]}
        onPress={() => setCurrentPage('habits')}
      >
        <Text style={[styles.navText, currentPage === 'habits' && styles.navTextActive]}>
          Habits
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.navButton, currentPage === 'roadmap' && styles.navButtonActive]}
        onPress={() => setCurrentPage('roadmap')}
      >
        <Text style={[styles.navText, currentPage === 'roadmap' && styles.navTextActive]}>
          Roadmap
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.navButton, currentPage === 'goals' && styles.navButtonActive]}
        onPress={() => setCurrentPage('goals')}
      >
        <Text style={[styles.navText, currentPage === 'goals' && styles.navTextActive]}>
          Goals
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderHome = () => (
    <View style={styles.homeContainer}>
      <Text style={styles.logo}>clarity</Text>
      
      <Text style={styles.prompt}>
        What would make today{'\n'}meaningful for you?
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="type here.."
          placeholderTextColor="#9ca3af"
          value={dailyGoal}
          onChangeText={setDailyGoal}
          onSubmitEditing={handleSubmit}
          multiline
        />
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      
      {showSchedule && (
        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleTitle}>Today's Schedule</Text>
          <Text style={styles.intentionText}>Today's intention: {dailyGoal}</Text>
          
          <View style={styles.scheduleSection}>
            <Text style={styles.sectionTitle}>☀️ Morning Block</Text>
            <Text style={styles.scheduleItem}>7:30–8:00 Wake up, stretch, water</Text>
            <Text style={styles.scheduleItem}>8:00–8:30 Leetcode (fresh brain)</Text>
            <Text style={styles.scheduleItem}>8:30–9:00 Breakfast, light break</Text>
            <Text style={styles.scheduleItem}>9:00–9:30 ML Learning</Text>
          </View>
          
          <View style={styles.scheduleSection}>
            <Text style={styles.sectionTitle}>🌆 Afternoon Block</Text>
            <Text style={styles.scheduleItem}>13:20–14:00 Lunch, decompress</Text>
            <Text style={styles.scheduleItem}>14:00–15:00 Homework (main session)</Text>
            <Text style={styles.scheduleItem}>15:00–15:15 Short break (walk/stretch)</Text>
          </View>
          
          <View style={styles.scheduleSection}>
            <Text style={styles.sectionTitle}>🌙 Night Block</Text>
            <Text style={styles.scheduleItem}>19:00–20:00 Optional: Catch up ML</Text>
            <Text style={styles.scheduleItem}>20:00–22:00 Totally off / entertainment</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'habits':
        return <HabitTracker />;
      case 'roadmap':
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Roadmap feature coming soon...</Text>
          </View>
        );
      case 'goals':
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Goals feature coming soon...</Text>
          </View>
        );
      default:
        return renderHome();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {renderNavigation()}
      
      <View style={styles.content}>
        {renderCurrentPage()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navigation: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
  },
  navButtonActive: {
    backgroundColor: '#3b82f6',
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  navTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logo: {
    fontSize: 48,
    fontFamily: 'serif',
    marginBottom: 60,
    color: '#1f2937',
  },
  prompt: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 30,
    color: '#374151',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  input: {
    width: '100%',
    minHeight: 60,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
    textAlign: 'center',
    color: '#374151',
  },
  submitButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  scheduleContainer: {
    marginTop: 32,
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  intentionText: {
    fontSize: 14,
    color: '#1d4ed8',
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  scheduleSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  scheduleItem: {
    fontSize: 14,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#6b7280',
  },
});