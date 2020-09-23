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
  (title, user_id, map_description)
VALUES
  ('Edmonton', 1, 'Edmonton map description'),
  ('Calgary', 2, 'Calgary map description'),
  ('Vancouver', 3, 'Vancouver map description');

INSERT INTO
  map_reviews
  (comment, user_id, map_id, rating)
VALUES
  ('commnet1', 1, 1, 3),
  ('commnet2', 2, 2, 4),
  ('commnet3', 3, 3, 5);
