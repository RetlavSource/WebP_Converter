const path = require('path');
const express = require('express');
const hbs = require('hbs');

const app = express();

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
    res.render('index', {
        headTitle: 'WebP Encoder',
        scriptFile: '/js/index.js'
    });
});

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

/**
 * Uploads Images and Convert them to WebP
 */
app.post('/upload', (req, res) => {
    
});

// WILL BE ----POST----
app.post('/singlemagnify', (req, res) => {
    console.log('Entered in POST!');
    
    res.render('singleMagnify', {
        headTitle: 'WebP Encoder - Zoom',
        imagePath: '/up_img/exemple2.jpg',
        imagePathWebP: '/up_webp/exemple1_100.webp',
        sizeWidth: 1340,
        scriptFile: '/js/singleMagnify.js'
    });
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