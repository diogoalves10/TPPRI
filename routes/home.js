const express = require('express');
const router = express.Router();
const News = require('../controllers/news');
const Users = require('../controllers/users');
const Assets = require('../controllers/assets');

router.get('/', verificaAutenticacao, function(req, res) {
    let newFull = []
    News.list().then(dados => {
        if(dados.length == 0)
            res.render('home/index', { title: 'Home', user: req.user, news:newFull });
        for(let dado of dados){
            Users.lookUp(dado.prop).exec().then(userNew =>{
                Assets.lookUp(dado.asset).exec().then(assetNew =>{
                    newFull.push({user:userNew, asset:assetNew});
                    if(dados.length === newFull.length){
                        newFull.sort((a,b) => {
                            return a.reg_time-b.reg_time
                        })
                        res.render('home/index', { title: 'Home', user: req.user, news:newFull });
                    }
                })
            })
        }
    })
});
// a
function verificaAutenticacao(req, res, next){
    if(req.isAuthenticated())
        next();
    else
        res.redirect("/");
}

module.exports = router;