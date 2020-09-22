const { Router } = require('express');
const router = Router();
const {
  getMapsByUserId,
  getMapByID,
  createNewMap,
  updateMapByID,
  deleteMapByID,
} = require('../db/queries/map.queries');

module.exports = (db) => {
  //api/map
  router.get('/', (req, res) => {
    const user = req.session.user;
    if (!user) {
      return res.status(400).json({ msg: 'User should be logged in!' });
    }
    getMapsByUserId(user.userId, db)
      .then((userMaps) => {
        console.log('usr maps', userMaps);
        const vars = { user, userMaps };
        res.render('index', vars);
      })
      .catch((err) =>
        res.status(500).json({ msg: 'failed to load maps table' })
      );
  });

  router.get('/:id', (req, res) => {
    getMapByID(req.params.id, db)
      .then((map) => res.status(200).json(map))
      .catch((err) =>
        res.status(500).json({ msg: 'failed to get single map table' })
      );
  });

  router.post('/new', (req, res) => {
    // const user = req.session.user;
    // if (!user) {
    //   return res.status(400).json({ msg: 'User should be logged in!' });
    // }
    // const { userId } = req.session.user;
    const queryParams = [req.body, 1];

    createNewMap(queryParams, db)
      .then((newMap) => res.status(200).json(newMap))
      .catch((err) => res.status(500).json({ msg: 'failed to add new map' }));
  });

  router.post('/edit/:id', (req, res) => {
    updateMapByID(req.body, req.params.id, db)
      .then((map) => res.status(200).json(map))
      .catch((err) => res.status(500).json({ msg: 'failed to update map' }));
  });

  router.post('/:id/delete', (req, res) => {
    deleteMapByID(db, req.params.id)
      .then((response) => res.json({ msg: 'map deleted' }))
      .catch((err) => res.status(500).json({ msg: 'failed to delete map' }));
  });

  return router;
};
