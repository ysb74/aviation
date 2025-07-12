// airline_trends_app/static/charts.js

// Global chart instance to allow destruction and re-creation
let priceChart;

/**
 * Fetches data from the backend based on current filters and renders the UI.
 */
async function fetchDataAndRender() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;

    // Show loading spinner for insights and clear previous content
    const insightsContent = document.getElementById('insightsContent');
    const insightsLoading = document.getElementById('insightsLoading');
    insightsContent.classList.add('hidden');
    insightsLoading.classList.remove('hidden');
    insightsContent.innerHTML = ''; // Clear previous insights

    try {
        // Fetch filtered data from the Flask backend
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startDate, endDate, origin, destination })
        });
        const data = await response.json();

        // Render Price Trend Chart
        renderPriceTrendChart(data.price_trends);

        // Render Popular Routes Table
        renderPopularRoutesTable(data.popular_routes);

        // Fetch insights from LLM using the filtered raw data
        const insightsResponse = await fetch('/api/insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filteredData: data.raw_data }) // Send raw data for LLM processing
        });
        const insights = await insightsResponse.json();
        insightsContent.innerHTML = `<p>${insights.text}</p>`;

    } catch (error) {
        console.error('Error fetching data or insights:', error);
        insightsContent.innerHTML = '<p class="text-red-500">Error loading data or insights. Please try again.</p>';
        // Clear charts/tables on error
        if (priceChart) priceChart.destroy();
        document.getElementById('popularRoutesTable').innerHTML = '<tr><td colspan="3" class="text-center py-4 text-gray-500">Error loading data.</td></tr>';
    } finally {
        // Hide loading spinner
        insightsContent.classList.remove('hidden');
        insightsLoading.classList.add('hidden');
    }
}

/**
 * Renders or updates the price trend chart using Chart.js.
 * @param {Array} priceTrends - An array of objects with 'date' and 'avg_price'.
 */
function renderPriceTrendChart(priceTrends) {
    const ctx = document.getElementById('priceTrendChart').getContext('2d');

    // Destroy existing chart instance if it exists to prevent memory leaks and rendering issues
    if (priceChart) {
        priceChart.destroy();
    }

    // Prepare data for Chart.js
    const labels = priceTrends.map(item => item.date);
    const data = priceTrends.map(item => item.avg_price);

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Price',
                data: data,
                borderColor: '#3b82f6', // blue-500
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allow canvas to resize freely within its container
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Average Price (AUD)'
                    },
                    beginAtZero: false // Prices don't start at zero
                }
            }
        }
    });
}

/**
 * Renders or updates the popular routes table.
 * @param {Array} popularRoutes - An array of objects with 'route', 'bookings', and 'avg_price'.
 */
function renderPopularRoutesTable(popularRoutes) {
    const tableBody = document.getElementById('popularRoutesTable');
    tableBody.innerHTML = ''; // Clear existing rows

    if (popularRoutes.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-gray-500">No popular routes found for the selected filters.</td></tr>';
        return;
    }

    popularRoutes.forEach(route => {
        const row = document.createElement('tr');
        row.classList.add('border-b', 'border-gray-200', 'hover:bg-gray-50');
        row.innerHTML = `
            <td class="py-2 px-4 text-sm text-gray-800">${route.route}</td>
            <td class="py-2 px-4 text-sm text-gray-800">${route.bookings}</td>
            <td class="py-2 px-4 text-sm text-gray-800">$${route.avg_price.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Event listener for the "Apply Filters" button
document.getElementById('applyFilters').addEventListener('click', fetchDataAndRender);

// Set default dates (e.g., last 30 days) and perform initial data load on page load
window.onload = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    document.getElementById('endDate').value = today.toISOString().split('T')[0];
    document.getElementById('startDate').value = thirtyDaysAgo.toISOString().split('T')[0];

    // Initial data load when the page loads
    fetchDataAndRender();
};
