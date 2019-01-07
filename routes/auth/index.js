const express = require('express');
const router = express.Router();

const hash = require('pbkdf2-password')();

//dummy database
var users = {
    admin: { name: 'admin'}
};

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)
hash({ password: 'admin' }, function (err, pass, salt, hash) {
    if (err) throw err;
    // store the salt & hash in the "db"
    users.admin.salt = salt;
    users.admin.hash = hash;
    console.log(users);
});

// Authenticate using our plain-object database of doom!
function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);
    var user = users[name];
    // query the db for the given username
    if (!user) return fn(new Error('cannot find user'));
    // apply the same algorithm to the POSTed password, applying
    // the hash against the pass / salt, if there is a match we
    // found the user
    hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
        if (err) return fn(err);
        if (hash === user.hash) return fn(null, user)
        fn(new Error('invalid password'));
    });
}

router.get('/login', (req,res) => {
    console.log(req.session.returl);
    res.render('auth/index',{
        title: 'login',
        returl: req.session.returl || '/'
    });
});

router.post('/login', (req,res) => {
    authenticate(req.body.username, req.body.password, (err,user) => {
        if (user) {
            console.log(user);
            // Regenerate session when signing in
            // to prevent fixation 
            req.session.regenerate(() => {
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.name
                    + ' click to <a href="/logout">logout</a>. '
                    + ' You may now access <a href="/restricted">/restricted</a>.';
                // res.redirect('back');
                res.redirect(req.body.returl);
            });
        } else {
            req.session.error = 'Authentication failed, please check your '
                + 'username and password'
                + ' (use "admin" and "admin")';
            res.redirect('/auth/login');
        }
    });
});

router.get('/logout', (req,res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;