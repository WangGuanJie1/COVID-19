const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const userConfig = require('../../mysql/mysql.config.jiaochuan.json');

let addVisitorIP = function(ip, url) {
    let apiUrl = "http://ip-api.com/json/" + ip + "?lang=zh-CN";
    axios.get(apiUrl).then(res => {
        if (res.data['status'] === "success") {
            let reqTime = parseInt(Date.now() / 1000);
            let data = res.data;
            const keyList = ['country', 'countryCode', 'region', 'regionName', 'city', 'lon', 'lat'];
            let dataList = [];
            dataList.push(reqTime);
            dataList.push(ip);
            dataList.push(url);
            for (const key in keyList) {
                if (data.hasOwnProperty(keyList[key])) {
                    dataList.push(data[keyList[key]]);
                }
            }
            const sql = "INSERT INTO ip (reqTime,ip,url," + keyList.join(",") + ") VALUES ?";
            let connection = mysql.createConnection(userConfig);
            connection.query(sql, [
                [dataList]
            ], (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
            });
            connection.end();
        }
    });
}


module.exports = addVisitorIP;