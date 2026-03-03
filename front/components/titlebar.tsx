"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Home,
  Target,
  CheckSquare,
  Calendar,
  BarChart3,
  Wind,
  Settings,
  Minimize2,
  Square,
  X
} from "lucide-react"

interface TitlebarProps {
  onNavigate: (page: string) => void
  currentPage: string
}

export function Titlebar({ onNavigate, currentPage }: TitlebarProps) {
  const [isElectron, setIsElectron] = useState(false)

  useEffect(() => {
    setIsElectron(typeof window !== 'undefined' && window.process?.type === 'renderer')
  }, [])

  const navItems = [
    { id: 'home', icon: Home, label: 'Daily Focus' },
    { id: 'habits', icon: BarChart3, label: 'Habits' },
    { id: 'roadmap', icon: Target, label: 'Roadmap' },
    { id: 'checklist', icon: CheckSquare, label: 'Goals' },
    { id: 'mindfulness', icon: Wind, label: 'Mindfulness' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
  ]

  return (
    <div className="flex items-center justify-between w-full h-16 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6" 
         style={{ WebkitAppRegion: 'drag' } as any}>
      
      {/* Left side - Logo */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-serif text-gray-900">clarity</h1>
      </div>

      {/* Center - Navigation */}
      <div className="flex items-center space-x-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigate(item.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all ${
                currentPage === item.id 
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-gray-700 border border-amber-100/50' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Right side - Window controls (only for Electron) */}
      <div className="flex items-center space-x-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <Button variant="ghost" size="sm" className="hover:bg-gray-100">
          <Settings className="w-4 h-4" />
        </Button>
        
        {isElectron && (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-gray-100"
              onClick={() => window.electronAPI?.minimize()}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-gray-100"
              onClick={() => window.electronAPI?.maximize()}
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-red-100 hover:text-red-600"
              onClick={() => window.electronAPI?.close()}
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}