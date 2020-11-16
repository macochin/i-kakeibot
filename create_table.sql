-- postgresではキャメルケースはやめた方が良い
DROP TABLE userInfo;
CREATE TABLE userInfo
(
  user_id TEXT NOT NULL,
  sheet_id TEXT NOT NULL
);
