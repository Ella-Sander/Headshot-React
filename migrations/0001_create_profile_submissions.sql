CREATE TABLE IF NOT EXISTS profile_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  website TEXT NOT NULL,
  email TEXT NOT NULL,
  area TEXT NOT NULL,
  price TEXT,
  specialty TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'rejected')),
  notification_status TEXT NOT NULL DEFAULT 'pending' CHECK (notification_status IN ('pending', 'sent', 'failed')),
  notification_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notification_attempted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_profile_submissions_status_created
  ON profile_submissions(status, created_at);
