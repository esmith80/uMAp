const { removeLastCommaBeforeWhere } = require('../../utils/helperFunctions');

module.exports = {
  getAllPins: (mapId, db) => {
    const searchQuery = `SELECT * FROM points WHERE map_id = $1;`;

    return db.query(searchQuery, [mapId]).then(({ rows: pins }) => pins);
  },

  createNewPin: (queryValues, mapId, userId, db) => {
    const {
      title,
      description,
      image_url,
      website_url,
      longitude,
      latitude,
    } = queryValues;
    const createQuery = `
      INSERT INTO 
        points(title, description, image_url, created_by, map_id, website_url, longitude, latitude)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    return db
      .query(createQuery, [
        title,
        description,
        image_url,
        userId,
        mapId,
        website_url,
        longitude,
        latitude,
      ])
      .then(({ rows: pin }) => pin[0]);
  },

  deletePinByID: (pinId, db) => {
    const deleteQuery = `DELETE FROM points WHERE id = $1;`;

    return db.query(deleteQuery, [pinId]);
  },

  updatePinByMapIDAndPinID: (queryValues, pinId, db) => {
    const {
      title,
      description,
      image_url,
      website_url,
      longitude,
      latitude,
    } = queryValues;
    const queryParams = [];
    let updateQuery = `UPDATE points SET `;

    if (title) {
      queryParams.push(title);
      updateQuery += `title = $${queryParams.length}, `;
    }
    if (description) {
      queryParams.push(description);
      updateQuery += `description = $${queryParams.length}, `;
    }
    if (image_url) {
      queryParams.push(image_url);
      updateQuery += `image_url = $${queryParams.length}, `;
    }
    if (website_url) {
      queryParams.push(website_url);
      updateQuery += `website_url = $${queryParams.length}, `;
    }
    if (longitude) {
      queryParams.push(longitude);
      updateQuery += `longitude = $${queryParams.length}, `;
    }
    if (latitude) {
      queryParams.push(latitude);
      updateQuery += `latitude = $${queryParams.length}, `;
    }

    if (pinId) {
      queryParams.push(pinId);
      updateQuery += `WHERE id = $${queryParams.length} RETURNING *;`;
    }

    updateQuery = removeLastCommaBeforeWhere(updateQuery);

    return db.query(updateQuery, queryParams).then(({ rows: pin }) => pin[0]);
  },
};
