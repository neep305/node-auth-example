const express = require('express');
const router = express.Router();

function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

router.get('/', (req,res) => {
    res.redirect('/login');
});

router.get('/restricted', restrict, (req,res) => {
    res.send('Restricted page, click to <a href="/logout">logout</a>');
});

router.get('/logout', (req,res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

router.get('/login', (req,res) => {
    res.render('login');
});