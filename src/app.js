const path = require('path');
const express = require('express');
const hbs = require('hbs');
const multer = require('multer');
const utils = require('./utils');

const app = express();

const limitFileSize = 6000000;

const imageSpecs = {
    filename: '',
    fileExtension: '',
    mimetype: '',
    encoding: '',
    imageSize: 0,
    imageHight: 0,
    imageWidth: 0,
    filenameWebp: '',
    webpSize: 0,
    compressionValue: 0,
    compressionMethod: 0,
    targetSize: 0,
    isLossless: false,
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
        fileSize: limitFileSize
    },
    fileFilter (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please ulpload an image document!'));
        }
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png)$/)) {
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
 * Clears the object and returns the Home Page
 */
app.get('/', (req, res) => {
    utils.resetImageSpecs(imageSpecs);
    res.render('index', {
        headTitle: 'WebP Encoder',
        scriptFile: 'js/index.js'
    });
});

/**
 * Uploads Images and Convert them to WebP
 */
app.post('/upload', upload.single('imageFile'), async (req, res) => {
    utils.getImageSpecs(imageSpecs, req.file, req.body);

    try {
        await utils.convertFilesImageminWebp(imageSpecs);
        res.json({result: 'Success!!'});
    } catch (error) {
        res.status(400).send({error: 'Compressing Problem!'});
    }
    
}, (error, req, res, next) => {
    res.status(400).send({error: error.message}); // Handle error thrown by new Error
});

// ----POST---- (GET just for testing)
/**
 * Returns the zoom page, builded from a handlebars template
 */
app.post('/singlemagnify', (req, res) => {
    console.log('Entered in POST!');
    // Padding form the window browser width
    const reduceFactor = 200;

    // if (false) {
    if (imageSpecs.filename === '' || imageSpecs.filenameWebp === '') {
        res.render('404', {
            headTitle: '404 Page Not Found!',
            scriptFile: ''
        });
    } else {
        let quality = ''
        if (imageSpecs.isLossless === true) {
            quality = 'effort';
        } else {
            quality = 'quality';
        }
        res.render('singleMagnify', {
            headTitle: 'WebP Encoder - Zoom',
            imagePath: `up_img/${imageSpecs.filename}`,
            imagePathWebP: `up_webp/${imageSpecs.filenameWebp}`,
            imageHight: imageSpecs.imageHight,
            imageWidth: imageSpecs.imageWidth,
            imageSize: utils.addCommasNumber(imageSpecs.imageSize),
            webpSize: utils.addCommasNumber(imageSpecs.webpSize),
            sizeWidth: (imageSpecs.windowWidth - reduceFactor) > imageSpecs.imageWidth ? imageSpecs.imageWidth : imageSpecs.windowWidth - reduceFactor,
            isLossless: imageSpecs.isLossless === true ? 'lossless' : 'lossy',
            compressionValue: imageSpecs.isLossless === false && imageSpecs.targetSize !== 0 ? '' : `, ${quality} ${imageSpecs.compressionValue}%`,
            compressionMethod: imageSpecs.isLossless === false && imageSpecs.targetSize !== 0 ? '' : `, speed ${imageSpecs.compressionMethod}`,
            targetSize: imageSpecs.targetSize === 0 || imageSpecs.isLossless === true ? '' : `, target size ${utils.addCommasNumber(imageSpecs.targetSize)}bytes`,
            scriptFile: 'js/singleMagnify.js'
        });


        // Just for testing
        // res.render('singleMagnify', {
        //     headTitle: 'WebP Encoder - Zoom',
        //     imagePath: 'aux_img/exemple2.jpg',
        //     imagePathWebP: 'aux_img/exemple2.webp',
        //     imageHight: 1200,
        //     imageWidth: 1920,
        //     imageSize: utils.addCommasNumber(1716591),
        //     webpSize: utils.addCommasNumber(1072150),
        //     sizeWidth: 1240,
        //     isLossless: 'lossless',
        //     compressionValue: 95,
        //     compressionMethod: 6,
        //     targetSize: 950000,
        //     scriptFile: 'js/singleMagnify.js'
        // });
    }
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