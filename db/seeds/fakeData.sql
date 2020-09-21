--fake data
INSERT INTO
  users
  (name, email, password)
VALUES
  ('Alice', 'alice@g.com', 'password' ),
  ('Jack', 'jack@g.com', 'password' ),
  ('Bob', 'bob@g.com', 'password' );

INSERT INTO
  maps
  (title, user_id, map_description, map_centre_latitude, map_centre_longitude)
VALUES
  ('Edmonton', 1, 'Edmonton map description', 53.5461, -113.4938), -- Edmonton
  ('Calgary', 2, 'Calgary map description', 51.0447, -114.0719), -- Calgary
  ('Vancouver', 3, 'Vancouver map description', 49.2827, -123.1207); -- Vancouver

INSERT INTO
  map_reviews
  (comment, user_id, map_id, rating)
VALUES
  ('commnet1', 1, 1, 3),
  ('commnet2', 2, 2, 4),
  ('commnet3', 3, 3, 5);
