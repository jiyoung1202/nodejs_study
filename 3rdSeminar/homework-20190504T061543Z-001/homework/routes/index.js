var express = require('express');
var router = express.Router();

//현재 위치 경로: localhost:3000/
router.use('/homework', require('./homework/index'))
router.use('/training', require('./training/index'))


module.exports = router;
//1,2,9 line 꼭 입력되어 있어야 한다.