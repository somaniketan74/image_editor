/**
 * Created by dell on 30/7/17.
 */
var ImageModel = require('../models/Image');

exports.getImageList=function (req,res,next) {
    var fields="";
    if(req.query.fields){
        fields=req.query.fields;
    }
    ImageModel.getImages(fields,undefined,function (err,result) {
        if(err){
            return next(err);
        }
        res.json(result);
    });
};
exports.getImage=function (req,res,next) {
    var field="";
    var condition="";
    if(req.query.field){
        field=req.query.field;
    }
    if(req.params.id){
        condition="id="+req.params.id;
    }
    ImageModel.getImages(field,condition,function (err,result) {
        if(err){
            return next(err);
        }
        res.json(result);
    });
};
exports.deleteImage=function (req,res,next) {
    var condition="";
    if(req.params.id){
        condition="id="+req.params.id;
    }
    ImageModel.deleteImage(condition,function (err,result) {
        if(err){
            return next(err);
        }
        res.json(result);
    });
};
exports.save=function (req,res,next) {
    if(!req.body){
        return next(new Error("data not found"));
    }
    if(!req.body.image){
        return next(new Error("image data not found"));
    }
    ImageModel.saveImage(req.body,function (err,result) {
        if(err){
            return next(err);
        }
        res.json(result);
    });
};