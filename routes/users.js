const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const Users = require('../controllers/users');
const User = require('../models/user');

router.get('/', (req, res) => {
    Users.list().then(dados => {
        dados.forEach(u =>{
            console.log(u)
        })
    })
});

router.get('/:id', (req, res) => {
    Users.lookUpByInfos(req.params.id).then(dados => {
        console.log(dados)
    })
});

router.post('/register', (req,res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  Users.insert(new User({username: username, email: email, hash: bcryptjs.hashSync(password)})).then(()=>{
      res.status(200)
      res.end()
  }).catch(err => {
      res.status(400)
      res.end()
  })
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
