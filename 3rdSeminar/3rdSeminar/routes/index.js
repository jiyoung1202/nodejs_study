var express = require('express');
var router = express.Router();

router.use('/homework', require('./homework/index'));
router.use('/training', require('./training/index'));

module.exports = router;
