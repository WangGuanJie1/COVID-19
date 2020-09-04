const mysql = require('mysql');
const userConfig = require('../../mysql/mysql.config.wang.json');

let pool = mysql.createPool(userConfig);
let query = function(sql, data, options, callback) {

    pool.getConnection((err, connection) => {
        if (err) {
            throw err;
        } else {
            connection.query(sql, [data], (err, results, fields) => {
                callback(err, results, fields);
            });
        }
        connection.release();
    });
};

module.exports = query;