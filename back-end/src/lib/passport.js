const passport = require('passport')
const pool = require('../database')
const LocalStrategy = require('passport-local').Strategy
const helpers = require('../lib/helpers')

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    const rows = (await (pool.query('SELECT * FROM users WHERE username= $1', [username]))).rows
    if (rows.length > 0) {
      const user = rows[0];
      const validPassword = await helpers.matchPassword(password, user.password)
      if (validPassword) {
        done(null, user, req.flash('success', 'Welcome ' + user.username));
      } else {
        done(null, false, req.flash('message', 'Incorrect Password'));
      }
    } else {
      return done(null, false, req.flash('message', 'The Username does not exists.'));
    }
  }));

passport.use('local.singup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body
    const newUser = {
        username,
        password,
        fullname
    }
    newUser.password = await helpers.encryptPassword(password)
    const result = await pool.query('INSERT INTO users (username,password,fullname) VALUES ($1,$2,$3) RETURNING id', [newUser.username, newUser.password, newUser.fullname]);
    newUser.id = result.rows[0].id
    return done(null, newUser)
}))

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = (await (pool.query('SELECT * FROM users WHERE id=$1', [id]))).rows;
    done(null, { row: rows[0] });
}); 