
const express = require('express')
const morgan = require('morgan')
const flash = require('connect-flash')
const exphbs = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session);
const pgPool = require('./database')

const passport = require('passport')

//inicialización
const app = express()
require('./lib/passport')

//configuración
app.set('port', process.env.PORT || 5000)

app.set('views', path.join(__dirname, 'views'))

app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');


app.use(session({
  store: new pgSession({
    pool: pgPool,
    tableName: 'session',
  }),
  secret: 'sabahproject',
  resave: false,
  saveUninitialized: false
}));
app.use(flash())

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())



//Variables Globales
app.use((req, res, next) => {
  app.locals.success = req.flash('success')
  app.locals.message = req.flash('message')
  app.locals.user = req.user
  next()
})


//Rutas
app.use(require('./routes'))
app.use(require('./routes/authentication'))
app.use('/links', require('./routes/links'))

//Publicos
app.use(express.static(path.join(__dirname, 'public')))


//Iniciar Servidor
app.listen(app.get('port'), () => {
  console.log('Servidor en el puerto', app.get('port'))
})
