const express = require('/express');
const router = express.router();

router.get('/', (req,res,next) => {
    res.send('This is main');
});

module.exports = router;