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
  ('new map1', 1, 'description1'),
  ('new map2', 2, 'description2'),
  ('new map3', 3, 'description2');

INSERT INTO
  map_reviews
  (comment, user_id, map_id, rating)
VALUES
  ('commnet1', 1, 1, 3),
  ('commnet2', 2, 2, 4),
  ('commnet3', 3, 3, 5);
