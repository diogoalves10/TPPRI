const {v4: uuidv4} = require('uuid');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./controllers/users')
const bcrypt = require('bcrypt');
const db = require('./db');
const MongoStore = require('connect-mongo')(session);

passport.use(new LocalStrategy(
    (username, password, done) => {
        Users.lookUpByInfos(username)
            .then(user => {
                if (!user)
                    return done(null, false);
                bcrypt.compare(password, user.hash, function(err, res) {
                    if (res === false) {
                        return done(null, false, {message: 'Bad password'});
                    } else {
                        return done(null, user, );
                    }
                });
            })
            .catch(erro => done(erro))
    }
))
passport.serializeUser((user, done) =>{
    done(null, user.id)
})
passport.deserializeUser((id, done) => {
    Users.lookUp(id)
        .then(user => {
            done(null, user)
        })
})

function isLogged(req, res, next){
    if(req.isAuthenticated())
        next();
    else
        res.redirect("/");
}

function isAdmin(req, res, next){
    if(req.isAuthenticated() && req.user.level >= 3)
        next();
    else
        res.redirect("/");
}

function isCreator(req, res, next){
    if(req.isAuthenticated() && req.user.level >= 2)
        next();
    else
        res.redirect("/");
}

module.exports.isAdmin = isAdmin;
module.exports.isLogged = isLogged;
module.exports.isCreator = isCreator;

module.exports.passport = passport;
module.exports.session = session({
    genid: req => {
        return uuidv4()
    },

    store: new MongoStore({
        url: db.uri,
        collection: 'sessions'
    }),
    cookie:{_expires : 3600000},
    secret: 'O meu segredo',
    resave: false,
    saveUninitialized: true
});