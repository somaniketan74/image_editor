/**
 * Created by dell on 30/7/17.
 */
var mysql = require('mysql');
var pool =  {};
exports.connect=function (done) {
    pool = mysql.createPool({
        connectionLimit : 100, //important
        host     : 'localhost',
        user     : 'root',
        password : '12345',
        database : 'image',
        debug    :  false
    });
    done();
};
exports.get = function(done) {
    return pool.getConnection(done);
};