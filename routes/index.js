const express = require('express');
const router = express.Router();

const authRouter = require('./auth/index');
const loginRouter = require('./login/index');

router.use('/auth', authRouter);
router.use('/login', loginRouter);

router.get('/', (req,res,next) => {
    res.send('This is main');
});

module.exports = router;