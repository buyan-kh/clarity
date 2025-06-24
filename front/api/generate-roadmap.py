import os
import json
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
import google.generativeai as genai

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            long_term_goal = data.get('long_term_goal', '')
            
            # Initialize Gemini client
            genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            
            prompt = f"""
analysis this long term goal and make a roadmap of 6 months to achieve it. make it a json object. get todays date and make the roadmap for the next 6 months. show date in the roadmap.
{long_term_goal}
"""
            
            response = model.generate_content(prompt)
            
            roadmap = response.text
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response_data = json.dumps({'roadmap': roadmap})
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