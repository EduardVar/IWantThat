var express = require('express'),
    bodyParser = require('body-parser');
    path = require('path');
    multer = require('multer');
    fs = require('fs');
    app = express();
    //appRouter = require('./routes');


// configure views
app.set('views', path.join(__dirname + '/views'));
app.set("view engine", "ejs");

// configure bodyparser to handle post requests
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//configure multer
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

// Import controller
var scraper = require('./controllers/kijiji_scrape');

// home test route
app.get('/', (req, res) => {
    res.render('index');
});

// Import vision
var vision = require('@google-cloud/vision');
var visionClient = new vision.ImageAnnotatorClient();

// post request for image
app.post('/uploadImage', upload.single('image'), (req, res) => {
    if (req.file) {
        let imgPath = __dirname + "/public/images/" + req.file.filename;
        let labelNames = [];

        visionClient.labelDetection(imgPath).then(results => {

        const labels=results[0].labelAnnotations;
        let ignoreLabels = ["Companion dog", "Carnivore", "Snout", "Canidae",
        "Dog breed", "Vertebrate", "Mammal", "Canidae", "Black", "Maroon", "Green", "Olive",
        "Navy", "Purple", "Teal", "Silver", "Gray", "Red", "Lime", "Yellow",
        "Blue", "Fuchsia", "Aqua", "White", "Ancient dog breeds", "Dog", "Cat", "Felidae",
        "Small to medium-sized cats", "Kitten", "Whiskers", "Domestic short-haired cat", "Grass", "Eye",
        "Whiskers", "Grass", "Wildlife", "Terrestrial Animal", "Nose", "Eye", "Animal", "Tail", "Paw"];

        labels.forEach(label => {

            if (!(ignoreLabels.indexOf(label.description) > -1)) {
                labelNames.push(label.description);
            };

        });

        res.render('labels', {labels: labelNames});



        }).catch(err => {
            console.error("ERROR: ", err);
        })

         console.log("deleting file");

        fs.unlink(imgPath, (err) => {
        if (err) {
            console.log("failed to delete local image:"+err);
        } else {
            console.log('successfully deleted local image');
        }
    });

        } else {
            res.send('file not uploaded');
        }
});

// post request for scraping kijiji
app.post('/scrape', (req, res) => {
    /*results = await scraper.search(req.body.label, req.body.minprice, req.body.maxprice);
    results.then(res.json(results));*/
    scraper.search(req.body.label, req.body.minprice, req.body.maxprice).then(result => {
        console.log(result);
        res.render('results.ejs', {results: result})
        console.log("finished scraping");

    }).catch(err => console.error(err));
});


// start server
app.listen(3000, () => console.log("listening"));
