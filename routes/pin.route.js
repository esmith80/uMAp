const { Router } = require('express');
const router = Router();
const { removeLastCommaBeforeWhere } = require('../utils/helperFunctions');

module.exports = (db) => {
  // /api/pin
  // get all pins
  router.get('/:mapId', (req, res) => {
    const { mapId } = req.params;

    const searchQuery = `SELECT * FROM points WHERE map_id = $1;`;

    db.query(searchQuery, [mapId])
      .then(({ rows: pins }) => res.status(200).json(pins))
      .catch((err) => res.status(500).json({ msg: 'fail to load pins' }));
  });

  // Create new pin
  router.post('/:mapId', (req, res) => {
    const {
      title,
      description,
      image_url,
      website_url,
      longitude,
      latitude,
    } = req.body;
    const { userId } = req.session.user;
    const { mapId } = req.params;

    const createQuery = `
      INSERT INTO 
        points(title, description, image_url, created_by, map_id, website_url, longitude, latitude)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    db.query(createQuery, [
      title,
      description,
      image_url,
      userId,
      mapId,
      website_url,
      longitude,
      latitude,
    ])
      .then(({ rows: pin }) => res.status(200).json(pin[0]))
      .catch((err) => res.status(500).json({ msg: 'fail to add a pin' }));
  });

  // Delete pin
  router.post('/:pinId/delete', (req, res) => {
    const deleteQuery = `DELETE FROM points WHERE id = $1;`;

    db.query(deleteQuery, [req.params.pinId])
      .then((response) => res.json({ msg: 'map deleted' }))
      .catch((err) => res.status(500).json({ msg: 'failed to delete map' }));
  });

  // Update pin
  router.post('/:mapId/:pinId', (req, res) => {
    const {
      title,
      description,
      image_url,
      website_url,
      longitude,
      latitude,
    } = req.body;
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

    if (req.params.pinId) {
      queryParams.push(req.params.pinId);
      updateQuery += `WHERE id = $${queryParams.length} RETURNING *;`;
    }
    console.log(updateQuery);
    updateQuery = removeLastCommaBeforeWhere(updateQuery);
    console.log(updateQuery, queryParams);
    db.query(updateQuery, queryParams)
      .then(({ rows: pin }) => res.status(200).json(pin[0]))
      .catch((err) => res.status(500).json({ msg: 'fail to update the pin' }));
  });

  return router;
};
