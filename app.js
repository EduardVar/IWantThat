var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');
    path = require('path');
    multer = require('multer');
    fs = require('fs');
    app = express();


// configure views
app.set('views', path.join(__dirname + '/views'));
app.set("view engine", "ejs");

// configure bodyparser to handle post requests
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    }, filename: (req, file, cb) => {
        //cb(null, "image" + path.extname(file.originalname));
        cb(null, file.originalname);
    }
});
var upload = multer({
    storage: storage
});

// configure database
mongoose.connect('mongodb://kymed:iwantthatqhacks2019@ds041992.mlab.com:41992/iwantthat', {
    useNewUrlParser: true
});
var db = mongoose.connection;

<<<<<<< HEAD
// home test route
app.get('/', (req, res) => {
    res.render('home');
});


// post request for image
app.post('/uploadImage', upload.single('image'), (req, res) => {
    if (req.file) {
        res.send('file uploaded');
    } else {
        res.send('file not uploaded');
    }
});

=======
>>>>>>> 003e4b9405c3e20ed7c2636ed269a68467dbcdad
// start server
app.listen(3000, () => console.log("listening"));
