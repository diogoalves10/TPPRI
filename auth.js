const {v4: uuidv4} = require('uuid');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');
const Users = require('./controllers/users')

passport.use(new LocalStrategy(
    (username, password, done) => {
        Users.lookUpByInfos(username)
            .then(user => {
                if (!user)
                    return done(null, false);
                if (!user.hash ===  bcryptjs.hashSync(password))
                    return done(null, false);
                return done(null, user);
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

module.exports.passport = passport;
module.exports.session = session({
    genid: req => {
        return uuidv4()
    },
    store: new fileStore(),
    secret: 'O meu segredo',
    resave: false,
    saveUninitialized: true
});