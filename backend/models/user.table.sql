CREATE TYPE user_role AS ENUM ('developer', 'employer', 'admin');

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'developer',
  location VARCHAR(100),
  skills TEXT[] DEFAULT '{}',
  company VARCHAR(100),

  avatar BYTEA,             -- Store image as binary
  avatar_content_type TEXT, -- Optional: to store MIME type

  resume BYTEA,             -- Store resume file as binary
  resume_content_type TEXT, -- Optional: to store MIME type

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);