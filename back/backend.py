from google import genai

client = genai.Client(api_key="AIzaSyBe08bljRDvLMoV2sHGnLKd4kWsh6L_w2w")


daily_goal = "Finish ML homework and stay consistent with trading research."
schedule_text = "i have school between 10am - 1pm, my commute to school is 20 minutes, i want to exercise around 45 minutes daily, i have dinner around 6pm"
long_term_goal = "my long term goal is to become very good at leetcode and ml"

prompt = f"""
You are a productivity assistant. Generate a detailed, block-style daily schedule broken into ☀️ Morning, 🌆 Afternoon, and 🌙 Night blocks. Be really analytical about cognitive load and time needed for each task. dont show how many minutes for each task, just show the tasks and times.
If there is school, include homework time in the schedule. Include time for breakfast, lunch and dinner.

Input:
- Today’s intention: "{daily_goal}"
- Long-term goals: {long_term_goal}
 and schedules:
{schedule_text}
If long-term goals and schedules are not provided, make a schedule for the day based on the daily goal. Also if theres given time schedule already in the input, put that in the schedule.
this is a roadmap of 6 months to achieve the long term goal: {long_term_goal}
include tasks from this roadmap in the schedule.

Output:
- A realistic schedule from 7:30 AM to 10:30 PM
- Prioritize deep thinking tasks in the morning (e.g., Leetcode, ML)
- Add light tasks or overflow buffer in the afternoon
- Keep evenings lighter, for review or relaxation
- Include breaks, commute, and meal times
- Format:
  ☀️ Morning Block
  7:30–8:00 Wake up, stretch, water
  8:00–8:30 Leetcode (fresh brain)
  ...

Do not include any explanations. Only return the structured plan."""

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=prompt
)

a = response.text

print(a)

prompt1 = f"""
analysis this long term goal and make a roadmap of 6 months to achieve it. make it a json object. get todays date and make the roadmap for the next 6 months. show date in the roadmap.
{long_term_goal}
"""

response1 = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=prompt1
)

print(response1.text)