
//HOstel category complaints are here


document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('complaints-table');
    const searchInput = document.getElementById('search-input');

    // Fetch Hostel Complaints
    fetch('http://localhost:3000/api/complaints/hostel')
        .then(response => response.json())
        .then(data => {
            renderTable(data);
        })
        .catch(error => {
            console.error('Error fetching hostel complaints:', error);
            tableBody.innerHTML = `<tr><td colspan="7">Error loading complaints</td></tr>`;
        });

    function renderTable(complaints) {
        tableBody.innerHTML = '';
        complaints.forEach(complaint => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${complaint.id}</td>
                        <td>${complaint.user_role}</td>
                        <td>${complaint.category}</td>
                        <td>${complaint.title}</td>
                        <td>${complaint.description}</td>
                        <td>${complaint.urgency}</td>
                        <td>
                            <select onchange="updateComplaintStatus(${complaint.id}, this.value)">
                                <option value="Pending" ${complaint.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="In Progress" ${complaint.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Resolved" ${complaint.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                                <option value="Accepted" ${complaint.status === 'Accepted' ? 'selected' : ''}>Accepted</option>
                                <option value="Rejected" ${complaint.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                            </select>
                        </td>
                        <td>${new Date(complaint.createdAt).toLocaleString()}</td>
                        <td>${complaint.photo ? `<img src="/admin-portal-backend/uploads/${complaint.photo}" alt="${complaint.title}" />` : 'No Image'}</td>
                        <td>
                            <button class="delete-button" onclick="deleteComplaint(${complaint.id}, this)">Delete</button>
                        </td>
            `;
            tableBody.appendChild(row);
        });
    }






    //premises category complaints are here

    document.addEventListener('DOMContentLoaded', () => {
        const tableBody = document.getElementById('complaints-table');
        const searchInput = document.getElementById('search-input');

        // Fetch premises Complaints
        fetch('http://localhost:3000/api/complaints/premises')
            .then(response => response.json())
            .then(data => {
                renderTable(data);
            })
            .catch(error => {
                console.error('Error fetching premises complaints:', error);
                tableBody.innerHTML = `<tr><td colspan="7">Error loading complaints</td></tr>`;
            });

        function renderTable(complaints) {
            tableBody.innerHTML = '';
            complaints.forEach(complaint => {
                const row = document.createElement('tr');
                row.innerHTML = `
              <td>${complaint.id}</td>
                        <td>${complaint.user_role}</td>
                        <td>${complaint.category}</td>
                        <td>${complaint.title}</td>
                        <td>${complaint.description}</td>
                        <td>${complaint.urgency}</td>
                        <td>
                            <select onchange="updateComplaintStatus(${complaint.id}, this.value)">
                                <option value="Pending" ${complaint.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="In Progress" ${complaint.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Resolved" ${complaint.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                                <option value="Accepted" ${complaint.status === 'Accepted' ? 'selected' : ''}>Accepted</option>
                                <option value="Rejected" ${complaint.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                            </select>
                        </td>
                        <td>${new Date(complaint.createdAt).toLocaleString()}</td>
                        <td>${complaint.photo ? `<img src="/admin-portal-backend/uploads/${complaint.photo}" alt="${complaint.title}" />` : 'No Image'}</td>
                        <td>
                            <button class="delete-button" onclick="deleteComplaint(${complaint.id}, this)">Delete</button>
                        </td>
            `;
                tableBody.appendChild(row);
            });
        }
    });


    // /classroom category complaints are here

    document.addEventListener('DOMContentLoaded', () => {
        const tableBody = document.getElementById('complaints-table');
        const searchInput = document.getElementById('search-input');

        // Fetch premises Complaints
        fetch('http://localhost:3000/api/complaints/classroom')
            .then(response => response.json())
            .then(data => {
                renderTable(data);
            })
            .catch(error => {
                console.error('Error fetching classroom complaints:', error);
                tableBody.innerHTML = `<tr><td colspan="7">Error loading complaints</td></tr>`;
            });

        function renderTable(complaints) {
            tableBody.innerHTML = '';
            complaints.forEach(complaint => {
                const row = document.createElement('tr');
                row.innerHTML = `
              <td>${complaint.id}</td>
                        <td>${complaint.user_role}</td>
                        <td>${complaint.category}</td>
                        <td>${complaint.title}</td>
                        <td>${complaint.description}</td>
                        <td>${complaint.urgency}</td>
                        <td>
                            <select onchange="updateComplaintStatus(${complaint.id}, this.value)">
                                <option value="Pending" ${complaint.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="In Progress" ${complaint.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Resolved" ${complaint.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                                <option value="Accepted" ${complaint.status === 'Accepted' ? 'selected' : ''}>Accept</option>
                                <option value="Rejected" ${complaint.status === 'Rejected' ? 'selected' : ''}>Reject</option>
                            </select>
                        </td>
                        <td>${new Date(complaint.createdAt).toLocaleString()}</td>
                        <td>${complaint.photo ? `<img src="/admin-portal-backend/uploads/${complaint.photo}" alt="${complaint.title}" />` : 'No Image'}</td>
                        <td>
                            <button class="delete-button" onclick="deleteComplaint(${complaint.id}, this)">Delete</button>
                        </td>
            `;
                tableBody.appendChild(row);
            });
        }
    });




    // Search Complaints
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        fetch('http://localhost:3000/api/complaints/hostel')
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(complaint =>
                    complaint.status.toLowerCase().includes(searchTerm)
                );
                renderTable(filteredData);
            })
            .catch(error => console.error('Error during search:', error));
    });
});

// Update complaint status
async function updateComplaintStatus(complaintId, status) {
    try {
        const response = await fetch(`http://localhost:3000/admin/update_complaint/${complaintId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        const result = await response.json();
        if (result.success) {
            alert('Complaint status updated successfully');
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error updating complaint status:', error);
    }
}


// Delete complaint
async function deleteComplaint(complaintId, button) {
    const confirmDelete = confirm('Are you sure you want to delete this complaint? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`http://localhost:3000/admin/delete_complaint/${complaintId}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            alert('Complaint deleted successfully!');
            button.closest('tr').remove(); // Remove the row from the table
        } else {
            alert(`Failed to delete complaint: ${result.message}`);
        }
    } catch (error) {
        console.error('Error deleting complaint:', error);
        alert('An error occurred while deleting the complaint. Please try again.');
    }
}




