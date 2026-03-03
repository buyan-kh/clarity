"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, Wind, Timer, Heart } from "lucide-react"

interface BreathingPattern {
  id: string
  name: string
  description: string
  inhale: number
  hold1: number
  exhale: number
  hold2: number
  color: string
  rounds: number
}

const PATTERNS: BreathingPattern[] = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal counts for calm focus. Used by Navy SEALs.",
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    color: "from-blue-400 to-cyan-400",
    rounds: 6,
  },
  {
    id: "478",
    name: "4-7-8 Relaxing",
    description: "Deep relaxation technique by Dr. Andrew Weil.",
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    color: "from-indigo-400 to-purple-400",
    rounds: 4,
  },
  {
    id: "calm",
    name: "Deep Calm",
    description: "Extended exhale to activate the parasympathetic nervous system.",
    inhale: 4,
    hold1: 2,
    exhale: 6,
    hold2: 2,
    color: "from-teal-400 to-emerald-400",
    rounds: 5,
  },
  {
    id: "energize",
    name: "Energize",
    description: "Short, powerful breaths to boost alertness and energy.",
    inhale: 3,
    hold1: 1,
    exhale: 3,
    hold2: 1,
    color: "from-amber-400 to-orange-400",
    rounds: 8,
  },
]

type Phase = "inhale" | "hold1" | "exhale" | "hold2"

const PHASE_LABELS: Record<Phase, string> = {
  inhale: "Breathe In",
  hold1: "Hold",
  exhale: "Breathe Out",
  hold2: "Hold",
}

export function Breathwork() {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(PATTERNS[0])
  const [isRunning, setIsRunning] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<Phase>("inhale")
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [isComplete, setIsComplete] = useState(false)
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const getPhaseSequence = useCallback((): { phase: Phase; duration: number }[] => {
    const seq: { phase: Phase; duration: number }[] = [
      { phase: "inhale", duration: selectedPattern.inhale },
    ]
    if (selectedPattern.hold1 > 0) seq.push({ phase: "hold1", duration: selectedPattern.hold1 })
    seq.push({ phase: "exhale", duration: selectedPattern.exhale })
    if (selectedPattern.hold2 > 0) seq.push({ phase: "hold2", duration: selectedPattern.hold2 })
    return seq
  }, [selectedPattern])

  const getNextPhase = useCallback((): { phase: Phase; duration: number; newRound: boolean; finished: boolean } => {
    const seq = getPhaseSequence()
    const currentIndex = seq.findIndex((s) => s.phase === currentPhase)
    const nextIndex = currentIndex + 1

    if (nextIndex < seq.length) {
      return { phase: seq[nextIndex].phase, duration: seq[nextIndex].duration, newRound: false, finished: false }
    }

    // End of sequence, next round
    if (currentRound >= selectedPattern.rounds) {
      return { phase: "inhale", duration: 0, newRound: false, finished: true }
    }

    return { phase: seq[0].phase, duration: seq[0].duration, newRound: true, finished: false }
  }, [currentPhase, currentRound, selectedPattern, getPhaseSequence])

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setTotalSessionSeconds((prev) => prev + 1)
      setPhaseTimeLeft((prev) => {
        if (prev <= 1) {
          const next = getNextPhase()
          if (next.finished) {
            setIsRunning(false)
            setIsComplete(true)
            return 0
          }
          setCurrentPhase(next.phase)
          if (next.newRound) setCurrentRound((r) => r + 1)
          return next.duration
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, getNextPhase])

  const startSession = () => {
    const seq = getPhaseSequence()
    setCurrentPhase(seq[0].phase)
    setPhaseTimeLeft(seq[0].duration)
    setCurrentRound(1)
    setIsComplete(false)
    setTotalSessionSeconds(0)
    setIsRunning(true)
  }

  const togglePause = () => {
    setIsRunning(!isRunning)
  }

  const resetSession = () => {
    setIsRunning(false)
    setCurrentPhase("inhale")
    setPhaseTimeLeft(0)
    setCurrentRound(1)
    setIsComplete(false)
    setTotalSessionSeconds(0)
  }

  const selectPattern = (pattern: BreathingPattern) => {
    resetSession()
    setSelectedPattern(pattern)
  }

  const getCircleScale = () => {
    if (!isRunning && !isComplete) return 1
    if (currentPhase === "inhale") return 1.6
    if (currentPhase === "exhale") return 0.8
    return currentPhase === "hold1" ? 1.6 : 0.8
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const getTotalSessionTime = () => {
    const seq = getPhaseSequence()
    const roundDuration = seq.reduce((sum, s) => sum + s.duration, 0)
    return roundDuration * selectedPattern.rounds
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif text-gray-900">Breathwork</h2>
        <p className="text-gray-500">Find your rhythm. Calm your mind.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pattern Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Breathing Patterns</h3>
          {PATTERNS.map((pattern) => (
            <Card
              key={pattern.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPattern.id === pattern.id ? "ring-2 ring-blue-200 bg-blue-50/50" : "hover:bg-gray-50"
              }`}
              onClick={() => selectPattern(pattern)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">{pattern.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {pattern.inhale}-{pattern.hold1}-{pattern.exhale}
                    {pattern.hold2 > 0 ? `-${pattern.hold2}` : ""}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{pattern.description}</p>
                <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Timer className="w-3 h-3" />
                    <span>{formatTime(getTotalPatternTime(pattern))}</span>
                  </span>
                  <span>{pattern.rounds} rounds</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Breathing Visualization */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center">
          <Card className="w-full">
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-[420px]">
              {isComplete ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <Heart className="w-16 h-16 text-rose-400 mx-auto" />
                  <h3 className="text-2xl font-serif text-gray-900">Session Complete</h3>
                  <p className="text-gray-500">
                    You breathed mindfully for {formatTime(totalSessionSeconds)}.
                  </p>
                  <p className="text-gray-500">
                    {selectedPattern.rounds} rounds of {selectedPattern.name}
                  </p>
                  <Button onClick={resetSession} variant="outline" className="rounded-full mt-4">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Again
                  </Button>
                </motion.div>
              ) : (
                <>
                  {/* Animated breathing circle */}
                  <div className="relative flex items-center justify-center mb-8">
                    {/* Outer glow ring */}
                    <motion.div
                      className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${selectedPattern.color} opacity-10`}
                      animate={{
                        scale: isRunning ? getCircleScale() * 1.15 : 1.1,
                      }}
                      transition={{
                        duration: selectedPattern[currentPhase] || 4,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Main circle */}
                    <motion.div
                      className={`relative w-44 h-44 rounded-full bg-gradient-to-br ${selectedPattern.color} flex items-center justify-center shadow-lg`}
                      animate={{
                        scale: isRunning ? getCircleScale() : 1,
                      }}
                      transition={{
                        duration: selectedPattern[currentPhase] || 4,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="text-center text-white">
                        {isRunning ? (
                          <>
                            <p className="text-2xl font-light">{phaseTimeLeft}</p>
                            <p className="text-sm opacity-80 mt-1">{PHASE_LABELS[currentPhase]}</p>
                          </>
                        ) : (
                          <Wind className="w-10 h-10 opacity-80" />
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Session info */}
                  {isRunning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center mb-6 space-y-1"
                    >
                      <p className="text-sm text-gray-500">
                        Round {currentRound} of {selectedPattern.rounds}
                      </p>
                      <p className="text-xs text-gray-400">{formatTime(totalSessionSeconds)} elapsed</p>
                    </motion.div>
                  )}

                  {!isRunning && phaseTimeLeft === 0 && (
                    <div className="text-center mb-6">
                      <p className="text-lg text-gray-700 font-medium">{selectedPattern.name}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {selectedPattern.rounds} rounds &middot; ~{formatTime(getTotalPatternTime(selectedPattern))}
                      </p>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex items-center space-x-3">
                    {!isRunning && phaseTimeLeft === 0 ? (
                      <Button
                        onClick={startSession}
                        className={`rounded-full px-8 py-3 bg-gradient-to-r ${selectedPattern.color} text-white hover:opacity-90 shadow-md`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Begin
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
                          onClick={resetSession}
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

function getTotalPatternTime(pattern: BreathingPattern): number {
  const roundDuration = pattern.inhale + pattern.hold1 + pattern.exhale + pattern.hold2
  return roundDuration * pattern.rounds
}
