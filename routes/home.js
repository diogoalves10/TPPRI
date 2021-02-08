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
        var o = 0;
        for(let dado of dados){
            Users.lookUp(dado.prop).exec().then(userNew =>{
                if(dado.asset)
                    Assets.lookUp(dado.asset).exec().then(assetNew =>{
                        if(!assetNew.private){
                            newFull.push({user:userNew, asset:assetNew, date:dado.reg_time});
                        }else
                            o++

                        if(dados.length === newFull.length +o){
                            newFull.sort((a,b) => {
                                return b.date-a.date
                            })
                            res.render('home/index', { title: 'Home', user: req.user, news:newFull });
                        }
                    })
                else {
                    newFull.push({user:userNew, date:dado.reg_time, produtor:dado.prod});
                    if(dados.length === newFull.length+o){
                        newFull.sort((a,b) => {
                            return b.date-a.date
                        })
                        res.render('home/index', { title: 'Home', user: req.user, news:newFull });
                    }
                }
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