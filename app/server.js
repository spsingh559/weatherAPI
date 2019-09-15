const express = require('express')
const app = express()
const router=require('./routes/router');
const port = 3000
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
    next();
  });
  
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    // res.render('error');
  });
 
// parse application/json
app.use(bodyParser.json())
//API Routes
app.use('/api', router);

// app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Weather App listening on port ${port}!`))