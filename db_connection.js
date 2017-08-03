/**
 * Created by dell on 30/7/17.
 */
var mysql = require('mysql');
var pool =  {};
var mysqlURL=(process.env.DATABASE_URL || 'mysql://root:12345@localhost/image?reconnect=true');
mysqlURL=mysqlURL.substr(8);
mysqlURL=mysqlURL.split(':').join(',').split('@').join(',').split('/').join(',').split('?').join(',').split(',');
exports.connect=function (done) {
    pool = mysql.createPool({
        connectionLimit : 100, //important
        host     : mysqlURL[2],
        user     : mysqlURL[0],
        password : mysqlURL[1],
        database : mysqlURL[3],
        debug    :  false
    });
    done();
};
exports.get = function(done) {
    return pool.getConnection(done);
};