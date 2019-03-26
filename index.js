const express          = require('express');
const app              = express();
const bodyParser       = require('body-parser');
const mongoose         = require('mongoose');
const cookieParser     = require('cookie-parser');
const expressValidator = require('express-validator');
const session          = require('express-session');
const passport         = require('passport');
const LocalStrategy    = require('passport-local').Strategy;
const flash            = require('connect-flash');

//.env
var port  = process.env.PORT || 5000;
var dbUrl = 'mongodb://admin:rudb1admin@ds021166.mlab.com:21166/ru-db';

// Database Configuration
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex : true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Express Session
app.use(session({
    secret           : 'secret',
    saveUninitialized: true,
    resave           : true
}));

// Passport Initialization 
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Express Validator
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        var namespace = param.split('.'),
            root      = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += `[${namespace.shift()}]`;
        }

        return {
            param: formParam,
            msg  : msg,
            value: value
        };
    }
}));

// Flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.user         = req.user || null;
    res.locals.alerts       = req.flash('alerts') || null;
    res.locals.profile_link = req.flash('profile_link') || null;
    res.locals.logout_link  = req.flash('logout_link') || null;
    next();
});

// Middlewares
app.use((req, res, next) => {
    console.log(`[${Date.now()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Routes
app.use('/', require('./controllers/routes/web'));
app.use('/auth', require('./controllers/routes/auth'));
app.use('/user', require('./controllers/routes/user'));
app.use('/admin', require('./controllers/routes/admin'));

app.listen(port, () => {
    console.log(`[${Date.now()}] SERVER RUNNING: ${port}`);
});

db.once('open', () => {
    console.log(`[${Date.now()}] CONNECTED TO DATABASE`);
});