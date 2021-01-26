const express = require('express');
const router = express.Router();
const auth = require('../auth');
const files = require('../files');
const Pedidos = require('../controllers/pedidos');
const Users = require('../controllers/users');
const News = require('../controllers/news');
const Assets = require('../controllers/assets');
const Types = require('../controllers/assetsTypes');
const multer = require("multer")
const upload = multer({dest: 'uploads/'})

router.get('/', auth.isLogged,(req, res) => {

})

router.get('/askAccess', auth.isLogged,(req, res) => {
    if(req.user.level >= 2)
        res.redirect("/");
    Pedidos.lookUp(req.user.id).then(pedido => {
        if(pedido)
            res.render('assets/askaccess', {user:req.user, pedido:pedido.description });
        else
            res.render('assets/askaccess', {user:req.user });
    })
})

router.post('/askAccess', auth.isLogged,(req, res) => {
    if(req.user.level >= 2)
        res.redirect("/");
    else {
        Pedidos.insert({_id: req.user.id , description :req.body.description})
        res.status(200);
        res.end();
    }

})

router.get('/add', auth.isCreator, (req, res) => {
    let types = Types.list()
    res.render('assets/add', {user:req.user, types: types });
})

router.post('/add', upload.single('myFileInput'), auth.isCreator, (req, res) => {

    let user = req.user;
    files.gerarZip(__dirname + '/../' + req.file.path).then(logs => {
        var ficheirosAmais = logs.filesInsideFolder.filter( function( el ) {
            return logs.files.indexOf( el ) < 0;
        } );
        if(ficheirosAmais.length > 0){
            res.status(400);
            res.render('assets/erroUpload', {user: user, ficheirosAmais: ficheirosAmais})
        } else {

            Assets.insert(logs.files, req.file.path, user, req.body.type, req.body.privado, req.body.title, req.body.tags, req.body.descricao, req.body.dataCriacao)
                .then(a => {
                    News.insert({prop: user.id, asset: a.id})
                    res.redirect('info/'+a.id)
                })
                .catch(a => {
                    res.redirect('/')
                })
        }
    }).catch(p => {
        files.deleteFile(__dirname + '/../' + req.file.path)
        console.log(p)
        if(p.filesStructure && p.filesStructure.length > 0){
            res.status(400);
            res.render('assets/erroUpload', {user: user, ficheirosAmais: [], filesStructure: p.filesStructure})
        } else if (p.filesInManifestButNot && p.filesInManifestButNot.length > 0) {
            res.status(400);
            res.render('assets/erroUpload', {user: user, ficheirosAmais: [],filesInManifestButNot:p.filesInManifestButNot, filesStructure: p.filesStructure})
        } else{
            res.status(400);
            res.render('assets/erroUpload', {user: user, filesSHA: p.filesNotOk})
        }
    })
})



router.get('/info/:id',  auth.isLogged, (req, res) => {
    Assets.lookUp(req.params.id).then(u => {
        if(!u)
            res.redirect('/home')
        Types.lookUp(u.type).then(type=>{
            if(!type)
                res.redirect('/home')
            Users.lookUp(u.prop).then(prop => {
                if(!prop)
                    res.redirect('/home')
                let ranked = false;
                for (let rank of u.stars){
                    if(rank.user.equals( req.user._id)){
                        ranked=true;
                    }
                }

                let commentsUser = []

                if(u.comments.length == 0)
                    res.render('assets/index', {user: req.user, asset:u, prop:prop, type:type, ranked: ranked, comments:commentsUser})

                for(let comment of u.comments){
                    Users.lookUp(comment.user).exec().then(a =>{
                        commentsUser.push({user:a, comment:comment.comment, date:comment.reg_time});
                        if(commentsUser.length == u.comments.length){
                            commentsUser.sort((a,b) => {
                                return b.date-a.date
                            })
                            res.render('assets/index', {user: req.user, asset:u, prop:prop, type:type, ranked: ranked, comments:commentsUser})
                        }
                    })
                }
            })
        })

    })
})

router.get('/search',  auth.isLogged, (req, res) => {
    Assets.lookUpByTag(req.query.tag).then(u => {
        res.render('assets/search', {user: req.user, assets:u})
    })
})

router.post('/comment', auth.isLogged, (req, res) => {
    Assets.lookUp(req.body.idAsset).then(u => {
        if(!u)
            res.redirect('/home')
        u.comments.push({user:req.user.id, comment: req.body.comment, reg_time: new Date()})
        Assets.edit(u).then(a => {
            res.redirect('/assets/info/'+u.id)
        })
    })
})


router.get('/rank', auth.isLogged, (req, res) => {
    let rank = req.query.stars;
    if(rank < 1 && rank > 5)
        res.redirect('/home')
    Assets.lookUp(req.query.assetId).then(u => {
        for (let rank of u.stars){
            if(rank.user.equals( req.user._id)){
                console.log('deja noté')
                res.redirect('/home')
                return;
            }
        }
        u.stars.push({user:req.user.id, stars: req.query.stars})
        Assets.edit(u).then(a => {
            res.redirect('/assets/info/'+u.id)
        })
    })
})

module.exports = router;
