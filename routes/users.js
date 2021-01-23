const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const passport = require('../auth').passport;
const Users = require('../controllers/users')

router.post('/login', passport.authenticate('local', {session:true}), (req, res) => res.redirect('/home'));
router.post('/logout', (req, res) => {
    req.logout();
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
  let user = Users.insert({username: username, email: email, hash: bcryptjs.hashSync(password)})
    req.login(user, function(err) {
        return res.redirect('/home');
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

module.exports = router;
