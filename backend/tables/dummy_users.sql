-- Developer 1
INSERT INTO users (
  name, email, hashed_password, role, location, skills, company,
  avatar, avatar_content_type, resume, resume_content_type
)
VALUES (
  'Lance Ivan Gil', 'lance.dev@example.com', 'hashed_pw_123',
  'developer', 'Ozamiz City',
  ARRAY['JavaScript', 'React', 'Node.js'],
  NULL,
  NULL, NULL, NULL, NULL
);

-- Developer 2
INSERT INTO users (
  name, email, hashed_password, role, location, skills, company
)
VALUES (
  'Jane Doe', 'jane.doe@example.com', 'hashed_pw_456',
  'developer', 'Cebu City',
  ARRAY['Java', 'Spring Boot', 'PostgreSQL'],
  NULL
);

-- Employer 1
INSERT INTO users (
  name, email, hashed_password, role, location, skills, company
)
VALUES (
  'Carlos Mendoza', 'carlos@techstartup.com', 'hashed_pw_789',
  'employer', 'Manila',
  ARRAY[]::TEXT[],
  'TechStartUp Inc.'
);

-- Admin 1
INSERT INTO users (
  name, email, hashed_password, role, location, skills, company
)
VALUES (
  'Admin User', 'admin@example.com', 'admin_pw_hashed',
  'admin', 'Davao City',
  ARRAY[]::TEXT[],
  NULL
);

-- Employer 2 with dummy resume and avatar skipped
INSERT INTO users (
  name, email, hashed_password, role, location, skills, company
)
VALUES (
  'Rachel Lee', 'rachel@creativecorp.com', 'hashed_pw_abc',
  'employer', 'Iloilo City',
  ARRAY[]::TEXT[],
  'CreativeCorp PH'
);
