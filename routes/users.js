const express = require('express');
const router = express.Router();
const passport = require('../auth').passport;
const Users = require('../controllers/users');
const bcrypt = require('bcrypt');
const auth = require('../auth');
const multer = require("multer")
const upload = multer({dest: 'uploads/'})
const fs = require('fs');

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

router.post('/uploadPicture', auth.isLogged, upload.single('myFile'),  (req,res) => {
    let file = req.file;
    let quarantinePath = __dirname + '/' + file.path
    let newPath = __dirname + '/public/fileStore/' + file.originalname
    fs.rename(quarantinePath, newPath, function(err){
        if(err){
            //erro
        }
        else{
            let date = new Date().toISOString().substr(0,16)
            console.log(JSON.stringify(file))
            /*
            let files = jsonfile.readFileSync('./dbFiles.json')
            files.push({
                date: date,
                name: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            })
            jsonfile.writeFileSync('./dbFiles.json', files)*/
        }
    })
})

module.exports = router;
