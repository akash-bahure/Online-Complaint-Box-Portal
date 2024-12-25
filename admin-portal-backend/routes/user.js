// const express = require('express');
// const cors = require('cors');
// var router=express.Router();



// // Middleware
// const corsOptions = {

//     origin: 'http://127.0.0.1:5500', // Allow requests from this origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header

// };

// // app.use(bodyParser.json());
// router.use(cors(corsOptions));
// router.options('*', cors(corsOptions)); // Enable CORS for preflight requests

// // Student Registration Route
// // Example of hashing password before storing in database
// router.post('/student-register', (req, res) => {
//     const { username, email, password } = req.body;

//     // Hash the password
//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//         if (err) {
//             return res.status(500).json({ success: false, message: 'Server error' });
//         }

//         // Store hashed password in database 
//         const sql = 'INSERT INTO students (username, email, password) VALUES (?, ?, ?)';
//         db.query(sql, [username, email, hashedPassword], (err, result) => {
//             if (err) {
//                 return res.status(500).json({ success: false, message: 'student already exist' });
//             }
//             res.json({ success: true, message: 'Registration successful' });
//         });
//     });
// });

// module.exports=router;

// //student Login Route
// //jwt



// router.post('/student-login', (req, res) => {
//     const { email, password } = req.body;

//     // Query the database for the student by email
//     db.query('SELECT * FROM students WHERE email = ?', [email], (err, results) => {
//         if (err) {
//             console.error('Student already exist:', err);
//             return res.status(500).json({ success: false, message: 'Student already exist' });
//         }

//         // Check if a student with this email exists
//         if (results.length === 0) {
//             return res.status(401).json({ success: false, message: 'Invalid credentials' });
//         }

//         const student = results[0];

//         // Compare the plain password with the hashed password
//         bcrypt.compare(password, student.password, (err, isMatch) => {
//             if (err) {
//                 console.error('Server error:', err);
//                 return res.status(500).json({ success: false, message: 'Server error' });
//             }

//             // Check if the password matches
//             if (!isMatch) {
//                 return res.status(401).json({ success: false, message: 'Invalid credentials' });
//             }

//             // Generate a JWT token
//             const token = jwt.sign(
//                 { user_id: student.id, user_role: 'student' },
//                 process.env.JWT_SECRET,
//                 { expiresIn: '7d' }
//             );
//             console.log('Generated Token:', token);

//             // Send the JWT token as the response
//             res.json({ success: true, message: 'Login successful', token: token });

//         });
//     });
// });

// module.exports=router;

