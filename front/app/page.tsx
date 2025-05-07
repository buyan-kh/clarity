"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Schedule } from "@/components/schedule"
import { LongTermGoals } from "@/components/long-term-goals"

export default function Home() {
  const [input, setInput] = useState("")
  const [showSchedule, setShowSchedule] = useState(false)
  const [showLongTermGoals, setShowLongTermGoals] = useState(false)
  const [longTermGoals, setLongTermGoals] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setShowSchedule(true)
    }
  }

  const handleSaveLongTermGoals = (goals: string) => {
    setLongTermGoals(goals)
    setShowLongTermGoals(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white relative overflow-hidden">
      {/* Updated radial gradient background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(210, 235, 255, 1) 0%, rgba(245, 250, 255, 0.7) 70%, rgba(255, 255, 255, 0) 100%)",
          zIndex: 0,
        }}
      />

      <div className="w-full max-w-md px-6 py-12 relative z-10 flex flex-col items-center">
        {/* Logo - keeping serif font for the logo */}
        <h1 className="text-6xl font-serif mb-20 text-gray-900" style={{ fontFamily: "serif" }}>
          clarity
        </h1>

        <AnimatePresence mode="wait">
          {!showSchedule && !showLongTermGoals ? (
            <motion.div
              key="input-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full space-y-12"
            >
              {/* Prompt - now using Kode Mono */}
              <p className="text-center text-xl leading-relaxed text-gray-700">
                What would make today
                <br />
                meaningful for you?
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
                {/* Input box - now using Kode Mono */}
                <Input
                  type="text"
                  placeholder="type here.."
                  className="w-full h-16 px-6 rounded-full bg-gray-50 text-gray-500 text-center text-lg border-gray-100 shadow-sm focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />

                {/* Submit button - now using Kode Mono */}
                <Button
                  type="submit"
                  className="rounded-full bg-white text-gray-700 hover:bg-gray-50 px-8 py-2 shadow-sm border border-gray-100"
                >
                  Submit
                </Button>
              </form>

              {/* Secondary button - now using Kode Mono */}
              <div className="flex justify-center pt-12">
                <Button
                  variant="ghost"
                  onClick={() => setShowLongTermGoals(true)}
                  className="rounded-full px-8 py-6 bg-gradient-to-r from-amber-50 to-orange-50 text-gray-700 hover:from-amber-100 hover:to-orange-100 shadow-sm border border-amber-100/50"
                >
                  Edit Long Term
                  <br />
                  Schedule and Goals
                </Button>
              </div>
            </motion.div>
          ) : showSchedule ? (
            <motion.div
              key="schedule-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <Schedule onBack={() => setShowSchedule(false)} userInput={input} />
            </motion.div>
          ) : (
            <motion.div
              key="long-term-goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <LongTermGoals
                initialGoals={longTermGoals}
                onSave={handleSaveLongTermGoals}
                onCancel={() => setShowLongTermGoals(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
