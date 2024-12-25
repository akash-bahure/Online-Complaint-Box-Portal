
fetch('http://localhost:3000/complaints-by-category')
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json(); // Parse JSON response
})
.then(data => {
    // Extract categories and counts from the API response
    const categories = data.map(item => item.category);
    const counts = data.map(item => item.count);

    // Get the canvas element and render the pie chart
    const ctx = document.getElementById('complaintsByCategoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                label: 'Complaints by Category',
                data: counts,
                backgroundColor: [
                    '#FF5733', // Red
                    '#33FF57', // Green
                    '#3357FF', // Blue
                    '#FFC300', // Yellow
                    '#C70039'  // Purple
                ],
                borderColor: '#fff',
                borderWidth: 1
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
})
.catch(error => {
    console.error('Error fetching complaints data:', error);
});
