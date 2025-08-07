-- 1. Make sure employment_type is defined correctly
CREATE TYPE employment_type AS ENUM ('full-time', 'part-time', 'contract');

-- 2. Create the jobposts table
CREATE TABLE jobposts (
  jobpost_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- FOREIGN KEY setup
  posted_by UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

  title VARCHAR(100) NOT NULL,
  description TEXT,
  company VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,

  salary_min DECIMAL,
  salary_max DECIMAL,

  required_skills TEXT[] DEFAULT '{}',

  employment_type employment_type NOT NULL,
  remote BOOLEAN NOT NULL,

  timestamp TIMESTAMPTZ DEFAULT NOW()
);
