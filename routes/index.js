const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/hello', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json({ message: 'Hello Dixon!' });
});

module.exports = router;
