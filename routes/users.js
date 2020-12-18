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

router.post('/register',(req,res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let newUser = new User({username: username, email: email, hash: bcryptjs.hashSync(password)});
  Users.insert(newUser).then(()=>{
      // success
      res.redirect('/');
  }).catch(err => {
      let duplicateField = err.errmsg.split("index:")[1].split("dup key")[0].split("_")[0].replace(/\s/g, '')
      if(duplicateField === 'email')
          console.log('')
      else if (duplicateField === 'username')
          console.log('')
  })
});

module.exports = router;
