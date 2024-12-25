# Online-Complaint-Box-Portal

     A streamlined and efficient platform for submitting and managing complaints related to hostels, classrooms, and premises. This project integrates functionality for students, teachers, and administrators, providing seamless communication and complaint resolution.



# Table of Contents
- Overview
- Features
- Technologies Used
- Installation
- Usage
- License
- Contact

# **Complaint Box Portal**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

## **Overview**

The **Complaint Box Portal** is a web-based application designed to manage complaints for hostels, classrooms, and premises. This system provides tailored functionalities for students, teachers, and administrators, ensuring efficient submission, tracking, and resolution of complaints.

---

## **Features**

| User Type         | Features                                                                 |
|-------------------|--------------------------------------------------------------------------|
| **Students/Teachers** | - Register and log in securely.<br> - Submit detailed complaints.<br> - Track the status of complaints.<br> - Update profile information. |
| **Admins**        | - Dashboard to view complaint statistics.<br> - Manage complaint statuses.<br> - Maintain records of students and teachers.<br> - Update complaint statuses (Pending, In Progress, Resolved). |

---

## **Technologies Used**

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js, Express.js  
- **Database**: MySQL  
- **ORM**: Sequelize  
- **Development Tools**: Visual Studio Code  

---

## **Installation**

### **Prerequisites**
- Install [Node.js](https://nodejs.org/).
- Install [MySQL](https://dev.mysql.com/downloads/installer/).


### **Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/akash-bahure/Online-Complaint-Box-Portal.git

 2.  Navigate to the project directory:
    cd Online-Complaint-Box-Portal

3. Install dependencies:
    npm install

4. Configure the database:
   Start your MySQL server.
   Create a database named adminportaldb.
   Set up the database schema using Sequelize migrations:
   npx sequelize-cli db:migrate

   Update the .env file with your database credentials

5. Start the server:
   npm start 
6. Access the portal at http://localhost:3000.


### **Usage**
## Students & Teachers
1. Register or log in using your credentials.
2. Navigate to the Complaint Submission page to file complaints.
3. Track complaint statuses in the Complaint Status section.
4. Update profile information in the Profile Management section.

## Admins
1. Log in with admin credentials.
2. View complaint statistics in the Admin Dashboard.
3. Update complaint statuses as needed.


### **License**
 This project is licensed under the MIT License. See the LICENSE file for details.


### **Contact**
**👤 Akash Bahure**
**📧 Email: akash.bahure@example.com**
**🔗 GitHub: github.com/akash-bahure**


