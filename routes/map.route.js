const { Router } = require('express');
const router = Router();
const { removeLastCommaBeforeWhere } = require('../utils/helperFunctions');

module.exports = (db) => {
  //api/map
  //Get all maps created by user
  router.get('/', (req, res) => {
    const user = req.session.user;
    if (!user) {
      return res.status(400).json({ msg: 'User should be logged in!' });
    }

    const searchQuery = `SELECT * FROM maps WHERE user_id = $1`;

    db.query(searchQuery, [user.userId]).then(({ rows: userMaps }) =>
      res
        .status(200)
        .json({ userMaps })
        .catch((err) => res.status(500).json({ msg: 'query error' }))
    );
  });

  // Get single map by id
  router.get('/:id', (req, res) => {
    const searchQuery = `SELECT * FROM maps WHERE id = $1`;

    db.query(searchQuery, [req.params.id])
      .then(({ rows: map }) => res.status(200).json(map[0]))
      .catch((err) => res.status(500).json({ msg: 'query error' }));
  });

  // Create new map
  router.post('/', (req, res) => {
    const user = req.session.user;
    if (!user) {
      return res.status(400).json({ msg: 'User should be logged in!' });
    }
    const { title, map_description, city, category } = req.body;
    const { userId } = req.session.user;

    const searchQuery = `
    INSERT INTO 
      maps(title, map_description, user_id, city, category)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *;`;

    db.query(searchQuery, [title, map_description, userId, city, category])
      .then(({ rows: newMap }) => res.status(200).json(newMap[0]))
      .catch((err) => res.status(500).json({ msg: 'query error' }));
  });

  // Edit or update map
  router.post('/edit/:id', (req, res) => {
    const { title, map_description, city, category } = req.body;
    const queryParams = [];

    let searchQuery = `UPDATE maps SET `;

    if (title) {
      queryParams.push(title);
      searchQuery += `title = $${queryParams.length}, `;
    }

    if (map_description) {
      queryParams.push(map_description);
      searchQuery += `map_description = $${queryParams.length}, `;
    }

    if (city) {
      queryParams.push(city);
      searchQuery += `city = $${queryParams.length}, `;
    }

    if (category) {
      queryParams.push(category);
      searchQuery += `category = $${queryParams.length}, `;
    }

    if (req.params.id) {
      queryParams.push(req.params.id);
      searchQuery += `WHERE id = $${queryParams.length} RETURNING *;`;
    }
    searchQuery = removeLastCommaBeforeWhere(searchQuery);

    db.query(searchQuery, queryParams)
      .then(({ rows: map }) => res.status(200).json(map[0]))
      .catch((err) => res.status(500).json({ msg: 'query error' }));
  });

  // Delete map
  router.post('/:id/delete', (req, res) => {
    const searchQuery = `DELETE FROM maps WHERE id = $1;`;

    db.query(searchQuery, [req.params.id])
      .then((response) => res.json({ msg: 'map deleted' }).redirect('/'))
      .catch((err) => res.status(500).json({ msg: 'Server Error' }));
  });

  return router;
};
