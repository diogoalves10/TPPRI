const express = require('express');
const router = express.Router();
const auth = require('../auth');

router.get('/', auth.isLogged, function(req, res) {
    res.render('account/index', { title: 'Account', user: req.user });
});



module.exports = router;
