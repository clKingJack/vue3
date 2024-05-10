///bd.js
const mysql = require('mysql2');
// 数据库
const poolSql = mysql.createPool({
    host: 'localhost', //url
    port: 3306, //端口
    user: 'root', //用户名称
    password: 'qazwsx123', //数据库密码
    database: 'changlong', //数据库名称
});

// 查询
function query(sql, value = []) {
    return new Promise((resolve, reject) => {
        poolSql.query(sql, value, (error, result) => {
            error && reject(error); //有错误信息时reject
            resolve(result); //抛出查询结果
        });
    });
}
module.exports = query;
