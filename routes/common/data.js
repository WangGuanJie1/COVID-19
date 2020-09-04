const express = require('express');
const mysql = require('mysql');
const query = require('../modules/mysqlpool');

let router = express.Router();

/**
 * 选择要查询的指令
 * 
 * @method selectComm
 * 
 * @param comm 查询指令键名
 * @param day 查询最近多少天的国家及地区疫情动态
 * 
 * @return sql查询指令
 */
function selectComm(comm) {
    let commList = {
        // 查询近30天全球疫情统计数据
        sta30day: "SELECT * FROM sta30day",
        // 查询近30天全球疫情统计数据
        sta60day: "SELECT * FROM sta60day",
        // 查询近30日国家及地区疫情动态
        ncov30day: "SELECT * FROM ncov30day",
        // 查询近30日国家及地区疫情动态
        ncov60day: "SELECT * FROM ncov60day",
        // 查询近150日国家及地区疫情动态
        ncov150day: "SELECT * FROM ncov150day",
        // 查询最新疫情新闻咨询
        newsnewest: "SELECT * FROM newsnewest",
        // 查询支持的国家英文名称
        enname: "SELECT * FROM country",
        // 查询最新国家及地区疫情动态时间戳
        maxtimeoftrend: "SELECT MAX(reqTime) AS reqTime FROM ncovtrend",
        // 查询近30日每日各洲疫情统计数据
        consta30day: "SELECT * FROM consta30day",
        // 查询近60日每日各洲疫情统计数据
        consta60day: "SELECT * FROM consta60day"
    }

    return commList[comm];
};




router.get('/select', function(req, res) {
    let comm = req.query.comm;
    // let day = req.query.day;
    // let sql = selectComm(comm, day);
    let sql = selectComm(comm);
    let commLimit = typeof(sql) == "undefined" ? true : false;
    //仅允许查询1-10天的国家及地区疫情动态
    // let dayLimit = day <= 0 || day > 10 || typeof(day) == "undefined" ? true : false;
    // console.log("day:", day);

    // console.log(selectComm(comm, day));
    let time = new Date();
    console.log("访问时间：" + time);
    //TODO 条件需要优化
    // if (commLimit && dayLimit) {
    if (commLimit) {
        //TODO 待开发404页
        console.log("有待开发404");
        res.render("common/404");
        return;
    }

    query(sql, null, null, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.json(results);
        }
    });
});


module.exports = router;