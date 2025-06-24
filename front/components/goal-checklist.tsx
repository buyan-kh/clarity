"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Plus,
  CheckCircle,
  Circle,
  Target,
  Calendar,
  Flag,
  Edit3,
  Trash2,
  Star
} from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  category: 'short-term' | 'medium-term' | 'long-term'
  priority: 'high' | 'medium' | 'low'
  deadline: string
  progress: number
  status: 'not-started' | 'in-progress' | 'completed' | 'paused'
  subgoals: {
    id: string
    title: string
    completed: boolean
  }[]
  createdAt: string
}

export function GoalChecklist() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Land a Software Engineering Job',
      description: 'Secure a full-time position at a tech company with competitive salary and growth opportunities',
      category: 'long-term',
      priority: 'high',
      deadline: '2025-07-01',
      progress: 35,
      status: 'in-progress',
      createdAt: '2024-12-01',
      subgoals: [
        { id: '1a', title: 'Complete 150 LeetCode problems', completed: false },
        { id: '1b', title: 'Build 3 portfolio projects', completed: false },
        { id: '1c', title: 'Update resume and LinkedIn', completed: true },
        { id: '1d', title: 'Apply to 50+ companies', completed: false },
        { id: '1e', title: 'Practice system design', completed: false },
        { id: '1f', title: 'Complete 20 mock interviews', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Master Machine Learning',
      description: 'Develop expertise in ML algorithms and build real-world projects',
      category: 'medium-term',
      priority: 'high',
      deadline: '2025-05-01',
      progress: 20,
      status: 'in-progress',
      createdAt: '2024-12-15',
      subgoals: [
        { id: '2a', title: 'Complete Andrew Ng ML course', completed: true },
        { id: '2b', title: 'Implement algorithms from scratch', completed: false },
        { id: '2c', title: 'Build 2 ML projects', completed: false },
        { id: '2d', title: 'Learn deep learning fundamentals', completed: false },
        { id: '2e', title: 'Participate in Kaggle competition', completed: false }
      ]
    },
    {
      id: '3',
      title: 'Establish Daily Routine',
      description: 'Create and maintain a productive daily schedule',
      category: 'short-term',
      priority: 'medium',
      deadline: '2025-02-01',
      progress: 70,
      status: 'in-progress',
      createdAt: '2025-01-01',
      subgoals: [
        { id: '3a', title: 'Wake up at 6:30 AM consistently', completed: true },
        { id: '3b', title: 'Exercise 5 days a week', completed: true },
        { id: '3c', title: 'Read for 30 minutes daily', completed: false },
        { id: '3d', title: 'Plan tomorrow every evening', completed: true },
        { id: '3e', title: 'Track habits daily', completed: false }
      ]
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'medium-term' as const,
    priority: 'medium' as const,
    deadline: '',
    subgoals: ['']
  })

  const toggleSubgoal = (goalId: string, subgoalId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedSubgoals = goal.subgoals.map(subgoal =>
          subgoal.id === subgoalId 
            ? { ...subgoal, completed: !subgoal.completed }
            : subgoal
        )
        const completedCount = updatedSubgoals.filter(s => s.completed).length
        const progress = Math.round((completedCount / updatedSubgoals.length) * 100)
        
        let status: Goal['status'] = goal.status
        if (progress === 100) status = 'completed'
        else if (progress > 0) status = 'in-progress'
        else status = 'not-started'
        
        return {
          ...goal,
          subgoals: updatedSubgoals,
          progress,
          status
        }
      }
      return goal
    }))
  }

  const addSubgoalField = () => {
    setNewGoal({
      ...newGoal,
      subgoals: [...newGoal.subgoals, '']
    })
  }

  const updateSubgoal = (index: number, value: string) => {
    const updatedSubgoals = [...newGoal.subgoals]
    updatedSubgoals[index] = value
    setNewGoal({ ...newGoal, subgoals: updatedSubgoals })
  }

  const removeSubgoal = (index: number) => {
    const updatedSubgoals = newGoal.subgoals.filter((_, i) => i !== index)
    setNewGoal({ ...newGoal, subgoals: updatedSubgoals })
  }

  const addGoal = () => {
    if (newGoal.title.trim() && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        priority: newGoal.priority,
        deadline: newGoal.deadline,
        progress: 0,
        status: 'not-started',
        createdAt: new Date().toISOString().split('T')[0],
        subgoals: newGoal.subgoals
          .filter(s => s.trim())
          .map((title, index) => ({
            id: `${Date.now()}_${index}`,
            title,
            completed: false
          }))
      }
      
      setGoals([...goals, goal])
      setNewGoal({
        title: '',
        description: '',
        category: 'medium-term',
        priority: 'medium',
        deadline: '',
        subgoals: ['']
      })
      setShowAddForm(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'short-term': return 'bg-green-100 text-green-800'
      case 'medium-term': return 'bg-blue-100 text-blue-800'
      case 'long-term': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-orange-100 text-orange-800'
      case 'not-started': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOverallProgress = () => {
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0)
    return goals.length > 0 ? Math.round(totalProgress / goals.length) : 0
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold">{goals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">
                  {goals.filter(g => g.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Flag className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">
                  {goals.filter(g => g.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold">{getOverallProgress()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Goal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Goals</CardTitle>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        
        {showAddForm && (
          <CardContent className="border-t">
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Goal title..."
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="rounded-full"
              />
              
              <Textarea
                placeholder="Goal description..."
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                className="rounded-lg"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                  className="rounded-full px-4 py-2 border border-gray-200"
                >
                  <option value="short-term">Short-term</option>
                  <option value="medium-term">Medium-term</option>
                  <option value="long-term">Long-term</option>
                </select>
                
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as Goal['priority'] })}
                  className="rounded-full px-4 py-2 border border-gray-200"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="rounded-full px-4 py-2 border border-gray-200"
                />
              </div>
              
              <div className="space-y-2">
                <p className="font-medium text-gray-700">Sub-goals:</p>
                {newGoal.subgoals.map((subgoal, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      placeholder={`Sub-goal ${index + 1}...`}
                      value={subgoal}
                      onChange={(e) => updateSubgoal(index, e.target.value)}
                      className="rounded-full"
                    />
                    {newGoal.subgoals.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubgoal(index)}
                        className="rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSubgoalField}
                  className="rounded-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sub-goal
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={addGoal} className="rounded-full">
                  Create Goal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="border border-gray-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                    <Badge className={getCategoryColor(goal.category)}>
                      {goal.category}
                    </Badge>
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{goal.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </span>
                    <span>{goal.subgoals.filter(s => s.completed).length}/{goal.subgoals.length} completed</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{goal.progress}%</div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <Progress value={goal.progress} className="h-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {goal.subgoals.map((subgoal) => (
                    <div
                      key={subgoal.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        subgoal.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleSubgoal(goal.id, subgoal.id)}
                    >
                      {subgoal.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      <span className={`flex-1 ${
                        subgoal.completed ? 'line-through text-green-700' : 'text-gray-700'
                      }`}>
                        {subgoal.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}