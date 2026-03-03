"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Coffee, Brain, Zap, Sun } from "lucide-react"

interface FocusPreset {
  id: string
  name: string
  focusMinutes: number
  breakMinutes: number
  sessions: number
  icon: React.ElementType
  color: string
  description: string
}

const PRESETS: FocusPreset[] = [
  {
    id: "pomodoro",
    name: "Pomodoro",
    focusMinutes: 25,
    breakMinutes: 5,
    sessions: 4,
    icon: Brain,
    color: "from-rose-400 to-pink-400",
    description: "Classic 25/5 technique for sustained productivity.",
  },
  {
    id: "deep",
    name: "Deep Work",
    focusMinutes: 50,
    breakMinutes: 10,
    sessions: 3,
    icon: Zap,
    color: "from-violet-400 to-indigo-400",
    description: "Extended sessions for complex, demanding tasks.",
  },
  {
    id: "sprint",
    name: "Quick Sprint",
    focusMinutes: 15,
    breakMinutes: 3,
    sessions: 6,
    icon: Sun,
    color: "from-amber-400 to-yellow-400",
    description: "Short bursts for when you need a quick win.",
  },
]

type TimerPhase = "focus" | "break" | "idle"

export function FocusTimer() {
  const [selectedPreset, setSelectedPreset] = useState<FocusPreset>(PRESETS[0])
  const [phase, setPhase] = useState<TimerPhase>("idle")
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [currentSession, setCurrentSession] = useState(1)
  const [isRunning, setIsRunning] = useState(false)
  const [totalFocusSeconds, setTotalFocusSeconds] = useState(0)
  const [completedSessions, setCompletedSessions] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const totalSeconds = useCallback(() => {
    if (phase === "focus") return selectedPreset.focusMinutes * 60
    if (phase === "break") return selectedPreset.breakMinutes * 60
    return selectedPreset.focusMinutes * 60
  }, [phase, selectedPreset])

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      if (phase === "focus") {
        setTotalFocusSeconds((prev) => prev + 1)
      }

      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (phase === "focus") {
            setCompletedSessions((s) => s + 1)
            if (currentSession >= selectedPreset.sessions) {
              // All sessions done
              setIsRunning(false)
              setPhase("idle")
              return 0
            }
            // Switch to break
            setPhase("break")
            return selectedPreset.breakMinutes * 60
          } else {
            // Break over, next focus session
            setCurrentSession((s) => s + 1)
            setPhase("focus")
            return selectedPreset.focusMinutes * 60
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, phase, currentSession, selectedPreset])

  const startTimer = () => {
    setPhase("focus")
    setSecondsLeft(selectedPreset.focusMinutes * 60)
    setCurrentSession(1)
    setCompletedSessions(0)
    setTotalFocusSeconds(0)
    setIsRunning(true)
  }

  const togglePause = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setPhase("idle")
    setSecondsLeft(0)
    setCurrentSession(1)
    setCompletedSessions(0)
    setTotalFocusSeconds(0)
  }

  const selectPreset = (preset: FocusPreset) => {
    resetTimer()
    setSelectedPreset(preset)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const progress = phase !== "idle" ? ((totalSeconds() - secondsLeft) / totalSeconds()) * 100 : 0

  const circumference = 2 * Math.PI * 90

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif text-gray-900">Focus</h2>
        <p className="text-gray-500">Deep work. Full presence. No distractions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preset Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Focus Modes</h3>
          {PRESETS.map((preset) => {
            const Icon = preset.icon
            return (
              <Card
                key={preset.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPreset.id === preset.id ? "ring-2 ring-blue-200 bg-blue-50/50" : "hover:bg-gray-50"
                }`}
                onClick={() => selectPreset(preset)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-1">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <h4 className="font-medium text-gray-900">{preset.name}</h4>
                  </div>
                  <p className="text-sm text-gray-500">{preset.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {preset.focusMinutes}m focus
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {preset.breakMinutes}m break
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {preset.sessions}x
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Timer Display */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center">
          <Card className="w-full">
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-[420px]">
              {phase === "idle" && completedSessions > 0 ? (
                /* Session Complete */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <Zap className="w-16 h-16 text-amber-400 mx-auto" />
                  <h3 className="text-2xl font-serif text-gray-900">Focus Complete</h3>
                  <p className="text-gray-500">
                    You focused for {formatTime(totalFocusSeconds)} across{" "}
                    {completedSessions} sessions.
                  </p>
                  <Button onClick={resetTimer} variant="outline" className="rounded-full mt-4">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Session
                  </Button>
                </motion.div>
              ) : (
                <>
                  {/* Circular Timer */}
                  <div className="relative mb-8">
                    <svg width="220" height="220" className="transform -rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="110"
                        cy="110"
                        r="90"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="8"
                      />
                      {/* Progress circle */}
                      {phase !== "idle" && (
                        <motion.circle
                          cx="110"
                          cy="110"
                          r="90"
                          fill="none"
                          stroke={phase === "focus" ? "#6366f1" : "#34d399"}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={circumference - (progress / 100) * circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{
                            strokeDashoffset: circumference - (progress / 100) * circumference,
                          }}
                          transition={{ duration: 0.5, ease: "linear" }}
                        />
                      )}
                    </svg>

                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {phase !== "idle" ? (
                        <>
                          <span className="text-4xl font-light text-gray-900 tabular-nums">
                            {formatTime(secondsLeft)}
                          </span>
                          <span className="text-sm text-gray-400 mt-1 flex items-center space-x-1">
                            {phase === "focus" ? (
                              <>
                                <Brain className="w-3.5 h-3.5" />
                                <span>Focus</span>
                              </>
                            ) : (
                              <>
                                <Coffee className="w-3.5 h-3.5" />
                                <span>Break</span>
                              </>
                            )}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-4xl font-light text-gray-300 tabular-nums">
                            {selectedPreset.focusMinutes.toString().padStart(2, "0")}:00
                          </span>
                          <span className="text-sm text-gray-400 mt-1">Ready</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Session dots */}
                  {phase !== "idle" && (
                    <div className="flex items-center space-x-2 mb-6">
                      {Array.from({ length: selectedPreset.sessions }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            i < completedSessions
                              ? "bg-indigo-400"
                              : i === currentSession - 1
                              ? phase === "focus"
                                ? "bg-indigo-200 ring-2 ring-indigo-300"
                                : "bg-emerald-200 ring-2 ring-emerald-300"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-2">
                        Session {currentSession}/{selectedPreset.sessions}
                      </span>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex items-center space-x-3">
                    {phase === "idle" ? (
                      <Button
                        onClick={startTimer}
                        className={`rounded-full px-8 py-3 bg-gradient-to-r ${selectedPreset.color} text-white hover:opacity-90 shadow-md`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Focus
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={togglePause}
                          variant="outline"
                          className="rounded-full px-6 py-3"
                        >
                          {isRunning ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Resume
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={resetTimer}
                          variant="ghost"
                          className="rounded-full px-4 py-3"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
