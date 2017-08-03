var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var db = require('./db_connection');
db.connect(function (err) {
    if (err) {
        console.log('Unable to connect to MySQL.')
        process.exit(1)
    }
});
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use('/', routes);
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});


app.listen(5000);
console.log("Server running on port 3000");
