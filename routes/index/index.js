const express = require('express');
const addVisitorIP = require('../modules/add_ip');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    addVisitorIP(req.ip, req.originalUrl);
    res.render('index/index', {
        title: 'COVID-19 数据可视化',
        btn1Name: '数据大屏',
        btn2Name: '动画演示',
        titleEn: 'COVID-19 Information data visualization platform'
    });
});

module.exports = router;