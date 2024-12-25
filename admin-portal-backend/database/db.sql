
-- databse name== adminportaldb


-- create database adminportaldb;


-- use adminportaldb;



-- show tables;



-- CREATE TABLE complaints (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_role VARCHAR(50) NOT NULL,
--     category VARCHAR(50) NOT NULL,
--     title VARCHAR(255) NOT NULL,
--     description TEXT NOT NULL,
--     urgency ENUM('Low', 'Medium', 'High') NOT NULL,
--     photo VARCHAR(255),
--     student_id INT,       -- Foreign key column for students
--     teacher_id INT,       -- Foreign key column for teachers
--     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
--     -- Foreign key constraints
--     CONSTRAINT fk_student
--         FOREIGN KEY (student_id) REFERENCES students(id)
--         ON DELETE SET NULL ON UPDATE CASCADE,
--     CONSTRAINT fk_teacher
--         FOREIGN KEY (teacher_id) REFERENCES teachers(id)
--         ON DELETE SET NULL ON UPDATE CASCADE
-- );




-- show tables;
-- select *from complaints;
-- SELECT user_role FROM complaints WHERE user_role = 'teacher';








-- describe students;
-- select *from students;

-- describe teachers;
-- select *from teachers;

-- describe complaints;
-- select *from Complaints;


-- select *from users;
