const { Router } = require('express');
const router = Router();

module.exports = (db) => {
  //  /api/login
  router.get('/', (req, res) => {
    const user = req.session.user;

    res.render('login', { user });
  });

  router.post('/', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email and password required!' });
    }

    const searchQuery = `SELECT id, name, email 
      FROM users WHERE email = $1;`;

    db.query(searchQuery, [email])
      .then((user) => {
        const { id, name, email } = user.rows[0];
        req.session.user = {
          userId: id,
          username: name,
          useremail: email,
        };

        res.redirect('/api/map');
      })
      .catch((err) => res.status(400).json({ msg: err }));
  });

  return router;
};
