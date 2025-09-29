-- Text to SQL original prompt:
-- Create 10 dummy users with no avatar and resume
INSERT INTO users (name, email, hashed_password, role, location, skills, company)
VALUES 
('John Doe', 'john@example.com', 'hashed_password_1', 'developer', 'New York', ARRAY['JavaScript', 'React'], NULL),
('Jane Smith', 'jane@example.com', 'hashed_password_2', 'employer', 'San Francisco', NULL, 'Tech Corp'),
('Bob Johnson', 'bob@example.com', 'hashed_password_3', 'developer', 'Chicago', ARRAY['Python', 'Django'], NULL),
('Alice Brown', 'alice@example.com', 'hashed_password_4', 'employer', 'Los Angeles', NULL, 'Web Solutions'),
('Charlie Davis', 'charlie@example.com', 'hashed_password_5', 'developer', 'Seattle', ARRAY['Java', 'Spring'], NULL),
('Eva Wilson', 'eva@example.com', 'hashed_password_6', 'developer', 'Boston', ARRAY['C++', 'Qt'], NULL),
('Frank Miller', 'frank@example.com', 'hashed_password_7', 'employer', 'Austin', NULL, 'Data Systems'),
('Grace Lee', 'grace@example.com', 'hashed_password_8', 'developer', 'Portland', ARRAY['Ruby', 'Rails'], NULL),
('Henry Taylor', 'henry@example.com', 'hashed_password_9', 'employer', 'Miami', NULL, 'Mobile Apps Inc'),
('Ivy Chen', 'ivy@example.com', 'hashed_password_10', 'developer', 'Denver', ARRAY['PHP', 'Laravel'], NULL)
