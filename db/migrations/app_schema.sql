
DROP TABLE IF EXISTS users
CASCADE;
DROP TABLE IF EXISTS maps
CASCADE;
DROP TABLE IF EXISTS points
CASCADE;
DROP TABLE IF EXISTS map_reviews
CASCADE;
DROP TABLE IF EXISTS favorites
CASCADE;


CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE maps
(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'New Map',
  map_description TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  city VARCHAR(255),
  category VARCHAR(255),
  -- NEXT 2 LINES are lat and long may need for map centre
  --map_centre_latitude DECIMAL,
  --map_centre_longitude DECIMAL
);

CREATE TABLE points
(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) DEFAULT 'New Pointer',
  description TEXT,
  image_url TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  website_url TEXT,
  longitude VARCHAR(255),
  latitude VARCHAR(255)
);

CREATE TABLE map_reviews
(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  rating INTEGER DEFAULT 0,
  comment VARCHAR(255)
);

CREATE TABLE favorites
(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE
);



