"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"

interface LongTermGoalsProps {
  initialGoals: string
  onSave: (goals: string) => void
  onCancel: () => void
}

export function LongTermGoals({ initialGoals, onSave, onCancel }: LongTermGoalsProps) {
  const [goals, setGoals] = useState(initialGoals)

  const handleSave = () => {
    onSave(goals)
  }

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8 rounded-full mr-2">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h2 className="text-xl text-gray-800">Long Term Schedule & Goals</h2>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Define your long-term schedule and goals to help guide your daily intentions.
        </p>

        <Textarea
          placeholder="Enter your long-term schedule and goals here..."
          className="min-h-[200px] p-4 rounded-xl border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 text-gray-700"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
        />

        <div className="flex justify-end space-x-3 pt-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-full px-6 border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-full px-6 bg-gradient-to-r from-amber-50 to-orange-50 text-gray-700 hover:from-amber-100 hover:to-orange-100 border border-amber-100/50"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
