"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Wind, Brain } from "lucide-react"
import { Breathwork } from "@/components/breathwork"
import { FocusTimer } from "@/components/focus-timer"

type MindfulnessTab = "breathwork" | "focus"

export function Mindfulness() {
  const [activeTab, setActiveTab] = useState<MindfulnessTab>("breathwork")

  const tabs = [
    { id: "breathwork" as const, label: "Breathwork", icon: Wind },
    { id: "focus" as const, label: "Focus", icon: Brain },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tab Bar */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-6 py-2 transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 border border-blue-100/50 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "breathwork" ? <Breathwork /> : <FocusTimer />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
