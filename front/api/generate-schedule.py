import os
import json
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
from google import genai

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            daily_goal = data.get('daily_goal', '')
            long_term_goal = data.get('long_term_goal', '')
            schedule_text = data.get('schedule_text', '')
            
            client = genai.Client(api_key=os.environ.get('GEMINI_API_KEY'))
            
            prompt = f"""
You are a productivity assistant. Generate a detailed, block-style daily schedule broken into ☀️ Morning, 🌆 Afternoon, and 🌙 Night blocks. Be really analytical about cognitive load and time needed for each task. dont show how many minutes for each task, just show the tasks and times.
If there is school, include homework time in the schedule. Include time for breakfast, lunch and dinner.

Input:
- Today's intention: "{daily_goal}"
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
            
            schedule = response.text
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response_data = json.dumps({'schedule': schedule})
            self.wfile.write(response_data.encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = json.dumps({'error': str(e)})
            self.wfile.write(error_response.encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()