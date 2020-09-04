const express = require('express');
const addVisitorIP = require('../modules/add_ip');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    addVisitorIP(req.ip, req.originalUrl);
    res.render('index/screen', {
        title: 'COVID-19 全球疫情分析大屏',
        titleEn: 'COVID-19 DATA VISUALIZATION',
        dataSources: '数据来源 : 天行数据'
    });
});

module.exports = router;