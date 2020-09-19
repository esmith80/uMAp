const { Router } = require('express');
const router = Router();

module.exports = (db) => {
  //  /api/login
  router.post('/', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required!' });
    }

    const searchQuery = `SELECT id, name, email 
      FROM users WHERE email = $1 AND password = $2`;

    db.query(searchQuery, [email, password])
      .then((user) => {
        const { id, name, email } = user.rows[0];
        req.session.user = {
          userId: id,
          username: name,
          useremail: email,
        };
        res.status(200).json({ msg: 'Success' });
      })
      .catch((err) => res.status(400).json({ msg: err.msg }));
  });

  return router;
};
