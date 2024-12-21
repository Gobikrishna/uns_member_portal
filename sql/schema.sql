CREATE DATABASE member_management;
USE member_management;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('primary', 'secondary', 'admin', 'member') DEFAULT 'member',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Members Table
CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(100),
    referralId VARCHAR(50),
    commission DECIMAL(10, 2),
    FOREIGN KEY (userId) REFERENCES users(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table (Referral Tracking)
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    memberId INT,
    referralPerson VARCHAR(100),
    referralIncome DECIMAL(10, 2),
    product VARCHAR(100),
    price DECIMAL(10, 2),
    transactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (memberId) REFERENCES members(id)
);




-- Use the correct database
USE member_management;

-- Insert sample data into users table
INSERT INTO users (firstName, lastName, email, password, role)
VALUES
  ('John', 'Doe', 'john.doe@example.com', 'hashed_password_123', 'primary'),
  ('Jane', 'Smith', 'jane.smith@example.com', 'hashed_password_456', 'secondary'),
  ('Alice', 'Johnson', 'alice.johnson@example.com', 'hashed_password_789', 'admin'),
  ('Bob', 'Williams', 'bob.williams@example.com', 'hashed_password_012', 'member');

-- Insert sample data into members table
INSERT INTO members (userId, firstName, lastName, email, referralId, commission)
VALUES
  (1, 'John', 'Doe', 'john.doe@example.com', 'R001', 10.00),
  (2, 'Jane', 'Smith', 'jane.smith@example.com', 'R002', 5.00),
  (3, 'Alice', 'Johnson', 'alice.johnson@example.com', 'R003', 15.00),
  (4, 'Bob', 'Williams', 'bob.williams@example.com', 'R004', 7.50);

-- Insert sample data into transactions table
INSERT INTO transactions (memberId, referralPerson, referralIncome, product, price)
VALUES
  (1, 'Alice Johnson', 50.00, 'Product A', 1000.00),
  (2, 'Bob Williams', 25.00, 'Product B', 2000.00),
  (3, 'John Doe', 75.00, 'Product C', 1500.00),
  (4, 'Jane Smith', 30.00, 'Product D', 1200.00);
  
