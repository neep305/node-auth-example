const express = require('express');
const router = express.Router();

const adminRouter = require('./admin/index');
const authRouter = require('./auth/index');

router.use('/admin', adminRouter);
router.use('/auth', authRouter);

router.get('/', (req,res,next) => {
    res.send('This is main');
});

module.exports = router;