const { removeLastCommaBeforeWhere } = require('../../utils/helperFunctions');

module.exports = {
  getMapsByUserId: (userId, db) => {
    const searchQuery = `SELECT * FROM maps WHERE user_id = $1`;

    return db
      .query(searchQuery, [userId])
      .then(({ rows: userMaps }) => userMaps);
  },

  getMapByID: (mapId, db) => {
    const searchQuery = `SELECT * FROM maps WHERE id = $1`;

    return db.query(searchQuery, [mapId]).then(({ rows: map }) => map[0]);
  },

  createNewMap: (queryParams, db) => {
    const { title, map_description, userId, city, category } = queryParams[0];
    const searchQuery = `
    INSERT INTO
      maps(title, map_description, user_id, city, category)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *;`;

    return db // added user_id to next line
      .query(searchQuery, [title, map_description, userId, city, category])
      .then(({ rows: newMap }) => newMap[0]);
  },

  updateMapByID: (queryValues, id, db) => {
    const { title, map_description, city, category } = queryValues;

    const queryParams = [];

    let searchQuery = `UPDATE maps SET `;

    if (title) {
      queryParams.push(title);
      searchQuery += `title = $${queryParams.length}, `;
    }

    if (city) {
      queryParams.push(city);
      searchQuery += `city = $${queryParams.length}, `;
    }

    if (map_description) {
      queryParams.push(map_description);
      searchQuery += `map_description = $${queryParams.length}, `;
    }

    if (category) {
      queryParams.push(category);
      searchQuery += `category = $${queryParams.length}, `;
    }

    if (id) {
      queryParams.push(id);
      searchQuery += `WHERE id = $${queryParams.length} RETURNING *;`;
    }
    searchQuery = removeLastCommaBeforeWhere(searchQuery);

    return db.query(searchQuery, queryParams).then(({ rows: map }) => map[0]);
  },

  deleteMapByID: (db, id) => {
    const searchQuery = `DELETE FROM maps WHERE id = $1;`;

    return db.query(searchQuery, [id]);
  },
};
