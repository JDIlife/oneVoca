var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const loggedIn = req.session.isLoggedIn || false;
  const userId = req.session.userId;
  res.render('index', {loggedIn: loggedIn, userId: userId});
});

module.exports = router;
