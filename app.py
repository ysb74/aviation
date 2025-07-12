# airline_trends_app/app.py

# --- Troubleshooting Import Errors ---
# If you see "Import 'flask' could not be resolved":
# 1. Ensure your Python virtual environment is activated.
#    On macOS/Linux: source venv/bin/activate
#    On Windows (Cmd): venv\Scripts\activate.bat
#    On Windows (PowerShell): .\venv\Scripts\Activate.ps1
# 2. Run 'pip install -r requirements.txt' *within the activated virtual environment*.
# 3. If using an IDE (like VS Code), ensure it's configured to use the Python interpreter from your 'venv'.
#    In VS Code: Ctrl+Shift+P (Cmd+Shift+P on Mac) -> "Python: Select Interpreter" -> choose ./venv/bin/python

# If you see "Import 'data.scraper' or 'insights.processor' could not be resolved":
# 1. Ensure your current working directory in the terminal is the root of your project
#    (e.g., '/Users/yogeshsinghbisht/Documents/aviation/' if app.py is directly inside 'aviation',
#    or '/Users/yogeshsinghbisht/Documents/aviation/airline_trends_app/' if app.py is inside 'airline_trends_app').
#    The script needs to be run from a directory where 'data' and 'insights' are subdirectories.
# 2. Verify that 'data/__init__.py' and 'insights/__init__.py' files exist (even if empty).
#    The 'if __name__ == "__main__":' block below will create them if they don't.
# 3. Run the app using 'python app.py' (after activating venv), not by specifying the full path to the interpreter.
# --- End Troubleshooting Guide ---

import os
from flask import Flask, request, jsonify, render_template
from datetime import datetime, timedelta
import json

# Import functions from our modules
# These imports assume 'data' and 'insights' are subdirectories in the same location as app.py
from data.scraper import generate_simulated_data
from insights.processor import process_data_for_charts, summarize_data_for_llm, get_gemini_insights

# Initialize Flask app, specifying template and static folders relative to this script
app = Flask(__name__, template_folder='templates', static_folder='static')

# --- Global Simulated Data ---
# Generate data once when the app starts.
# In a real application, this would be replaced by a scheduled scraping/API pull.
simulated_data = generate_simulated_data(num_records=2000)
print(f"Generated {len(simulated_data)} simulated records.")

# --- Flask Routes ---
@app.route('/')
def index():
    """Renders the main HTML page."""
    return render_template('index.html')

@app.route('/api/data', methods=['POST'])
def get_filtered_data():
    """
    Filters simulated data based on user input and calculates trends for charts/tables.
    """
    filters = request.json
    start_date_str = filters.get('startDate')
    end_date_str = filters.get('endDate')
    origin_filter = filters.get('origin', '').strip().lower()
    destination_filter = filters.get('destination', '').strip().lower()

    filtered_records = []
    if start_date_str and end_date_str:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
        for record in simulated_data:
            record_date = datetime.strptime(record['date'], '%Y-%m-%d')
            if start_date <= record_date <= end_date:
                if (not origin_filter or record['origin'].lower() == origin_filter) and \
                   (not destination_filter or record['destination'].lower() == destination_filter):
                    filtered_records.append(record)
    else:
        # If no dates, return all data (or a subset)
        filtered_records = simulated_data

    # Process data using the insights processor
    price_trends, popular_routes = process_data_for_charts(filtered_records)

    return jsonify({
        "raw_data": filtered_records, # Send raw data for LLM to process
        "price_trends": price_trends,
        "popular_routes": popular_routes
    })

@app.route('/api/insights', methods=['POST'])
async def get_insights():
    """
    Processes filtered data and sends it to the Gemini API for insights.
    """
    data = request.json.get('filteredData', [])

    if not data:
        return jsonify({"text": "No data available to generate insights. Please apply filters."})

    # Summarize data using the insights processor
    summary = summarize_data_for_llm(data)

    # Get insights from Gemini
    insights_text = await get_gemini_insights(summary)

    return jsonify({"text": insights_text})

if __name__ == '__main__':
    # Ensure necessary directories exist for local development
    # These directories are expected by Flask for templates and static files,
    # and by the application for its modules.
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    os.makedirs('data', exist_ok=True)
    os.makedirs('insights', exist_ok=True)

    # Ensure __init__.py files exist to properly recognize 'data' and 'insights' as Python packages.
    # This is crucial for relative imports to work correctly.
    with open(os.path.join('data', '__init__.py'), 'a'): # 'a' creates if not exists, doesn't overwrite
        pass
    with open(os.path.join('insights', '__init__.py'), 'a'):
        pass

    # This is for local development. In a Canvas environment, the app is run differently.
    # For Canvas, the HTML is served directly by the platform, and Flask acts as an API backend.
    app.run(debug=True, port=5000)
