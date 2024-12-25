async function fetchDashboardData() {
    try {
        const response = await fetch('http://localhost:3000/api/dashboard');

        // If the response is not ok (e.g., status 500)
        if (!response.ok) {
            throw new Error('Error fetching data: ' + response.statusText);
        }

        const data = await response.json();

        // Update the page with the fetched data
        document.getElementById('studentCount').textContent = data.student_count;
        document.getElementById('teacherCount').textContent = data.teacher_count;
        document.getElementById('totalComplaints').textContent = data.total_complaints;
        document.getElementById('pendingStatus').textContent = data.pending_status;
        document.getElementById('inProgress').textContent = data.in_progress;
        document.getElementById('resolved').textContent = data.resolved;
        document.getElementById('totalUsers').textContent = data.total_users;
        // Update for Accepted and Rejected status
        document.getElementById('acceptedStatus').textContent = data.accepted_status;
        document.getElementById('rejectedStatus').textContent = data.rejected_status;
    } catch (error) {
        console.error('Error:', error); // Log the error
        alert('Failed to fetch data. Check the console for details.');
    }
}

// Initial load of the data when the page is first loaded
window.onload = fetchDashboardData;
