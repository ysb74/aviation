from datetime import datetime, timedelta
import random

def generate_simulated_data(num_records=1000):
    """
    Generates a list of simulated airline booking records.
    This function acts as a placeholder for actual data scraping or API pulling.
    """
    cities = ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra", "Hobart", "Darwin"]
    data = []
    # Data for the last 90 days from today
    start_date_range = datetime.now() - timedelta(days=90)
    end_date_range = datetime.now()

    for _ in range(num_records):
        # Random date within the last 90 days
        flight_date = start_date_range + timedelta(days=random.randint(0, (end_date_range - start_date_range).days))
        origin = random.choice(cities)
        destination = random.choice([c for c in cities if c != origin])
        base_price = random.uniform(150, 600)

        # Simulate demand-based pricing (higher prices for popular routes/dates)
        demand_factor = 1.0
        # Peak holiday months in Australia (Summer: Dec-Feb, Winter: Jun-Aug)
        if flight_date.month in [12, 1, 2, 6, 7, 8]:
            demand_factor *= random.uniform(1.1, 1.3) # Higher prices during peak seasons
        if flight_date.weekday() in [4, 5]: # Friday, Saturday (weekend travel)
            demand_factor *= random.uniform(1.05, 1.15) # Slightly higher prices on weekends

        # Simulate popularity for certain routes
        if (origin, destination) in [("Sydney", "Melbourne"), ("Melbourne", "Sydney"), ("Sydney", "Brisbane"), ("Brisbane", "Sydney")]:
            demand_factor *= random.uniform(1.1, 1.2) # Popular routes have higher base demand

        price = round(base_price * demand_factor, 2)
        bookings = random.randint(1, 10) # Number of bookings for this specific flight instance

        data.append({
            "date": flight_date.strftime("%Y-%m-%d"),
            "origin": origin,
            "destination": destination,
            "price": price,
            "bookings": bookings
        })
    return data

# Example of how you might call a real API (conceptual)
def fetch_data_from_api(api_endpoint, params):
    """
    Conceptual function to fetch data from an external API.
    In a real scenario, you'd use libraries like `requests`.
    """
    # import requests
    # response = requests.get(api_endpoint, params=params)
    # response.raise_for_status()
    # return response.json()
    print(f"Fetching data from {api_endpoint} with params {params} (conceptual).")
    return [] # Return empty for now, as this is just a placeholder
