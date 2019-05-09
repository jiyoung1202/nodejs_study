var express = require('express');
var router = express.Router();
//무조건 3줄은 있어야 한다.

/* GET home page. */
router.use('/info', require('./info'));

module.exports = router;