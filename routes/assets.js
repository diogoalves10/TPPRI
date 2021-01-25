const express = require('express');
const router = express.Router();
const auth = require('../auth');
const files = require('../files');
const Pedidos = require('../controllers/pedidos');
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
    res.render('assets/add', {user:req.user });
})

router.post('/add', upload.single('myFileInput'), auth.isCreator, (req, res) => {
    let file = req.file;
    let user = req.user;
    files.gerarZip(__dirname + '/../' + file.path).then(p => {

    }).catch(p => {

    })
})

router.post('/remove', auth.isCreator, (req, res) => {

})

router.post('/comment', auth.isLogged, (req, res) => {

})

router.post('/rank', auth.isLogged, (req, res) => {

})

module.exports = router;
