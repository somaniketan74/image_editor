/**
 * Created by dell on 30/7/17.
 */
var ImageModel = require('../models/Image');
var fs = require("fs");
var path = require('path');
var config = require('../config');
var async = require('async');

exports.getImageList = function (req, res, next) {
    var fields = "";
    if (req.query.fields) {
        fields = req.query.fields;
    }
    ImageModel.getImages(fields, undefined, function (err, result) {
        if (err) {
            return next(err);
        }
        res.json(result);
    });
};
exports.getImage = function (req, res, next) {
    var field = "";
    var condition = "";
    if (req.query.field) {
        field = req.query.field;
    }
    if (req.params.id) {
        condition = "id=" + req.params.id;
    }
    ImageModel.getImages(field, condition, function (err, result) {
        if (err) {
            return next(err);
        }
        async.eachSeries(result,function (r,nextr) {
            if(r.image_file){
                var filePath = path.join(config.PROJECT_DIR + '/upload', r.image_file);
                fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
                    if (!err) {
                        r.image=JSON.parse(data);
                        return nextr();
                    } else {
                        return nextr(err);
                    }
                });
            }
            else{
                return nextr();
            }
        },function (err) {
            if(err){
                return next(err);
            }
            res.json(result);
        });
    });
};
exports.deleteImage = function (req, res, next) {
    var condition = "";
    if (req.params.id) {
        condition = "id=" + req.params.id;
    }
    ImageModel.getImages("image_file", condition, function (err, result) {
        if (err) {
            return next(err);
        }
        async.eachSeries(result,function (r,nextr) {
            if(r.image_file){
                var filePath = path.join(config.PROJECT_DIR + '/upload', r.image_file);
                fs.unlink(filePath, function (err) {
                    if(err){
                        return nextr(err);
                    }
                    return nextr();
                })
            }
            else{
                return nextr();
            }
        },function (err) {
            if(err){
                return next(err);
            }
            ImageModel.deleteImage(condition, function (err, result) {
                if (err) {
                    return next(err);
                }
                res.json(result);
            });
        });
    });
};
exports.save = function (req, res, next) {
    if (!req.body) {
        return next(new Error("data not found"));
    }
    if (!req.body.image) {
        return next(new Error("image data not found"));
    }
    var file_name = (new Date()).getTime() + ".json";
    fs.writeFile(config.PROJECT_DIR + '/upload/' + file_name, JSON.stringify(req.body.image), "utf8", function (err) {
        if (err) {
            return next(err);
        }
        ImageModel.saveImage(file_name, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });
    });
};