const express = require('express');
const addVisitorIP = require('../modules/add_ip');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    addVisitorIP(req.ip, req.originalUrl);
    res.render('index/analysis');
});

module.exports = router;