/**
 * Created by dell on 30/7/17.
 */
var db = require('../db_connection');
exports.getImages=function (fields,cond,next) {
    var fields_name="";
    var condition="";
    if(fields){
        fields_name=fields;
    }
    else{
        fields_name="*";
    }
    if(cond){
        condition="where "+cond;
    }
    var sql="select "+fields_name+" from image_history "+condition;
    console.log(sql);
    executeQuery(sql,function (err,result) {
        if(err){
            return next(err);
        }
        return next(null,result);
    });
};
exports.deleteImage=function (cond,next) {
    var condition="";
    if(cond){
        condition="where "+cond;
    }
    var sql="delete from image_history "+condition;
    console.log(sql);
    executeQuery(sql,function (err,result) {
        if(err){
            return next(err);
        }
        return next(null,result);
    });
};
exports.saveImage=function (image_file,next) {
    var sql="insert into image_history (image_file) values ('"+image_file+"')";
    executeQuery(sql,function (err,result) {
       if(err){
           return next(err);
       }
       return next(null,result);
    });
};

function executeQuery(query,next) {
    db.get(function (err,connection) {
        if(err){
            return next(err);
        }
        connection.query(query,function (err,result) {
            if(err){
                return next(err);
            }
            return next(null,result);
        });
    })
}