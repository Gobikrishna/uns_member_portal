CREATE DATABASE member_management;
USE member_management;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,                 -- Unique identifier for the user
    firstName VARCHAR(50) NOT NULL,                    -- User's first name
    lastName VARCHAR(50) NOT NULL,                     -- User's last name
    email VARCHAR(100) UNIQUE NOT NULL,                -- User's email (unique constraint)
    password VARCHAR(255) NOT NULL,                    -- User's hashed password
    role ENUM('Primary', 'Secondary','Direct referral', 'Admin') DEFAULT 'Primary', -- Role (Primary, Secondary, Admin, etc.)
    mobile VARCHAR(15) UNIQUE,                         -- User's mobile number (unique constraint)
    referredBy INT,                                    -- References the ID of the referring Primary user
    user_details JSON,                                 -- User details column (placed after referredBy)
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- Record creation timestamp
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Last updated timestamp
    FOREIGN KEY (referredBy) REFERENCES users(id) ON DELETE SET NULL -- Self-referencing foreign key
);

-- Updating the 'user_details' column with a JSON object that includes multiple fields
UPDATE users
SET user_details = JSON_OBJECT(
  'mental_age', NULL, 
  'family_values', NULL,  
  'traditions_of_family', NULL, 
  'family_member_details', NULL, 
  'legacy_of_family', NULL, 
  'emotional_range', NULL, 
  'thoughts_about', NULL,  
  'conversation_style', NULL, 
  'working_style', NULL, 
  'spending_style', NULL, 
  'thoughts_on_lifestyle', NULL, 
  'past_vacations', NULL, 
  'physical_looks', NULL, 
  'disfigurements', NULL, 
  'internal_organs_health', NULL, 
  'personality', NULL, 
  'dressing', NULL, 
  'behaviour_in_sg', NULL, 
  'area_of_living', NULL, 
  'how_many_transfer', NULL, 
  'idea_of_settle', NULL, 
  'areas_of_interest', NULL, 
  'possession', NULL, 
  'future_travel', NULL, 
  'marks', NULL, 
  'courses_apart', NULL, 
  'areas_of_success', NULL, 
  'activities_involved', NULL, 
  'leadership_position', NULL, 
  'typing_speed', NULL, 
  'interesting_subjects', NULL, 
  'current_occupation', NULL, 
  'interest_in_occupation', NULL, 
  'work_designation', NULL, 
  'interact_with_coworkers', NULL,  
  'nature_of_job', NULL, 
  'relation_with', NULL, 
  'issues_in_family', NULL, 
  'circle_of_friends', NULL, 
  'number_of_partners', NULL, 
  'fluency_in_lang', NULL, 
  'interest_in_other_lang', NULL, 
  'caste', NULL, 
  'faiths', NULL, 
  'beliefs', NULL, 
  'no_of_cars', NULL, 
  'no_of_house', NULL, 
  'financial_literacy', NULL, 
  'views_on_invest', NULL, 
  'how_many_debts', NULL, 
  'comfort_with_tech', NULL, 
  'electronic_devices', NULL, 
  'appliances_in_use', NULL, 
  'technological_interests', NULL, 
  'how_often_change_devices', NULL, 
  'traditional_items', NULL, 
  'types_of_brands', NULL, 
  'volunteer_services', NULL, 
  'fears', NULL, 
  'motivations_drawbacks', NULL,  
  'free_time', NULL, 
  'outings', NULL
);

-- Members Table (Updated with `mobile` column)
CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,                -- Unique ID for each member
    userId INT NOT NULL,                              -- Links to the primary or secondary user in `users` table
    firstName VARCHAR(50) NOT NULL,                   -- Member's first name
    lastName VARCHAR(50) NOT NULL,                    -- Member's last name
    email VARCHAR(100) UNIQUE,                        -- Member's email (optional for tracking purposes)
    role ENUM('Primary', 'Secondary', 'Direct referral', 'Referred') DEFAULT 'Secondary', -- Role (Primary, Secondary, Direct referral, Referred)
    mobile VARCHAR(15),                               -- Member's mobile number
    referralId INT,                                   -- Referring member's ID (can be primary or secondary)
    commission DECIMAL(10, 2) DEFAULT 0.00,           -- Commission earned by the member
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- Record creation timestamp
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Last updated timestamp
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE, -- Links to `users` table
    FOREIGN KEY (referralId) REFERENCES members(id) ON DELETE SET NULL -- Links to another `members` record
);


-- Transactions Table (Referral Tracking)
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,                 -- Unique ID for each transaction
    memberId INT NOT NULL,                             -- Links to the member in `members` table
    referralPerson VARCHAR(100) NOT NULL,              -- Name of the referring person
    referralIncome DECIMAL(10, 2) NOT NULL,            -- Income from the referral commission
    product VARCHAR(100) NOT NULL,                     -- Name of the product purchased
    price DECIMAL(10, 2) NOT NULL,                     -- Price of the product
    commissionEarned DECIMAL(10, 2) NOT NULL,          -- Commission earned on the transaction
    transactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the transaction occurred
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- Record creation timestamp
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Last updated timestamp
    FOREIGN KEY (memberId) REFERENCES members(id) ON DELETE CASCADE -- Links to `members` table
);

-- insert data 
-- Inserting primary members (admin and primary users)
INSERT INTO users (firstName, lastName, email, password, role, mobile)
VALUES
('Gobi', 'Krishnan', 'gk@example.com', 'admin123', 'Primary', '1234567890'),
('Aru', 'mugam', 'aru@test.com', 'admin123', 'Primary', '0987654321'),
('karthik', 'K', 'karthik@test.com', 'admin123', 'Secondary', '1234567890'1),;


-- Inserting secondary members

-- Insert Secondary Member Karthik (Referred by Gobi, ID 1)
INSERT INTO members (userId, firstName, lastName, email, role, referralId)
VALUES (1, 'karthik', 'K', 'karthik@test.com', 'Secondary', 1);  -- Referred by Gobi

-- Insert Secondary Member sathish (Referred by Aru, ID 2)
INSERT INTO members (userId, firstName, lastName, email, role, referralId)
VALUES (2, 'sathish', 'G', 'sathish@test.com', 'Secondary', 2);  -- Referred by Aru


-- Insert Bob as a Secondary Member (Referred by Karthik)
INSERT INTO members (userId, firstName, lastName, email, role, referralId)
VALUES (1, 'pandi', 'raj', 'pandi@test.com', 'Referred', 4);





-- Bob is referred by Gobi (Primary member, userId = 1)
INSERT INTO members (userId, firstName, lastName, email, role, referralId, commission)
VALUES
(1, 'Karthi', 'K', 'karthi@example.com', 'Secondary', 1, 0.00);
-- Bob is referred by John (Primary member, userId = 2)
INSERT INTO members (userId, firstName, lastName, email, role, referralId, commission)
VALUES
(2, 'Bob', 'Brown', 'bob.brown@example.com', 'Secondary', 2, 0.00);  -- Referred by John (userId = 1)
-- userId for Bob is 1 (his own ID), and referralId is 1 because John (with userId = 1) referred him.

-- Charlie is referred by Alice (Primary member, userId = 3)
INSERT INTO members (userId, firstName, lastName, email, role, referralId, commission)
VALUES
(3, 'Charlie', 'Johnson', 'charlie.johnson@example.com', 'Secondary', 3, 0.00);  -- Referred by Alice (userId = 2)
-- userId for Charlie is 2 (his own ID), and referralId is 2 because Alice (with userId = 2) referred him.

-- Dan is referred by Bob (Secondary member, referralId = 1)
INSERT INTO members (userId, firstName, lastName, email, role, referralId, commission)
VALUES
(2, 'Dan', 'White', 'dan.white@example.com', 'Secondary', 2, 0.00);  -- Referred by Bob (referralId = 1)
-- Dan is referred by Bob. Bob has userId = 1, so Dan’s referralId is 1, indicating that Bob referred him.


-- Karthi makes a purchase, Gobi earns commission
INSERT INTO transactions (memberId, referralPerson, referralIncome, product, price, commissionEarned)
VALUES
(1, 'Gobi Krishnan', 50.00, 'Product A', 500.00, 50.00);  -- Bob makes a purchase, John earns commission

-- Bob makes a purchase, John earns commission
INSERT INTO transactions (memberId, referralPerson, referralIncome, product, price, commissionEarned)
VALUES
(2, 'John Doe', 50.00, 'Product B', 500.00, 50.00);  -- Charlie makes a purchase, Alice earns commission
