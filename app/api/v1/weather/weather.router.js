const router = require('express').Router();
var multer  = require('multer')
var path   = require('path');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname+'/upload')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
});

const waetherController = require('./weather.controller.js');
router.post('/',multer({storage: storage}).single('file'),waetherController.getWeather);
router.get('/getFile/:fileName',waetherController.getOutput);
exports = module.exports = router;