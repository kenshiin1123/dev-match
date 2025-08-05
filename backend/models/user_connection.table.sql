CREATE TYPE connection_status AS ENUM('pending', 'accepted', 'rejected', 'blocked');

CREATE TABLE user_connections (
	connection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	sender_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
	receiver_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
	status connection_status NOT NULL DEFAULT 'pending',
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	UNIQUE(sender_id, receiver_id)
)