CREATE TYPE status_type AS ENUM ('applied', 'shortlisted', 'interview', 'rejected');

CREATE TABLE applications (
  application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  applicant_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  jobpost_id UUID NOT NULL REFERENCES jobposts(jobpost_id) ON DELETE CASCADE,

  message TEXT,
  status status_type NOT NULL DEFAULT 'applied',
  note_from_employer TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (applicant_id, jobpost_id)
);
