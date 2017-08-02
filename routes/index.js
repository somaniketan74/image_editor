/**
 * Created by dell on 30/7/17.
 */
var express = require('express');
var router = express.Router();
var imageController = require('../controllers/image');;

router.get('/image',imageController.getImageList);
router.get('/image/:id',imageController.getImage);
router.delete('/image/:id',imageController.deleteImage);
router.post('/image',imageController.save);

module.exports = router;