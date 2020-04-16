
/**
 * Resets the object model containing the image specs
 */
const resetImageSpecs = (imageSpecs) => {
    imageSpecs.filename = '';
    imageSpecs.fileExtension = '';
    imageSpecs.mimetype = '';
    imageSpecs.encoding = '';
    imageSpecs.size = 0;
    imageSpecs.filenameWebp = '';
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

module.exports = {
    resetImageSpecs,
    getImageSpecs,
    printAllRequest
}