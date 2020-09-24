const { Router } = require('express');
const router = Router();
const {
  getAllPins,
  createNewPin,
  deletePinByID,
  updatePinByMapIDAndPinID,
} = require('../db/queries/pin.queries');

module.exports = (db) => {
  // /api/pin
  // get all pins
  router.get('/:mapId', (req, res) => {
    const { mapId } = req.params;
    getAllPins(mapId, db)
      .then((pins) => res.json({ pins }))
      .catch((err) => res.status(500).json({ msg: 'fail to load pins' }));
  });

  // Create new pin
  router.post('/:mapId', (req, res) => {
    const { mapId } = req.params;
    const { userId } = req.session.user;

    createNewPin(req.body, mapId, userId, db)
      .then((pin) => res.status(200).json(pin))
      .catch((err) => res.status(500).json({ msg: 'fail to add a pin' }));
  });

  // Delete pin
  router.post('/:pinId/delete', (req, res) => {
    deletePinByID(req.params.pinId, db)
      .then((response) => res.json({ msg: 'pin deleted' }))
      .catch((err) => res.status(500).json({ msg: 'failed to delete pin' }));
  });

  // Update pin
  router.post('/:mapId/:pinId', (req, res) => {
    updatePinByMapIDAndPinID(req.body, req.params.pinId, db)
      .then((pin) => res.status(200).json(pin))
      .catch((err) => res.status(500).json({ msg: 'fail to update the pin' }));
  });

  return router;
};
