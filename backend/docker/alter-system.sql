-- These have been changed to ensure easy read/write of large chunks of data in the database
ALTER SYSTEM SET max_wal_size = '2GB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;

