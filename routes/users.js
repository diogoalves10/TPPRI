const express = require('express');
const router = express.Router();
const passport = require('../auth').passport;
const Users = require('../controllers/users');
const Assets = require('../controllers/assets');
const bcrypt = require('bcrypt');
const auth = require('../auth');
const multer = require("multer")
const upload = multer({dest: 'uploads/'})
const fs = require('fs');
const files = require('../files')

router.post('/login', passport.authenticate('local', {session:true, successRedirect: '/home', failureRedirect: '/' }));
router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).clearCookie('connect.sid', {
        path: '/'
    });
    req.session.destroy(function (err) {
        if (!err)
            res.redirect('/');
         else
            console.log('Destroy session error: ', err)
    });

});

router.get('/info/:username', auth.isLogged, (req, res) =>
    Users.lookUpByInfos(req.params.username).then(user => {
        if(user)
            Assets.lookUpByUser(user.id).then(dados => {
                let assets = [];
                dados.forEach(e=>{
                    let total = 0;
                    e.stars.forEach(star =>{
                        total += star.stars
                    })
                    assets.push({id: e.id , title: e.title, nbstars : e.stars.length, med: (total/e.stars.length).toFixed(1)})
                })
                res.render('account/user', {user:req.user, userProfile: user, myAccount: req.user.id === user.id, assets: assets });
            })
        else
            res.redirect('/home')
    })
);

router.post('/register', (req,res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
    bcrypt.hash(password, 10, function(err, hash) {
        let user = Users.insert({username: username, email: email, level: 1, hash: hash})
        req.login(user, function(err) {
            return res.redirect('/home');
        });
    });
});

router.post('/check', (req,res) => {
    Users.lookUpByInfos(req.body.info).then(dados => {
        if(!dados)
            res.status(200)
        else
            res.status(406)
        res.end()
    })
});

router.post('/edit', auth.isLogged, (req,res) => {
    let username =  req.body.username;
    let email = req.body.email;
    let info;
    let user = req.user;
    if(username){
        info = username
        user.username = username;
    }
    else if (email){
        info = email
        user.email = email;
    }
    Users.lookUpByInfos(info).then(userAlready => {
        if(!userAlready){
            res.status(200)
            Users.edit(user);
        }
        else
            res.status(406)
    })
    res.end();
});


router.post('/editPass', auth.isLogged,  (req,res) => {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        hash = hash;
        var user = req.user;
        user.hash = hash;
        Users.edit(user);
        res.status(200)
        res.end()
    });
})

router.post('/editDescription', auth.isLogged,  (req,res) => {
    let descricao =  req.body.descricao;
    let user = req.user;
    user.description = descricao;
    Users.edit(user);
    res.status(200);
    res.end();
})

router.post('/uploadPicture',upload.single('myFileInput'), auth.isLogged,  (req,res) => {
    let file = req.file;
    let user = req.user;
    files.uploadPicture(__dirname + '/../' + file.path, req.user._id).then(p => {
        user.image.date = new Date().toISOString().substr(0,16)
        user.image.originalName = file.originalname
        user.image.mimetype = file.mimetype;
        user.image.size = file.size

        user.image.url = p.url.replace('upload/', '$&ar_1,c_crop/')
        Users.edit(user);
        return res.redirect('/account');
    })
})

module.exports = router;
