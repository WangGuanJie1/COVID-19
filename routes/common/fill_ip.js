const express = require('express');
const addVisitorIP = require('../modules/add_ip');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    addVisitorIP(req.ip, req.originalUrl);
    res.send("感谢您的贡献：" + req.ip);
});

module.exports = router;