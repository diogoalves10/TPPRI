const express = require('express');
const router = express.Router();
const passport = require('../auth').passport;
const Users = require('../controllers/users');
const bcrypt = require('bcrypt');

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

router.post('/edit', (req,res) => {
    let username =  req.body.username;
    let email = req.body.email;
    var user = req.user;
    let info;
    if(username){
        info = username
        user.username = username;
    }
    else if (email){
        info = email
        user.email = email;
    } else {
        bcrypt.hash(req.body.password, 10, function(err, hash) {
            user.hash = hash;

        });
    }
    console.log(user._id)
    var u = Users.lookUp(user._id)
    console.log(u)
    /*
    Users.lookUpByInfos(info).then(dados => {
        if(!dados)
            Users.edit(user);
        return res.redirect('/account');
    })*/
});

module.exports = router;
