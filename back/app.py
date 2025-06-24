from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["*"])

@app.route('/')
def home():
    return jsonify({
        'status': 'healthy', 
        'message': 'Clarity backend is running',
        'endpoints': ['/generate-schedule', '/generate-roadmap']
    })

@app.route('/generate-schedule', methods=['POST'])
def generate_schedule():
    try:
        data = request.get_json()
        daily_goal = data.get('daily_goal', '')
        long_term_goal = data.get('long_term_goal', '')
        schedule_text = data.get('schedule_text', '')
        
        # Initialize Gemini client
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
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

        response = model.generate_content(prompt)
        
        return jsonify({'schedule': response.text})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate-roadmap', methods=['POST'])
def generate_roadmap():
    try:
        data = request.get_json()
        long_term_goal = data.get('long_term_goal', '')
        
        # Initialize Gemini client
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        prompt = f"""
analysis this long term goal and make a roadmap of 6 months to achieve it. make it a json object. get todays date and make the roadmap for the next 6 months. show date in the roadmap.
{long_term_goal}
"""
        
        response = model.generate_content(prompt)
        
        return jsonify({'roadmap': response.text})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002) 