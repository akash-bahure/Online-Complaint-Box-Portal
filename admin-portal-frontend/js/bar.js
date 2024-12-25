async function fetchComplaintStatusData() {
    try {
        const response = await fetch('http://localhost:3000/api/complaint-status-distribution');

        if (!response.ok) {
            throw new Error('Error fetching data: ' + response.statusText);
        }

        const data = await response.json();

        // Update the chart with fetched data
        updateChart(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch data. Check the console for details.');
    }
}

// Initialize the bar chart
const ctx = document.getElementById('statusChart').getContext('2d');
const statusChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Pending', 'Resolved', 'In Progress', 'Accepted', 'Rejected'],
        datasets: [{
            label: 'Complaints Status',
            data: [0, 0, 0, 0, 0], // Initial empty data
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Function to update the chart with new data
function updateChart(data) {
    statusChart.data.datasets[0].data = [
        data.pending,
        data.resolved,
        data.in_progress,
        data.accepted,
        data.rejected
    ];
    statusChart.update(); // Re-render the chart
}

// Initial load of the data when the page is first loaded
window.onload = fetchComplaintStatusData;

// Optionally, you can add a setInterval to fetch data periodically
setInterval(fetchComplaintStatusData, 3000); // Refresh every 30 seconds