-- postgresではキャメルケースはやめた方が良い
DROP TABLE user_info;
CREATE TABLE user_info
(
  user_id TEXT NOT NULL,
  sheet_id TEXT NOT NULL
);
