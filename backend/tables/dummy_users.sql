-- Text to SQL original prompt:
-- Create 10 dummy users with no avatar and resume
INSERT INTO users (name, email, hashed_password, role, location, skills, company)
VALUES 
('John Doe', 'john@example.com', 'password', 'developer', 'New York, NY', ARRAY['JavaScript', 'React'], NULL),
('Jane Smith', 'jane@example.com', 'password', 'employer', 'San Francisco, CA', ARRAY['Management', 'Hiring'], 'Tech Corp'),
('Bob Johnson', 'bob@example.com', 'password', 'developer', 'Chicago', ARRAY['Python', 'Django'], NULL),
('Alice Brown', 'alice@example.com', 'password', 'employer', 'Los Angeles, CA', ARRAY['Talent Acquisition'], 'Web Solutions'),
('Charlie Davis', 'charlie@example.com', 'password', 'developer', 'Seattle', ARRAY['Java', 'Spring'], NULL),
('Eva Wilson', 'eva@example.com', 'password', 'developer', 'Boston', ARRAY['C++', 'Qt'], NULL),
('Frank Miller', 'frank@example.com', 'password', 'employer', 'Austin, TX', ARRAY['Project Management'], 'Data Systems'),
('Grace Lee', 'grace@example.com', 'password', 'developer', 'Portland', ARRAY['Ruby', 'Rails'], NULL),
('Henry Taylor', 'henry@example.com', 'password', 'employer', 'Miami, FL', ARRAY['Hiring', 'Technical Recruiting'], 'Mobile Apps Inc'),
('Ivy Chen', 'ivy@example.com', 'password_', 'developer', 'Denver', ARRAY['PHP', 'Laravel'], NULL)
