const express = require('express');
const router = express.Router();
const auth = require('../auth');
const Pedidos = require('../controllers/pedidos');

router.get('/', auth.isCreator,(req, res) => {

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

router.post('/add', (req, res) => {

})

router.post('/remove', (req, res) => {

})

router.post('/comment', (req, res) => {

})

router.post('/rank', (req, res) => {

})

module.exports = router;
