// const bcrypt = require('bcrypt');
// const mysql = require('mysql');

// require('dotenv').config();
// const jwt = require('jsonwebtoken');

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root', // Replace with your MySQL username
//     password: 'root', // Replace with your MySQL password
//     database: 'adminPortalDB' // Replace with your database name
// });

// db.connect((err) => {
//     if (err) {
//         console.error('Database connection failed: ' + err.stack);
//         return;
//     }
//     console.log('Connected to database.');

//     const username = 'admin';
//     const password = '123';

//     // Hash the password before storing
//     bcrypt.hash(password, 10, (err, hash) => {
//         if (err) throw err;

//         // Insert the admin user into the database
//         const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
//         db.query(sql, [username, hash], (err, result) => {
//             if (err) throw err;
//             console.log('Admin user created');
//             db.end();
//         });
//     });
// });



const mysql = require('mysql');
require('dotenv').config();  // Make sure you're loading your environment variables

const db = mysql.createConnection({
    host: process.env.DB_HOST,     // Use environment variables for database credentials
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

module.exports = db;  // Export the db connection
