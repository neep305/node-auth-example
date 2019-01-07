var express = require('express');
var hash = require('pbkdf2-password');
var path = require('path');
var session = require('express-session');

var app = express();

var routeHandler = require('./routes');

//config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(express.urlencoded({extended: false}));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'test test'
}));
app.use(function(req,res,next){
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

app.use('/', routeHandler);

//dummy database
var users = {
    tj: { name: 'tj'}
};

module.exports = app;