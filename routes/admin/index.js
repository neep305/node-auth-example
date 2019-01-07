const express = require('express');
const router = express.Router();

//check session has user information
function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = '로그인이 필요합니다.';
        req.session.returl = '/admin';
        res.redirect('/auth/login');
    }
}

// if user access admin page, check session and redirect
router.get('/', restrict, (req,res) => {
    console.log('user in admin', req.session.user);
    res.render('admin/index',{ 
        title: 'Admin',
        user: req.session.user
    });
});

router.get('/restricted', restrict, (req,res) => {
    res.send('Restricted page, click to <a href="/logout">logout</a>');
});

module.exports = router;