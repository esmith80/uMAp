const { Router } = require('express');
const router = Router();
const {
  getAllCommentsByMapID,
  createNewComment,
  updateCommendByID,
  deleteCommentByID,
} = require('../db/queries/map.reviews.queries');

module.exports = (db) => {
  // api/comment
  router.get('/:mapId', (req, res) => {
    getAllCommentsByMapID(req.params.mapId, db)
      .then((comments) => res.status(200).json(comments))
      .catch((err) =>
        res.status(500).json({ msg: 'failed to load comment for this mapId' })
      );
  });

  router.post('/:commentId/delete', (req, res) => {
    deleteCommentByID(req.params.commentId, db)
      .then((response) => res.json({ msg: 'comment deleted' }))
      .catch((err) =>
        res.status(500).json({ msg: 'failed to delete comment' })
      );
  });

  router.post('/:mapId/:userId', (req, res) => {
    const { mapId, userId } = req.params;
    createNewComment(mapId, userId, req.body, db)
      .then((comments) => res.status(200).json(comments))
      .catch((err) =>
        res.status(500).json({ msg: 'failed to load comment for this mapId' })
      );
  });

  router.post('/:commentId', (req, res) => {
    updateCommendByID(req.params.commentId, req.body, db)
      .then((comments) => res.status(200).json(comments))
      .catch((err) =>
        res.status(500).json({ msg: 'failed to update comment for this mapId' })
      );
  });

  return router;
};
