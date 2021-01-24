var express = require('express');
var router = express.Router();
const auth = require('../auth');

router.get('/', function(req, res, next) {
  if(req.isAuthenticated())
    res.redirect("/home");
  else
    res.render('index', { title: 'Welcome' });
});

module.exports = router;
