# Airline Booking Market Demand Analyzer

This project is a Python web application built with Flask designed to simulate, process, and analyze market demand trends in the airline booking industry. It provides a user-friendly interface to filter data, visualize trends, and generate insights using the Gemini API.

## Project Structure
```
airline_trends_app/
│
├── app.py                  # Main Flask backend application
├── templates/
│   ├── index.html          # Main web interface for input, display, and charts
│   └── results.html        # Placeholder for a separate results page (currently unused)
├── static/
│   └── charts.js           # Frontend JavaScript for chart rendering and UI logic
├── data/
│   └── scraper.py          # Module for simulated data generation (placeholder for real scraping/API pulling)
├── insights/
│   └── processor.py        # Module for data cleaning, trend detection, and Gemini API integration
├── requirements.txt        # Python dependencies
└── README.md               # Project README file
```

## Features

### Core Functionality
- **Simulated Data Generation**: Generates a dataset of realistic airline booking data for demonstration purposes. This can be extended to integrate with real data sources.
- **Web App Interface**: A simple, intuitive web interface built with HTML and Tailwind CSS for filtering data and displaying results.
- **Data Processing**: Cleans and processes the data to identify popular routes and price trends over time.
- **Visualization**: Uses Chart.js to display price trends visually.
- **AI-Powered Insights**: Integrates with the Gemini API to analyze processed data and provide natural language insights on demand trends, pricing changes, and popular routes.

### Enhanced User Experience Features
- **Quick Filter Presets**: One-click buttons for common time periods (7 days, 30 days, 90 days, 1 year)
- **Data Export**: Download filtered data as CSV or JSON files for further analysis
- **Data Summary Statistics**: Real-time display of key metrics including total records, bookings, average price, and unique routes
- **Advanced Filtering**: Filter by date range, origin city, and destination city with input validation
- **Loading States**: Visual feedback during data processing with improved error handling
- **Clear Filters**: Easy reset functionality to clear all filters and return to default view
- **Responsive Charts**: Enhanced Chart.js visualizations with better tooltips and formatting

### Technical Improvements
- **Input Validation**: Date range validation and reasonable limits to prevent invalid queries
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Performance**: Optimized data processing and chart rendering
- **Accessibility**: Improved UI elements and keyboard navigation

## Setup and Installation

To set up and run this project locally, follow these steps:

### 1. Clone the repository (or create the files manually):
```bash
# If you have a git repository
git clone <your-repo-url>
cd airline_trends_app
```

If you're creating files manually, ensure the directory structure matches the outline above.

### 2. Create a Python Virtual Environment (recommended):
```bash
python -m venv venv
```

### 3. Activate the Virtual Environment:

**On Windows:**
```bash
.\venv\Scripts\activate
```

**On macOS/Linux:**
```bash
source venv/bin/activate
```

### 4. Install Dependencies:
Navigate to the airline_trends_app directory (where requirements.txt is located) and install the required Python packages:
```bash
pip install -r requirements.txt
```

### 5. Set up Gemini API Key:

1. Obtain an API key from [Google AI Studio](https://makersuite.google.com/app/apikey).
2. In `insights/processor.py`, locate the `api_key = ""` line within the `get_gemini_insights` function.
3. Replace `""` with your actual Gemini API key:
   ```python
   api_key = "YOUR_GEMINI_API_KEY_HERE"
   ```

**Note**: In the Canvas environment, the API key is handled automatically, so you might not need to set it manually there.

### 6. Run the Flask Application:
From the airline_trends_app directory, run the app.py file:
```bash
python app.py
```

The application will typically run on `http://127.0.0.1:5000/`. Open this URL in your web browser.

## Usage

### Access the Web App
Open your browser and go to the URL where the Flask app is running (e.g., `http://127.0.0.1:5000/`).

### Using the Interface

#### 1. Quick Filter Presets
- Use the "Quick Filters" buttons for instant access to common time periods
- Click any preset button to automatically set date ranges and load data

#### 2. Manual Filtering
- Use the "Start Date" and "End Date" input fields to specify a custom date range
- Enter "Origin City" and "Destination City" to filter by specific routes
- Click "Apply Filters" to process the data

#### 3. View Results
The app will display:
- **Market Insights**: AI-generated analysis of the filtered data
- **Data Summary**: Key statistics including total records, bookings, average price, and unique routes
- **Price Trends Over Time**: Interactive chart showing price fluctuations
- **Popular Routes**: Table of the most booked routes with booking counts and average prices

#### 4. Export Data
- Click "Export Data" to download the filtered dataset
- Choose between CSV or JSON format
- Files are automatically downloaded to your default download folder

#### 5. Clear Filters
- Use "Clear Filters" to reset all inputs and return to the default view

### Data Processing
When you apply filters, the app will:
1. Fetch and process the filtered data
2. Update the "Price Trends Over Time" chart
3. Populate the "Popular Routes" table
4. Update the "Data Summary" statistics
5. Send a summary of the filtered data to the Gemini API to generate natural language "Market Insights"

## Extending the Application

### Real Data Integration
Replace the `generate_simulated_data` function in `data/scraper.py` with actual data scraping logic or calls to real airline/travel APIs (e.g., Skyscanner API, Amadeus API, if licensed).

### Additional Visualizations
Add more charts using Chart.js or other libraries:
- Bar charts for demand by city
- Pie charts for origin/destination distribution
- Heatmaps for seasonal demand patterns

### Advanced Filtering
Implement more complex filtering options:
- Filter by airline
- Filter by number of passengers
- Filter by price range
- Filter by booking class

### User Authentication
Add user login/registration if you plan to store user-specific preferences or data.

### Database Integration
For persistent storage of scraped or processed data, integrate with a database (e.g., SQLite, PostgreSQL).

### Deployment
Deploy the Flask application to a cloud platform (e.g., Google Cloud Run, Heroku, AWS Elastic Beanstalk) for public access.

## Troubleshooting

### Common Issues

**Import Errors**: If you see "Import 'flask' could not be resolved":
1. Ensure your Python virtual environment is activated
2. Run `pip install -r requirements.txt` within the activated virtual environment
3. If using an IDE, ensure it's configured to use the Python interpreter from your virtual environment

**Module Import Errors**: If you see "Import 'data.scraper' or 'insights.processor' could not be resolved":
1. Ensure your current working directory is the root of your project
2. Verify that `data/__init__.py` and `insights/__init__.py` files exist
3. Run the app using `python app.py` after activating the virtual environment

**API Key Issues**: If insights are not generating:
1. Verify your Gemini API key is correctly set in `insights/processor.py`
2. Check your internet connection
3. Ensure the API key has the necessary permissions

## Contributing

Feel free to contribute to this project by:
- Adding new features
- Improving the UI/UX
- Optimizing performance
- Adding more data sources
- Enhancing the AI insights

## License

This project is open source and available under the MIT License.
