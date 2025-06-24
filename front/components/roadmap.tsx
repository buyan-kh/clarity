"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar,
  Target,
  CheckCircle,
  Circle,
  Clock,
  ArrowRight,
  Star,
  TrendingUp
} from "lucide-react"

interface RoadmapItem {
  id: string
  title: string
  description: string
  month: number
  monthName: string
  status: 'completed' | 'in-progress' | 'upcoming'
  progress: number
  tasks: {
    id: string
    title: string
    completed: boolean
  }[]
  category: string
  priority: 'high' | 'medium' | 'low'
}

export function Roadmap() {
  const [roadmapData, setRoadmapData] = useState<RoadmapItem[]>([
    {
      id: '1',
      title: 'Master JavaScript Fundamentals',
      description: 'Build strong foundation in ES6+, async programming, and core concepts',
      month: 1,
      monthName: 'January 2025',
      status: 'in-progress',
      progress: 65,
      category: 'Programming',
      priority: 'high',
      tasks: [
        { id: '1a', title: 'Complete ES6 features', completed: true },
        { id: '1b', title: 'Master async/await', completed: true },
        { id: '1c', title: 'Build 3 projects', completed: false },
        { id: '1d', title: 'Learn testing basics', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Data Structures & Algorithms',
      description: 'Solve 150+ LeetCode problems, focus on common patterns',
      month: 2,
      monthName: 'February 2025',
      status: 'upcoming',
      progress: 0,
      category: 'Programming',
      priority: 'high',
      tasks: [
        { id: '2a', title: 'Arrays & Strings (30 problems)', completed: false },
        { id: '2b', title: 'Linked Lists (20 problems)', completed: false },
        { id: '2c', title: 'Trees & Graphs (40 problems)', completed: false },
        { id: '2d', title: 'Dynamic Programming (25 problems)', completed: false }
      ]
    },
    {
      id: '3',
      title: 'System Design Fundamentals',
      description: 'Learn scalability, databases, and architecture patterns',
      month: 3,
      monthName: 'March 2025',
      status: 'upcoming',
      progress: 0,
      category: 'Engineering',
      priority: 'medium',
      tasks: [
        { id: '3a', title: 'Database design patterns', completed: false },
        { id: '3b', title: 'Caching strategies', completed: false },
        { id: '3c', title: 'Load balancing', completed: false },
        { id: '3d', title: 'Microservices basics', completed: false }
      ]
    },
    {
      id: '4',
      title: 'Machine Learning Basics',
      description: 'Complete ML course, implement algorithms from scratch',
      month: 4,
      monthName: 'April 2025',
      status: 'upcoming',
      progress: 0,
      category: 'AI/ML',
      priority: 'high',
      tasks: [
        { id: '4a', title: 'Linear & Logistic Regression', completed: false },
        { id: '4b', title: 'Decision Trees & Random Forest', completed: false },
        { id: '4c', title: 'Neural Networks from scratch', completed: false },
        { id: '4d', title: 'Complete 2 ML projects', completed: false }
      ]
    },
    {
      id: '5',
      title: 'Build Portfolio Projects',
      description: 'Create 3 full-stack applications showcasing different skills',
      month: 5,
      monthName: 'May 2025',
      status: 'upcoming',
      progress: 0,
      category: 'Portfolio',
      priority: 'high',
      tasks: [
        { id: '5a', title: 'E-commerce platform', completed: false },
        { id: '5b', title: 'Real-time chat app', completed: false },
        { id: '5c', title: 'Data visualization dashboard', completed: false },
        { id: '5d', title: 'Deploy all projects', completed: false }
      ]
    },
    {
      id: '6',
      title: 'Interview Preparation',
      description: 'Mock interviews, resume optimization, job applications',
      month: 6,
      monthName: 'June 2025',
      status: 'upcoming',
      progress: 0,
      category: 'Career',
      priority: 'high',
      tasks: [
        { id: '6a', title: 'Update resume & LinkedIn', completed: false },
        { id: '6b', title: '20 mock interviews', completed: false },
        { id: '6c', title: 'Apply to 50 positions', completed: false },
        { id: '6d', title: 'Prepare behavioral questions', completed: false }
      ]
    }
  ])

  const toggleTask = (roadmapId: string, taskId: string) => {
    setRoadmapData(roadmapData.map(item => {
      if (item.id === roadmapId) {
        const updatedTasks = item.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
        const completedTasks = updatedTasks.filter(task => task.completed).length
        const newProgress = Math.round((completedTasks / updatedTasks.length) * 100)
        
        let newStatus: 'completed' | 'in-progress' | 'upcoming' = item.status
        if (newProgress === 100) newStatus = 'completed'
        else if (newProgress > 0) newStatus = 'in-progress'
        else newStatus = 'upcoming'
        
        return {
          ...item,
          tasks: updatedTasks,
          progress: newProgress,
          status: newStatus
        }
      }
      return item
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'upcoming': return 'bg-gray-100 text-gray-800'
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

  const getOverallProgress = () => {
    const totalProgress = roadmapData.reduce((sum, item) => sum + item.progress, 0)
    return Math.round(totalProgress / roadmapData.length)
  }

  const getCompletedMilestones = () => {
    return roadmapData.filter(item => item.status === 'completed').length
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold">{getOverallProgress()}%</p>
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
                <p className="text-2xl font-bold">{getCompletedMilestones()}/{roadmapData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Timeline</p>
                <p className="text-2xl font-bold">6 Months</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>6-Month Learning Roadmap</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Overall Progress</span>
              <span>{getOverallProgress()}% Complete</span>
            </div>
            <Progress value={getOverallProgress()} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Timeline */}
      <div className="space-y-6">
        {roadmapData.map((item, index) => (
          <Card key={item.id} className={`border-l-4 ${
            item.status === 'completed' ? 'border-l-green-500' :
            item.status === 'in-progress' ? 'border-l-blue-500' :
            'border-l-gray-300'
          }`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('-', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority} priority
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{item.monthName}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{item.category}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{item.progress}%</div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2 mb-4">
                <Progress value={item.progress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {item.tasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      task.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => toggleTask(item.id, task.id)}
                  >
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className={`flex-1 ${
                      task.completed ? 'line-through text-green-700' : 'text-gray-700'
                    }`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}