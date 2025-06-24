"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

interface ScheduleProps {
  onBack: () => void;
  userInput: string;
  longTermGoals?: string;
}

export function Schedule({ onBack, userInput, longTermGoals }: ScheduleProps) {
  const [schedule, setSchedule] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    generateSchedule();
  }, [userInput, longTermGoals]);

  const generateSchedule = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Sending request to backend...");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";
      const response = await fetch(`${apiUrl}/generate-schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          daily_goal: userInput,
          long_term_goal: longTermGoals || "",
          schedule_text: longTermGoals || "",
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      setSchedule(data.schedule);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate schedule";
      setError(errorMessage);
      console.error("Schedule generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const parseSchedule = (scheduleText: string) => {
    const sections = scheduleText.split(/(?=☀️|🌆|🌙)/);
    return sections.filter((section) => section.trim());
  };

  const renderScheduleSection = (section: string) => {
    const lines = section.split("\n").filter((line) => line.trim());
    const title = lines[0];
    const items = lines.slice(1);

    return (
      <div key={title} className="space-y-2">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {items.map((item, index) => (
            <li key={index} className="p-2 bg-gray-50 rounded-md">
              {item.trim()}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8 rounded-full mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h2 className="text-xl text-gray-800">Your Daily Schedule</h2>
      </div>

      {userInput && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700">
            Today's intention: {userInput}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">
            Generating your personalized schedule...
          </div>
        </div>
      ) : error ? (
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm text-red-700">Error: {error}</p>
          </div>
          <Button
            onClick={generateSchedule}
            className="rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 px-6 py-2"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {parseSchedule(schedule).map((section) =>
            renderScheduleSection(section)
          )}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Button
          onClick={onBack}
          className="rounded-full bg-white text-gray-700 hover:bg-gray-50 px-8 py-2 shadow-sm border border-gray-100"
        >
          Back to Input
        </Button>
      </div>
    </div>
  );
}
