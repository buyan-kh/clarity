"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface ScheduleProps {
  onBack: () => void
  userInput: string
}

export function Schedule({ onBack, userInput }: ScheduleProps) {
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 rounded-full mr-2">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h2 className="text-xl text-gray-800">Your Daily Schedule</h2>
      </div>

      {userInput && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700">Today's intention: {userInput}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium text-gray-800">☀️ Morning Block</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="p-2 bg-gray-50 rounded-md">7:30–8:00 Wake up, water, light, stretch</li>
            <li className="p-2 bg-gray-50 rounded-md">8:00–8:30 Leetcode (fresh brain = best time for this)</li>
            <li className="p-2 bg-gray-50 rounded-md">8:30–9:00 – Breakfast, light break</li>
            <li className="p-2 bg-gray-50 rounded-md">9:00–9:30 – ML Learning</li>
            <li className="p-2 bg-gray-50 rounded-md">9:30–9:40 – Prep and leave for class</li>
            <li className="p-2 bg-gray-50 rounded-md">9:40–13:20 – Class + Commute</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-gray-800">🌆 Afternoon Block</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="p-2 bg-gray-50 rounded-md">13:20–14:00 – Lunch, decompress</li>
            <li className="p-2 bg-gray-50 rounded-md">14:00–15:00 – Homework (main session)</li>
            <li className="p-2 bg-gray-50 rounded-md">15:00–15:15 – Short break (walk/stretch)</li>
            <li className="p-2 bg-gray-50 rounded-md">15:15–16:15 – School work second session</li>
            <li className="p-2 bg-gray-50 rounded-md">16:15–16:45 – Open buffer (overflow homework)</li>
            <li className="p-2 bg-gray-50 rounded-md">17:00–19:00 – Free time / hang out / eat</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-gray-800">🌙 Night Block</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="p-2 bg-gray-50 rounded-md">
              19:00–20:00 – Optional: Catch up ML, read paper, polish project
            </li>
            <li className="p-2 bg-gray-50 rounded-md">20:00–22:00 – Totally off / entertainment / chill</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          onClick={onBack}
          className="rounded-full bg-white text-gray-700 hover:bg-gray-50 px-8 py-2 shadow-sm border border-gray-100"
        >
          Back to Input
        </Button>
      </div>
    </div>
  )
}
