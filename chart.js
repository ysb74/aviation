// airline_trends_app/static/charts.js

// Global chart instance to allow destruction and re-creation
let priceChart;

/**
 * Shows loading state for the entire application
 */
function showLoadingState() {
    const applyButton = document.getElementById('applyFilters');
    const originalText = applyButton.textContent;
    applyButton.textContent = 'Loading...';
    applyButton.disabled = true;
    applyButton.classList.add('opacity-50');
    
    // Show loading spinner for insights and clear previous content
    const insightsContent = document.getElementById('insightsContent');
    const insightsLoading = document.getElementById('insightsLoading');
    insightsContent.classList.add('hidden');
    insightsLoading.classList.remove('hidden');
    insightsContent.innerHTML = ''; // Clear previous insights
    
    return originalText;
}

/**
 * Hides loading state and restores button
 */
function hideLoadingState(originalText) {
    const applyButton = document.getElementById('applyFilters');
    applyButton.textContent = originalText;
    applyButton.disabled = false;
    applyButton.classList.remove('opacity-50');
    
    // Hide loading spinner
    const insightsContent = document.getElementById('insightsContent');
    const insightsLoading = document.getElementById('insightsLoading');
    insightsContent.classList.remove('hidden');
    insightsLoading.classList.add('hidden');
}

/**
 * Fetches data from the backend based on current filters and renders the UI.
 */
async function fetchDataAndRender() {
    const originalText = showLoadingState();

    try {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const origin = document.getElementById('origin').value;
        const destination = document.getElementById('destination').value;

        // Validate date inputs
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (start > end) {
                throw new Error('Start date cannot be after end date');
            }
            
            // Check if date range is reasonable (not more than 2 years)
            const daysDiff = (end - start) / (1000 * 60 * 60 * 24);
            if (daysDiff > 730) {
                throw new Error('Date range cannot exceed 2 years');
            }
        }

        // Fetch filtered data from the Flask backend
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startDate, endDate, origin, destination })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        // Render Price Trend Chart
        renderPriceTrendChart(data.price_trends);

        // Render Popular Routes Table
        renderPopularRoutesTable(data.popular_routes);

        // Update data summary statistics
        updateDataSummary(data.raw_data);

        // Fetch insights from LLM using the filtered raw data
        const insightsResponse = await fetch('/api/insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filteredData: data.raw_data }) // Send raw data for LLM processing
        });
        
        if (!insightsResponse.ok) {
            throw new Error(`Insights HTTP error! status: ${insightsResponse.status}`);
        }
        
        const insights = await insightsResponse.json();
        const insightsContent = document.getElementById('insightsContent');
        insightsContent.innerHTML = `<p>${insights.text}</p>`;

    } catch (error) {
        console.error('Error fetching data or insights:', error);
        const insightsContent = document.getElementById('insightsContent');
        insightsContent.innerHTML = `<p class="text-red-500">Error loading data or insights: ${error.message}. Please try again.</p>`;
        // Clear charts/tables on error
        if (priceChart) priceChart.destroy();
        document.getElementById('popularRoutesTable').innerHTML = '<tr><td colspan="3" class="text-center py-4 text-gray-500">Error loading data.</td></tr>';
    } finally {
        hideLoadingState(originalText);
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
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allow canvas to resize freely within its container
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Average Price: $${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Average Price (AUD)'
                    },
                    beginAtZero: false, // Prices don't start at zero
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
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

/**
 * Updates the data summary statistics displayed in the UI.
 * @param {Array} rawData - The raw data fetched from the backend.
 */
function updateDataSummary(rawData) {
    if (!rawData || rawData.length === 0) {
        document.getElementById('totalRecords').textContent = '0';
        document.getElementById('totalBookings').textContent = '0';
        document.getElementById('avgPrice').textContent = '$0.00';
        document.getElementById('uniqueRoutes').textContent = '0';
        return;
    }
    
    const totalRecords = rawData.length;
    const totalBookings = rawData.reduce((sum, item) => sum + item.bookings, 0);
    const totalRevenue = rawData.reduce((sum, item) => sum + item.price * item.bookings, 0);
    const avgPrice = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    
    // Count unique routes
    const uniqueRoutes = new Set(rawData.map(item => `${item.origin} to ${item.destination}`)).size;
    
    document.getElementById('totalRecords').textContent = totalRecords;
    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('avgPrice').textContent = `$${avgPrice.toFixed(2)}`;
    document.getElementById('uniqueRoutes').textContent = uniqueRoutes;
}

// Event listener for the "Apply Filters" button
document.getElementById('applyFilters').addEventListener('click', fetchDataAndRender);

// Event listener for the "Export Data" button
document.getElementById('exportData').addEventListener('click', exportFilteredData);

// Event listener for the "Clear Filters" button
document.getElementById('clearFilters').addEventListener('click', clearAllFilters);

// Event listeners for quick filter buttons
document.querySelectorAll('.quick-filter').forEach(button => {
    button.addEventListener('click', function() {
        const days = parseInt(this.getAttribute('data-days'));
        setDateRange(days);
        fetchDataAndRender();
    });
});

/**
 * Sets the date range based on number of days from today
 */
function setDateRange(days) {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);
    
    document.getElementById('endDate').value = today.toISOString().split('T')[0];
    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
}

/**
 * Exports the currently filtered data as CSV or JSON
 */
async function exportFilteredData() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;

    try {
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startDate, endDate, origin, destination })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ask user for format preference
        const format = confirm('Export as CSV? Click OK for CSV, Cancel for JSON');
        
        if (format) {
            exportAsCSV(data.raw_data);
        } else {
            exportAsJSON(data.raw_data);
        }
        
    } catch (error) {
        console.error('Error exporting data:', error);
        alert(`Error exporting data: ${error.message}`);
    }
}

/**
 * Exports data as CSV file
 */
function exportAsCSV(data) {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }
    
    const headers = ['Date', 'Origin', 'Destination', 'Price', 'Bookings'];
    const csvContent = [
        headers.join(','),
        ...data.map(row => [
            row.date,
            row.origin,
            row.destination,
            row.price,
            row.bookings
        ].join(','))
    ].join('\n');
    
    downloadFile(csvContent, 'airline_data.csv', 'text/csv');
}

/**
 * Exports data as JSON file
 */
function exportAsJSON(data) {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }
    
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'airline_data.json', 'application/json');
}

/**
 * Creates and triggers a file download
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Clears all filter inputs and reloads data with default settings.
 */
function clearAllFilters() {
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('origin').value = '';
    document.getElementById('destination').value = '';
    fetchDataAndRender(); // Reload data with default filters
}

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
