const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./config/db');  // Import the shared database connection

const nodemailer = require('nodemailer');

// const routes=require('./routes/user');


const app = express();

// app.use('/',routes);
// app.use('/routes',routes);


// Nodemailer transporter setup
// Create a transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL/TLS
    auth: {
        user: 'akashbahure0097@gmail.com', // Your Gmail address
        pass: 'phrvblolrqsbejox',   // App password, NOT your Gmail password
    },
});
  



require('dotenv').config();
const jwt = require('jsonwebtoken');

 


const port = 3000;

const session = require('express-session');

app.use(session({
    secret: 'your_secret_key',          // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }           // Set to true if using HTTPS
}));








// Middleware
const corsOptions = {

    origin: 'http://127.0.0.1:5500', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header

};

// app.use(bodyParser.json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable CORS for preflight requests


// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { count } = require('console');



// Admin Login Route
// Admin Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = results[0];

        // Compare hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ success: false, message: 'Error comparing passwords' });

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            res.json({ success: true, message: 'Login successful' });
        });
    });
});



app.get('/test-session', (req, res) => {
    if (req.session.user_id) {
        res.json({ success: true, message: `User ID in session: ${req.session.user_id}` });
    } else {
        res.json({ success: false, message: 'No session data found' });
    }
});




// Student Registration Route
// Example of hashing password before storing in database
app.post('/student-register', (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        // Store hashed password in database 
        const sql = 'INSERT INTO students (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'student already exist' });
            }
            res.json({ success: true, message: 'Registration successful' });
        });
    });
});


//student Login Route
//jwt




app.post('/student-login', (req, res) => {
    const { email, password } = req.body;

    // Query the database for the student by email
    db.query('SELECT * FROM students WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Student already exist:', err);
            return res.status(500).json({ success: false, message: 'Student already exist' });
        }

        // Check if a student with this email exists
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const student = results[0];

        // Compare the plain password with the hashed password
        bcrypt.compare(password, student.password, (err, isMatch) => {
            if (err) {
                console.error('Server error:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            // Check if the password matches
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            // Generate a JWT token
            const token = jwt.sign(
                { user_id: student.id, user_role: 'student' },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            console.log('Generated Token:', token);

            // Send the JWT token as the response
            res.json({ success: true, message: 'Login successful', token: token });

        });
    });
});





// Teacher Registration Route
app.post('/teacher-register', (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        // Store hashed password in the teachers table
        const sql = 'INSERT INTO teachers (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Teacher already exist' });
            }
            res.json({ success: true, message: 'Registration successful' });
        });
    });
});


//teacher login route

app.post('/teacher-login', (req, res) => {
    const { email, password } = req.body;

    // Query the database for the teacher by email
    db.query('SELECT * FROM teachers WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Teacher already exist:', err);
            return res.status(500).json({ success: false, message: 'Teacher already exist' });
        }

        // Check if a teacher with this email exists
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const teacher = results[0];

        // Compare the plain password with the hashed password
        bcrypt.compare(password, teacher.password, (err, isMatch) => {
            if (err) {
                console.error('Server error:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            // Check if the password matches
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            // Generate a JWT token
            const token = jwt.sign(
                { user_id: teacher.id, user_role: 'teacher' },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }                            // Token expiration time
            );

            console.log("jwt token:", token);
            // Send the JWT token as the response
            res.json({ success: true, message: 'Login successful', token });
        });
    });
});


// JWT Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Get the token from the 'Authorization' header

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        console.log("Decoded User:", user);  // Check if user data is populated correctly
        req.user = user;
        next();
    });

}




// Set up middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the uploads directory path
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir)); // Serve images statically
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// // Configure multer storage for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save to the uploads directory
    },
    filename: function (req, file, cb) {
        const title = req.body.title ? req.body.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'complaint';
        const timestamp = Date.now();
        const extension = path.extname(file.originalname); // Keep original extension
        const newFilename = `${title}_${timestamp}${extension}`;

        cb(null, newFilename); // Set unique filename
    },
});

const upload = multer({ storage: storage });




// Export multer upload function to use in routes
module.exports = upload;


// Route to handle complaint submission with JWT authentication
// Route for submitting a complaint
app.post('/submit_complaint', authenticateToken, upload.single('photo'), (req, res) => {
    const { category, title, description, urgency } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // console.log('Decoded User:', req.user);

    // Validate that user role is either 'student' or 'teacher'
    if (req.user.user_role !== 'student' && req.user.user_role !== 'teacher') {
        return res.status(400).json({ success: false, message: 'Invalid user role' });
    }

    // Check for missing required fields
    if (!category || !title || !description || !urgency) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Prepare complaint data for the database
    const complaintData = {
        category,
        title,
        description,
        urgency,
        photo,
        user_role: req.user.user_role,
    };

    // Attach user-specific ID based on role
    if (req.user.user_role === 'student') {
        complaintData.student_id = req.user.user_id;
    } else if (req.user.user_role === 'teacher') {
        complaintData.teacher_id = req.user.user_id;
    } else {
        return res.status(400).json({ success: false, message: 'Invalid user role' });
    }

    // Insert complaint data into the database
    const sql = 'INSERT INTO complaints SET ?';
    db.query(sql, complaintData, (err, result) => {
        if (err) {
            console.error('Error inserting complaint data:', err);
            return res.status(500).json({ success: false, message: 'Error storing complaint solve karo' });
        }
        res.json('Complaint submitted successfully!');
    });
});



// Route to get complaints with image URLs
app.get('/get_complaints', (req, res) => {
    getComplaints()
        .then(complaints => {
            // Add the correct URL path to the photo field
            const formattedComplaints = complaints.map(complaint => ({
                ...complaint,
                photo: complaint.photo ? `/uploads/${complaint.photo}` : null,
            }));
            res.json(formattedComplaints);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching complaints');
        });
});









//admin panel

// app.get('/api/complaint', (req, res) => {
//     const sql = `
//         SELECT * FROM Complaints
//         ORDER BY 
//             CASE 
//                 WHEN urgency = 'High' THEN 1
//                 WHEN urgency = 'Medium' THEN 2
//                 WHEN urgency = 'Low' THEN 3
//                 ELSE 4
//             END,
//             createdAt DESC
//     `;
//     db.query(sql, (err, results) => {
//         if (err) throw err;
//         res.json(results);
//     });
// });



// .................
// Route to update complaint status
app.put('/admin/update_complaint/:id', (req, res) => {
    const complaintId = req.params.id;
    const { status } = req.body;

    console.log('Received request to update complaint:', complaintId, 'with status:', status);

    if (!['Pending', 'In Progress', 'Resolved', 'Accepted', 'Rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    db.query('UPDATE complaints SET status = ? WHERE id = ?', [status, complaintId], (err, result) => {
        if (err) {
            console.error('Error updating complaint status:', err);
            return res.status(500).json({ success: false, message: 'Error updating complaint status' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        res.json({ success: true, message: 'Status updated successfully' });
    });
});




// GET request to fetch complaints for a specific user (student or teacher)
// const jwt = require('jsonwebtoken');

// Middleware to verify the JWT token
const authenticateJWT = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided' });
    }

    // Verify and decode the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }

        // Attach decoded information to request object
        req.userId = decoded.user_id;
        req.userRole = decoded.user_role;
        next();  // Proceed to the next middleware/route handler
    });
};

// Protect your route with the JWT middleware
// This endpoint now checks the user type (student or teacher) and fetches only their complaints
// GET request to fetch complaints for a specific user (student or teacher)
app.get('/admin/complaint', authenticateJWT, (req, res) => {
    const userId = req.userId;
    const userRole = req.userRole;

    // Fetch complaints from database using userId and userRole
    let query = '';
    if (userRole === 'student') {
        query = 'SELECT * FROM complaints WHERE student_id = ?';
    } else if (userRole === 'teacher') {
        query = 'SELECT * FROM complaints WHERE teacher_id = ?';
    }

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No complaints found' });
        }

        res.json({ success: true, complaints: results });
    });
});


  


////graphssssss

// API endpoint to get complaints by category
app.get('/complaints-by-category', (req, res) => {
    const query = `
        SELECT category, COUNT(*) AS count 
        FROM complaints 
        GROUP BY category;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Failed to fetch data' });
            return;
        }

        // Send the results as JSON
        res.json(results);
    });
});



// ..............
app.get('/api/dashboard', (req, res) => {
    const query = `
        SELECT
            (SELECT COUNT(*) FROM students) AS student_count,
            (SELECT COUNT(*) FROM teachers) AS teacher_count,
            (SELECT COUNT(*) FROM complaints) AS total_complaints,
            (SELECT COUNT(*) FROM complaints WHERE status = 'Pending') AS pending_status,
            (SELECT COUNT(*) FROM complaints WHERE status = 'In Progress') AS in_progress,
            (SELECT COUNT(*) FROM complaints WHERE status = 'Resolved') AS resolved,
            (SELECT COUNT(*) FROM complaints WHERE status = 'Accepted') AS accepted_status,
            (SELECT COUNT(*) FROM complaints WHERE status = 'Rejected') AS rejected_status,
            (SELECT COUNT(*) FROM students) + (SELECT COUNT(*) FROM teachers) AS total_users
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err); // Log the actual error to the console
            return res.status(500).json({ error: 'Error fetching data' }); // Return a JSON error message
        }

        res.json(results[0]); // Send the first result row as the response
    });
});


// Backend Endpoint to Get Complaint Status Distribution
app.get('/api/complaint-status-distribution', (req, res) => {
    const query = `
        SELECT
            (SELECT COUNT(*) FROM complaints WHERE status = 'Pending') AS pending,
            (SELECT COUNT(*) FROM complaints WHERE status = 'Resolved') AS resolved,
            (SELECT COUNT(*) FROM complaints WHERE status = 'In Progress') AS in_progress,
            (SELECT COUNT(*) FROM complaints WHERE status = 'Accepted') AS accepted,
            (SELECT COUNT(*) FROM complaints WHERE status = 'Rejected') AS rejected
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err); // Log the actual error to the console
            return res.status(500).json({ error: 'Error fetching data' }); // Return a JSON error message
        }

        // Log the result to verify the data is correct
        // console.log('Complaint status distribution:', results);

        res.json(results[0]); // Send the first result row as the response
    });
});



// Route for fetching students
app.get('/api/students', (req, res) => {
    const query = 'SELECT id, username, email FROM students';
    // console.log('Executing query:', query);  // Log the query to check it's correct
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error fetching students' });
        }
        
        // console.log('Query results:', results);  // Log the results for debugging            
        
        if (results.length === 0) {
            console.log('No students found in the database.');
            return res.status(404).json({ error: 'No students data found' });
        }

        res.json(results); // Send back the students as JSON
    });
});

// Route for fetching teachers
app.get('/api/teachers', (req, res) => {
    const query = 'SELECT id,username, email FROM teachers';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error fetching teachers' });
        }
        res.json(results); // Send back the teachers as JSON
    });
});

// Route for fetching admins (assuming users table for admins)
app.get('/api/admins', (req, res) => {
    const query = 'SELECT id,username  FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error fetching admins' });
        }
        res.json(results); // Send back the admins as JSON
    });
}); 


// Route to delete a student by ID
app.delete('/api/students/:id', (req, res) => {
    const studentId = req.params.id;
    const query = 'DELETE FROM students WHERE id = ?';

    db.query(query, [studentId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error deleting student' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully' });
    });
});



// Route to delete a teacher by ID
app.delete('/api/teachers/:id', (req, res) => {
    const teacherId = req.params.id;
    const query = 'DELETE FROM teachers WHERE id = ?';

    db.query(query, [teacherId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error deleting teacher' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.status(200).json({ message: 'Teacher deleted successfully' });
    });
});


// API endpoint to delete a user by ID
app.delete('/api/admins/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'DELETE FROM users WHERE id = ?';
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            res.status(500).send('Error deleting user');
        } else if (results.affectedRows > 0) {
            res.status(200).send('User deleted successfully');
        } else {
            res.status(404).send('User not found');
        }
    });
});




// // API endpoint to fetch complaints by category
// app.get('/api/complaints/:category', (req, res) => {
//     const category = req.params.category;

//     const query = 'SELECT * FROM complaints WHERE category = ?';
//     db.query(query, [category], (err, results) => {
//         if (err) {
//             console.error('Error fetching complaints:', err); 
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//         res.json(results);
//     });
// });


// Fetch complaints by category (hostel)
app.get('/api/complaints/hostel', (req, res) => {
    const query = 'SELECT * FROM complaints WHERE category = ?';
    db.query(query, ['hostel'], (err, results) => {
        if (err) {
            console.error('Error fetching hostel complaints:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

// Fetch complaints by category (premises)
app.get('/api/complaints/premises', (req, res) => {
    const query = 'SELECT * FROM complaints WHERE category = ?';
    db.query(query, ['premises'], (err, results) => {
        if (err) {
            console.error('Error fetching premises complaints:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

// Fetch complaints by category (classroom)
app.get('/api/complaints/classroom', (req, res) => {
    const query = 'SELECT * FROM complaints WHERE category = ?';
    db.query(query, ['classroom'], (err, results) => {
        if (err) {
            console.error('Error fetching classroom complaints:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});





app.delete('/admin/delete_complaint/:id', (req, res) => {
    const complaintId = req.params.id;
    db.query('DELETE FROM complaints WHERE id = ?', [complaintId], (err, result) => {
        if (err) {
            console.error('Error deleting complaint:', err);
            res.status(500).json({ success: false, message: 'Failed to delete complaint' });
            return;
        }
        res.json({ success: true });
    });
});




// Update profile details
// Update user profile: username, email, and password
app.put('/api/profile', async (req, res) => {
    const { newUsername, email, password } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    try {
        // Check if the user exists based on the unique email
        const user = await db.query('SELECT * FROM students WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Update the user information
        await db.query(
            'UPDATE users SET username = ?, password = ? WHERE email = ?',
            [newUsername, password, email]
        );

        res.json({ success: true, message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating the profile.' });
    }
});





// Dummy user for login
const warden = { username: "warden", password: "123" };

// Login endpoint
app.post("/warden-login", (req, res) => {
    const { username, password } = req.body;

    if (username === warden.username && password === warden.password) {
        return res.status(200).json({ message: "Login successful" });
    }

    res.status(401).json({ message: "Invalid username or password" });
});





// API endpoint to fetch a specific complaint by ID
app.get('/api/complaint/:id', async (req, res) => {
    try {
        const complaintId = req.params.id;
        const query = 'SELECT * FROM complaints WHERE id = ?';
        db.query(query, [complaintId], (err, result) => {
            if (err) {
                console.error('Error fetching complaint:', err);
                return res.status(500).json({ message: "Internal Server Error" });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Complaint not found' });
            }

            console.log("Fetched Complaint Data:", result[0]);
            res.json(result[0]);  // Send the specific complaint data as JSON response
        });
    } catch (error) {
        console.error("Error fetching complaint:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



// Endpoint to send email
app.post('/api/notify', (req, res) => {
    const { email, subject, message } = req.body;

    const mailOptions = {
        from: 'akashbahure0097@gmail.com',
        to: email,
        subject: subject,
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'Failed to send email.' }); 
        }
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    });
});



// API endpoint to fetch a specific complaint by ID
// API route to fetch a specific complaint by ID
// Assuming your backend is using Express.js

app.get('/admin/get_complaint/:id', (req, res) => {
    const complaintId = req.params.id;

    const query = 'SELECT * FROM complaints WHERE id = ?';
    db.query(query, [complaintId], (err, result) => {
        if (err) {
            console.error('Error fetching complaint:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        console.log('Fetched Complaint Data:', result[0]);
        res.json(result[0]);
    });
});

// app.post('/admin/forward_complaint/:id', (req, res) => {
//     const complaintId = req.params.id;
//     const { department, complaintData } = req.body;

//     console.log('Received request to forward complaint:', complaintId);
//     console.log('Department:', department);
//     console.log('Complaint Data:', complaintData);

//     // Database query to update the complaint or forward it to a department
//     const query = 'UPDATE complaints SET department = ?, status = ? WHERE id = ?';
//     db.query(query, [department, 'Forwarded', complaintId], (err, result) => {
//         if (err) {
//             console.error('Error forwarding complaint:', err);
//             return res.status(500).json({ message: 'Internal Server Error', error: err });
//         }

//         // Log result of the update operation
//         console.log('Complaint forwarded:', result);

//         // Send success response
//         res.json({ success: true, message: 'Complaint forwarded successfully!' });
//     });
// });






// .............classroom


// Temporary in-memory mapping of complaints to departments
const departmentComplaints = {
    MCA: [1, 2], // Complaint IDs for MCA
    IT: [3],
    CSE: [],
    Mechanical: [4],
    Electrical: [5, 6],
};

app.post('/api/complaints', async (req, res) => {
    const { department } = req.body;

    try {
        // Get complaint IDs for the selected department
        const complaintIds = departmentComplaints[department] || [];

        // Fetch complaints by IDs
        const complaints = await Complaint.findAll({
            where: { id: complaintIds },
        });

        res.json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


 
// Start the server 
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

