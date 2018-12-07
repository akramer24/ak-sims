const router = require('express').Router();
module.exports = router;

router.use('/school-quality', require('./school-quality'));
router.use('/lines', require('./lines'));