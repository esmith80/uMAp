const { Router } = require('express');
const router = Router();
const {
  getMapsByUserId,
  getMapByID,
  creareNewMap,
  updateMapByID,
  deleteMapByID,
} = require('../db/queries/map.queries');

module.exports = (db) => {
  //api/map
  //Get all maps created by user
  router.get('/', (req, res) => {
    const user = req.session.user;
    if (!user) {
      return res.status(400).json({ msg: 'User should be logged in!' });
    }

    getMapsByUserId(1, db).then((userMaps) => {
      res
        .status(200)
        .json({ userMaps })
        .catch((err) =>
          res.status(500).json({ msg: 'failed to get maps table' })
        );
    });
  });

  // Get single map by id
  router.get('/:id', (req, res) => {
    getMapByID(req.params.id, db)
      .then((map) => res.status(200).json(map))
      .catch((err) =>
        res.status(500).json({ msg: 'failed to get single map table' })
      );
  });

  // Create new map
  router.post('/', (req, res) => {
    const user = req.session.user;
    if (!user) {
      return res.status(400).json({ msg: 'User should be logged in!' });
    }
    const { userId } = req.session.user;
    const queryParams = [req.body, userId];

    creareNewMap(queryParams, db)
      .then((newMap) => res.status(200).json(newMap))
      .catch((err) => res.status(500).json({ msg: 'failed to add new map' }));
  });

  // Edit or update map
  router.post('/edit/:id', (req, res) => {
    updateMapByID(req.body, req.params.id, db)
      .then((map) => res.status(200).json(map))
      .catch((err) => res.status(500).json({ msg: 'failed to update map' }));
  });

  // Delete map
  router.post('/:id/delete', (req, res) => {
    deleteMapByID(db, req.params.id)
      .then((response) => res.json({ msg: 'map deleted' }))
      .catch((err) => res.status(500).json({ msg: 'failed to delete map' }));
  });

  return router;
};
