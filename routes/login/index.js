const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.render('login/index',{
        title: 'login'
    });
});

module.exports = router;