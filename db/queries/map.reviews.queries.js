const { removeLastCommaBeforeWhere } = require('../../utils/helperFunctions');

module.exports = {
  getAllCommentsByMapID: (mapId, db) => {
    const searchQuery = `
      SELECT * FROM map_reviews WHERE map_id = $1;
    `;

    return db
      .query(searchQuery, [mapId])
      .then(({ rows: comments }) => comments);
  },

  createNewComment: (mapId, userId, queryValues, db) => {
    const { comment, rating } = queryValues;
    const insertQuery = `
      INSERT INTO 
        map_reviews(comment, user_id, map_id, rating)
      VALUES
      ($1, $2, $3, $4)
      RETURNING *;
    `;

    return db
      .query(insertQuery, [comment, userId, mapId, rating])
      .then(({ rows: comment }) => comment[0]);
  },

  updateCommendByID: (id, queryValues, db) => {
    const { comment, rating } = queryValues;
    const queryParams = [];

    let updateQuery = `UPDATE map_reviews SET `;

    if (comment) {
      queryParams.push(comment);
      updateQuery += `comment = $${queryParams.length}, `;
    }

    if (rating) {
      queryParams.push(rating);
      updateQuery += `rating = $${queryParams.length}, `;
    }

    if (id) {
      queryParams.push(id);
      updateQuery += `WHERE id = $${queryParams.length} RETURNING *;`;
    }
    updateQuery = removeLastCommaBeforeWhere(updateQuery);
    console.log(updateQuery, queryParams);

    return db
      .query(updateQuery, queryParams)
      .then(({ rows: comment }) => comment[0]);
  },

  deleteCommentByID: (id, db) => {
    const searchQuery = `DELETE FROM map_reviews WHERE id = $1;`;

    return db.query(searchQuery, [id]);
  },
};
