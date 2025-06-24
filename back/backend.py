import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

@app.route('/generate-schedule', methods=['POST'])
def generate_schedule():
    data = request.json
    daily_goal = data.get('daily_goal', '')
    long_term_goal = data.get('long_term_goal', '')
    schedule_text = data.get('schedule_text', '')
    
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

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        schedule = response.text
        return jsonify({'schedule': schedule})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate-roadmap', methods=['POST'])
def generate_roadmap():
    data = request.json
    long_term_goal = data.get('long_term_goal', '')
    
    prompt = f"""
analysis this long term goal and make a roadmap of 6 months to achieve it. make it a json object. get todays date and make the roadmap for the next 6 months. show date in the roadmap.
{long_term_goal}
"""
    
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        roadmap = response.text
        return jsonify({'roadmap': roadmap})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)