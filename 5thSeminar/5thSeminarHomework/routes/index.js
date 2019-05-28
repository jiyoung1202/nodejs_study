var express = require('express');
var router = express.Router();

router.use('/homework', require('./homework/news'));

module.exports = router;
