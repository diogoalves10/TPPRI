const express = require('express');
const router = express.Router();
const passport = require('../auth').passport;
const Users = require('../controllers/users');
const Pedidos = require('../controllers/pedidos');
const bcrypt = require('bcrypt');
const auth = require('../auth');
const multer = require("multer")
const upload = multer({dest: 'uploads/'})
const News = require('../controllers/news');
const Assets = require('../controllers/assets');
const fs = require('fs');
const files = require('../files')


router.get('/', auth.isAdmin, (req, res) => {
    Users.list().then(users => {
        Pedidos.list().then(pedidos => {
            res.render('admin/index', {user:req.user, users: users, pedidos: pedidos });
        })
    })
});

// TODO
router.get('/delete/user/:id', auth.isAdmin, (req, res) => {
    /*
    Users.lookUpByInfos(req.params.id).then(user => {
        if(user&& req.user.id !== user.id){
            Users.delete(user.id)
            News.deleteUser(user.id)
            Assets.deleteUser(user.id)
            Pedidos.deleteUser(user.id)
        }
        res.redirect('/admin')
    })*/
});

router.get('/delete/pedido/:id', auth.isAdmin, (req, res) => {
    Pedidos.delete(req.params.id)
    res.redirect('/admin')
});

router.get('/aceitar/pedido/:id', auth.isAdmin, (req, res) => {
    Pedidos.delete(req.params.id)
    Users.lookUp(req.params.id).then(user => {
        user.level = 2;
        Users.edit(user)
        News.insert({prop:user.id, prod:true})
        res.redirect('/admin')
    })
});

router.get('/pedido/:id', auth.isAdmin, (req, res) => {
    Pedidos.lookUp(req.params.id).then(pedido => {
        if(pedido){
            Users.lookUp(req.params.id).then(user => {
                if(user)
                    res.render('admin/askaccess', {user:req.user, pedido:pedido, userPedidor:user });
                else
                    res.redirect('/admin')
            })
        }
        else
            res.redirect('/admin')
    })

});

router.get('/user/:id', auth.isAdmin, (req, res) => {
    Users.lookUpByInfos(req.params.id).then(user => {
        if(user&& req.user.id !== user.id) {
            user.level = 3;
            Users.edit(user)
        }
        res.redirect('/admin')
    })
});

module.exports = router;
