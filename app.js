var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');
    app = express();


// configure views
app.set("view engine", "ejs");
app.set("views", path.join_(__dirname, '/views'));

// configure bodyparser to handle post requests
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// configure database
mongoose.connect('mongodb://<kymed>:<iwantthatqhacks2019>@ds041992.mlab.com:41992/iwantthat');
var db = mongoose.connection;

// start server
app.listen(3000, () => console.log("listening"));
