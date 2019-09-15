var router = require('express').Router();

//API Routes directory
var weatherRoutes= require('../api/v1/weather/weather.router');

//Routes for Weather
router.use('/v1/weather', weatherRoutes);

exports = module.exports = router;
