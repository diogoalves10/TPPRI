const express = require('express');
const router = express.Router();
const auth = require('../auth');
const files = require('../files');
const Pedidos = require('../controllers/pedidos');
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
            console.log(logs)
            // transferir ficheiro no cloud
            // meter meta na bdd
        }
    }).catch(p => {
        files.deleteFile(__dirname + '/../' + req.file.path)
        console.log(p)
        if(p.filesStructure && p.filesStructure.length > 0){
            res.status(400);
            res.render('assets/erroUpload', {user: user, ficheirosAmais: [], filesStructure: p.filesStructure})
        } else{
            res.status(400);
            res.render('assets/erroUpload', {user: user, filesSHA: p.filesNotOk})
        }
    })
})

router.post('/remove', auth.isCreator, (req, res) => {

})

router.post('/comment', auth.isLogged, (req, res) => {

})

router.post('/rank', auth.isLogged, (req, res) => {

})

module.exports = router;
