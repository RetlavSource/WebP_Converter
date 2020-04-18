const path = require('path');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const fs = require('fs');
const sizeOf = require('image-size');

/**
 * Resets the object model containing the image specs
 */
const resetImageSpecs = imageSpecs => {
    imageSpecs.filename = '';
    imageSpecs.fileExtension = '';
    imageSpecs.mimetype = '';
    imageSpecs.encoding = '';
    imageSpecs.size = 0;
    imageSpecs.imageHight = 0;
    imageSpecs.imageWidth = 0;
    imageSpecs.filenameWebp = '';
    imageSpecs.webpSize = 0;
    imageSpecs.compressionValue = 0;
    imageSpecs.windowWidth = 0;
};

/**
 * 
 * @param {JSON} imageSpecs 
 * @param {JSON} file 
 * @param {JSON} body 
 */
const getImageSpecs = (imageSpecs, file, body) => {
    imageSpecs.filename = file.filename;
    imageSpecs.fileExtension = body.fileExtension;
    imageSpecs.mimetype = file.mimetype;
    imageSpecs.encoding = file.encoding;
    imageSpecs.size = file.size;
    // Check dimensions of image
    const dimensions = sizeOf(path.join(__dirname, `../public/up_img/${file.filename}`));
    imageSpecs.imageHight = dimensions.height;
    imageSpecs.imageWidth = dimensions.width;
    imageSpecs.filenameWebp = file.filename.replace(/\.(jpg|jpeg|png)$/, `_${body.compressionValue}.webp`);
    imageSpecs.compressionValue = parseInt(body.compressionValue, 10);
    imageSpecs.windowWidth = parseInt(body.windowWidth, 10);
};

/**
 * Prints to log console, ALL the request input objects
 * @param {JSON} body 
 * @param {JSON} file 
 */
const printAllRequest = (body, file) => {
    console.log('File--> ', file);
    console.log('Body--> ', body);
};

/**
 * Comverts Images to WebP format.
 * Uses LOSSY compression
 * Uses "imagemin" and "imageminWebp" plugin
 * @param {JSON} imageSpecs 
 */
const convertFilesLossy = imageSpecs => {
    imagemin(['public/up_img/*.{jpg,png}'], {
        destination: 'public/up_webp',
        plugins: [
            imageminWebp({
                quality: imageSpecs.compressionValue
            })
        ]
    }).then((response) => {
        console.log('Images converted!');
        imageSpecs.filenameWebp = imageSpecs.filename.replace(/\.(jpg|jpeg|png)$/, '.webp');
        fs.stat(path.join(__dirname, `../public/up_webp/${imageSpecs.filenameWebp}`), function(err, stats) {
            imageSpecs.webpSize = stats.size;
            console.log(imageSpecs);
        });
    });
};

/**
 * Add a dot at thousand, million, billion and so far.
 * Returns a string with the number.
 * @param {Number} number 
 */
const addCommasNumber = number => {
    return number.toLocaleString();
};

module.exports = {
    resetImageSpecs,
    getImageSpecs,
    printAllRequest,
    convertFilesLossy,
    addCommasNumber
}