const path = require('path');
const express = require('express');
const hbs = require('hbs');
const multer = require('multer');

const app = express();

const imageSpecs = {
    filename: '',
    fileExtension: '',
    mimetype: '',
    encoding: '',
    size: 0,
    filenameWebp: '',
    compressionValue: 0,
    windowWidth: 0
};

// Define multer parameters
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/up_img');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname.replace(' ', '_'));
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000
    },
    fileFilter (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please ulpload an image document!'));
        }

        cb(null, true);
    }
});


// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

/**
 * Always pass:
 *  - headTitle
 *  - scriptFile
 */
app.get('/', (req, res) => {
    resetImageSpecs();
    res.render('index', {
        headTitle: 'WebP Encoder',
        scriptFile: 'js/index.js'
    });
});

/**
 * Uploads Images and Convert them to WebP
 */
app.post('/upload', upload.single('imageFile'), (req, res) => {
    imageSpecs.filename = req.file.filename;
    imageSpecs.fileExtension = req.body.fileExtension;
    imageSpecs.mimetype = req.file.mimetype;
    imageSpecs.encoding = req.file.encoding;
    imageSpecs.size = req.file.size;
    imageSpecs.filenameWebp = '';
    imageSpecs.compressionValue = parseInt(req.body.compressionValue, 10);
    imageSpecs.windowWidth = parseInt(req.body.windowWidth, 10);
    console.log(imageSpecs);
    // const {fileExtension, compressionValue, windowWidth} = req.body;
    // const {filename, encoding, size} = req.file;
    // console.log('File--> ', req.file);
    // console.log('Body--> ', req.body);
    // console.log('NEEDED => ', fileExtension, compressionValue, windowWidth, filename, encoding, size);
    res.json({result: 'Success!!'});
}, (error, req, res, next) => {
    res.status(400).send({error: error.message}); // Handle error thrown by new Error
});

// WILL BE ----POST----
app.post('/singlemagnify', (req, res) => {
    console.log('Entered in POST!');
    
    res.render('singleMagnify', {
        headTitle: 'WebP Encoder - Zoom',
        imagePath: 'up_img/exemple2.jpg',
        imagePathWebP: 'up_webp/exemple1_100.webp',
        sizeWidth: 1340,
        scriptFile: 'js/singleMagnify.js'
    });
});

// Endpoint just for testing. Returns an json object.
app.get('/testapi', (req, res) => {
    const objectJson = {
        aNumber: 12345,
        aString: 'This is a string',
        anUrl: 'https://thisIsAnUrl.com',
        anArray: [
            'Sentence isnide the array',
            {
                objectArray: 'Name of object inside the array'
            }
        ]
    };
    res.send(objectJson);
});

// Matches all other routes (404 NOT FOUND ERROR)
app.get('*', (req, res) => {
    res.render('404', {
        headTitle: '404 Page Not Found!',
        scriptFile: ''
    });
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

// Resets the object model of the image
const resetImageSpecs = () => {
    imageSpecs.filename = '';
    imageSpecs.fileExtension = '';
    imageSpecs.mimetype = '';
    imageSpecs.encoding = '';
    imageSpecs.size = 0;
    imageSpecs.filenameWebp = '';
    imageSpecs.compressionValue = 0;
    imageSpecs.windowWidth = 0;
};