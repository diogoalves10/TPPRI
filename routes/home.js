const express = require('express');
const router = express.Router();

router.get('/', verificaAutenticacao, function(req, res) {
    res.render('home/index', { title: 'Express' });
});

function verificaAutenticacao(req, res, next){
    if(req.isAuthenticated())
        next();
    else
        res.redirect("/");
}

module.exports = router;