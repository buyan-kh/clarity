"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  Check, 
  X, 
  Flame, 
  Calendar,
  Target,
  TrendingUp
} from "lucide-react"

interface Habit {
  id: string
  name: string
  streak: number
  target: number
  completedToday: boolean
  weeklyProgress: boolean[]
  category: string
  color: string
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
      color: 'bg-green-100 text-green-800'
    },
    {
      id: '2',
      name: 'Leetcode Practice',
      streak: 12,
      target: 30,
      completedToday: true,
      weeklyProgress: [true, true, true, true, true, true, false],
      category: 'Learning',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: '3',
      name: 'Read 30 minutes',
      streak: 3,
      target: 14,
      completedToday: false,
      weeklyProgress: [false, true, true, true, false, false, false],
      category: 'Learning',
      color: 'bg-purple-100 text-purple-800'
    }
  ])
  
  const [newHabit, setNewHabit] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const toggleHabit = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = !habit.completedToday
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        }
      }
      return habit
    }))
  }

  const addHabit = () => {
    if (newHabit.trim()) {
      const colors = [
        'bg-green-100 text-green-800',
        'bg-blue-100 text-blue-800',
        'bg-purple-100 text-purple-800',
        'bg-orange-100 text-orange-800',
        'bg-pink-100 text-pink-800'
      ]
      
      const newHabitObj: Habit = {
        id: Date.now().toString(),
        name: newHabit,
        streak: 0,
        target: 7,
        completedToday: false,
        weeklyProgress: [false, false, false, false, false, false, false],
        category: 'Personal',
        color: colors[Math.floor(Math.random() * colors.length)]
      }
      
      setHabits([...habits, newHabitObj])
      setNewHabit('')
      setShowAddForm(false)
    }
  }

  const getWeeklyCompletionRate = () => {
    const totalDays = habits.length * 7
    const completedDays = habits.reduce((sum, habit) => 
      sum + habit.weeklyProgress.filter(Boolean).length, 0
    )
    return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0
  }

  const getDayLabels = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const today = new Date().getDay()
    return days.map((day, index) => ({
      label: day,
      isToday: index === (today === 0 ? 6 : today - 1)
    }))
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Longest Streak</p>
                <p className="text-2xl font-bold">{Math.max(...habits.map(h => h.streak))} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Today's Progress</p>
                <p className="text-2xl font-bold">
                  {habits.filter(h => h.completedToday).length}/{habits.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Weekly Rate</p>
                <p className="text-2xl font-bold">{getWeeklyCompletionRate()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Habit */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Habits</CardTitle>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="rounded-full"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="flex space-x-2 mb-6">
              <Input
                placeholder="Enter new habit..."
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                className="rounded-full"
              />
              <Button onClick={addHabit} className="rounded-full">
                <Check className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Habits List */}
          <div className="space-y-4">
            {habits.map((habit) => (
              <Card key={habit.id} className="border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant={habit.completedToday ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleHabit(habit.id)}
                        className={`rounded-full w-10 h-10 p-0 ${
                          habit.completedToday 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'border-2 border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {habit.completedToday && <Check className="w-4 h-4 text-white" />}
                      </Button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{habit.name}</h3>
                          <Badge className={habit.color}>{habit.category}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-600">
                            🔥 {habit.streak} day streak
                          </p>
                          <p className="text-sm text-gray-600">
                            Target: {habit.target} days
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Weekly Progress */}
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {getDayLabels().map((day, index) => (
                          <div key={index} className="text-center">
                            <p className={`text-xs mb-1 ${day.isToday ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                              {day.label}
                            </p>
                            <div 
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                habit.weeklyProgress[index]
                                  ? 'bg-green-500 border-green-500'
                                  : day.isToday
                                  ? 'border-blue-400 bg-blue-50'
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              {habit.weeklyProgress[index] && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress to target</span>
                      <span>{habit.streak}/{habit.target} days</span>
                    </div>
                    <Progress 
                      value={(habit.streak / habit.target) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}