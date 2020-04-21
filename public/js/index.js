/**
 * Controls the value of the quality slider.
 * Did not use jQuery, because it doesn´t have constant "oninput" readings.
 */
var slider = document.getElementById("myRange");
var output = document.getElementById("valueRange");
output.innerHTML = slider.value + '%'; // Display the default slider value
slider.oninput = function () {  // Update the current slider value (each time you drag the slider handle)
    output.innerHTML = this.value + '%';
}

/**
 * Controls the value of the speed slider.
 */
var speedSlider = document.getElementById("mySpeed");
var speedOutput = document.getElementById("valueSpeed");
speedOutput.innerHTML = speedSlider.value;
speedSlider.oninput = function () {
    speedOutput.innerHTML = this.value;
}

// Function for some tests
const testEvent = (event) => {
    console.log('Test is ON!');
};

// Tests the loader and messages
const testTheLoader = () => {
    $('#myForm').addClass('setInVisible');
    renderLoader();

    const waiting = 500;
    insertMessages(waiting);
    const waitTime = getTotalMessagesTime(waiting) + (waiting * 3);

    setTimeout(() => {
        removeAllMessages();
        $('#myForm').removeClass('setInVisible');
    }, waitTime);
};

/**
 * Prints all FormData values
 * @param {FormData} formData 
 */
const printFormData = (formData) => {
    formData.forEach((value, key, parent) => {
        console.log(key + ' -> ', formData.get(key));
    });
};

/**
 * Submits the file for compression and returns confirmation on compression result
 * @param {Event} event 
 */
const compressFile = (event) => {
    console.log('Submited Form!!');

    // Sets the input invisible and renders loader
    $('#myForm').addClass('setInVisible');
    renderLoader();

    // Validate File Input - returns the File if valid or false if not
    const theFile = validateFileInput();
    // Validates the sliders and the target size input
    const slidersAndTarget = validateSliderAndTargetInput();
    const formData = new FormData();
    if (!theFile || !slidersAndTarget) {
        console.log('No valid File!');
        // NOT a valid file -> remove loader and resets the input layout
        removeLoader();
        $('#myForm').removeClass('setInVisible');
        return;
    } else {
        console.log('File is valid');
        formData.append('imageFile', theFile);
        formData.append('fileExtension', fileExtension(theFile.name));
        formData.append('compressionValue', slider.value);
        formData.append('compressionMethod', speedSlider.value);
        formData.append('targetSize', $('#targetSize').val());
        formData.append('isLossless', $('#compressionSwitch').is(":checked"));
        formData.append('windowWidth', window.innerWidth);

        // Can NOT BE SET -> headers: {'Content-Type': 'multipart/form-data'}
        // Gives error -> {error: "Multipart: Boundary not found"}
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data.result) {
                console.log('Response--> ', data.result);
                // All OK -> display the messages
                const fileInfo = `Name: ${theFile.name}, type: ${theFile.type}, size: ${theFile.size}bytes ...`;
                insertMessages(500, fileInfo);
            } else if (data.error) {
                console.log('Error--> ', data.error);
                // An ERROR happened -> remove loader and resets the input layout
                removeLoader();
                $('#myForm').removeClass('setInVisible');
                setWarningMessage('ERROR01: Compression could not be completed. Try again ...');
                return;
            } else {
                console.log('Something went wrong!!');
                // An ERROR happened -> remove loader and resets the input layout
                removeLoader();
                $('#myForm').removeClass('setInVisible');
                setWarningMessage('ERROR02: Compression could not be completed. Try again ...');
                return;
            }
        })
        .catch(error => {
            console.log('Catched Error (fetch() error!)--> ', error);
            // An ERROR happened -> remove loader and resets the input layout
            removeLoader();
            $('#myForm').removeClass('setInVisible');
            setWarningMessage('ERROR03: Compression could not be completed. Try again ...');
            return;
        });
    };

    console.log('Passed fetch() API!');
};

/**
 * Displays a warning message
 * @param {String} message 
 */
const setWarningMessage = (message) => {
    // Set Visible the text file and add the message
    const inText = $('#warningText');
    inText.html(message);
    inText.removeClass('invisible');

    // Change the border color
    $('.myFileInput').css('box-shadow', '0px 0px 8px 0px rgb(238, 0, 0)');
};

/**
 * Removes the warning message
 */
const removeWarningMessage = () => {
    // Set Invisible the text file and the message
    const inText = $('#warningText');
    // Checks if there is a class "invisible"
    if (!inText.hasClass('invisible')) {
        inText.addClass('invisible');
    };

    // Change the border color
    $('.myFileInput').css('box-shadow', '0px 0px 8px 0px rgba(0, 123, 238, 1)');
};

/**
 * Accepts a file name and returns the extension as a string
 * @param {String} fileName 
 */
const fileExtension = (fileName) => {
    const sections = fileName.split('.');
    return sections[sections.length - 1];
};

/**
 * Validates the File Input field.
 *  If NOT valid - Adds a warning message and change border color.
 *  If VALID - Removes the warning message and change border color to default.
 * 
 *  Returns JQuery instance of the File Input if valid, and false if not.
 */
const validateFileInput = () => {
    // const theFile = document.getElementById('myFile').files[0];
    const theFile = $('#myFile')[0].files[0];
    let extension = '';
    try {
        extension = fileExtension(theFile.name);
    } catch (error) {
        return false;
    }

    if (!theFile) { // theFile === undefined (not exists)
        console.log('No file chosen!');
        setWarningMessage('Please select an Image File!');
        return false;
    } else if (theFile.type !== 'image/jpeg' && theFile.type !== 'image/png' && theFile.type !== 'image/jpg') {
        setWarningMessage('The file must be an Image File (.jpeg/.png)!');
        return false;
    } else if (theFile.name === '' || theFile === null) {
        setWarningMessage('Please chose an Image File!');
        return false;
    } else if (extension !== 'jpeg' && extension !== 'jpg' && extension !== 'png') {
        setWarningMessage('The file must have an Image Extension (.jpeg/.png)!');
        return false;
    } else if (theFile.size > 5000000 || theFile.size === 0) {
        setWarningMessage('The Image File is too big (Max = 5Mb)!');
        return false;
    } else {
        removeWarningMessage();
        return theFile;
    }
};

/**
 * Validates the range sliders and the target size inputs.
 * 
 * Return a Boolean: true if all OK, and false if all NOT OK
 */
const validateSliderAndTargetInput = () => {
    if (slider.value < 0 || slider.value > 100) {
        return false;
    }

    if (speedSlider.value < 0 || speedSlider.value > 6) {
        return false;
    }

    if ($('#targetSize').val() > 5000000) {
        $('#targetSize').val('5000000');
    } else if ($('#targetSize').val() === '' || $('#targetSize').val() < 0) {
        $('#targetSize').val('0');
    }

    return true;
};

/**
 * Event delegation for the button to show files after compression
 * It submits a form that links to the files compressed
 * @param {Event} event 
 */
const submitCompare = (event) => {
    if (event.target.matches('#btnForCompare')) {
        $('#toCompare').submit();
    }
};

/**
 * Changes the messages for the lossy or lossless selection
 */
const selectTypeCompression = () => {

    if ($('#compressionSwitch').is(":checked")){
        console.log('CHECKED!');
        $('#switchLabel').html('Lossless');
        $('#textQuality').html('Effort in the compression');
        $('#textQualityLeft').html('Fast/Largest');
        $('#textQualityRight').html('Slow/Smallest');
        // Clears target size input
        if (!$('#sizeInput').hasClass('invisible')) {
            $('#sizeInput').addClass('invisible');
        }
        // Checks if the quality and size sliders are visible
        if ($('#rangeQuality').hasClass('invisible')) {
            $('#rangeQuality').removeClass('invisible');
            $('#infoSliders').addClass('invisible');
            $('#rangeSize').removeClass('invisible');
        }
    } else {
        console.log('UNCHECKED!');
        $('#switchLabel').html('Lossy');
        $('#textQuality').html('Quality of the image');
        $('#textQualityLeft').html('Low/Smallest');
        $('#textQualityRight').html('High/Largest');
        // Inserts the target size input
        if ($('#sizeInput').hasClass('invisible')) {
            $('#sizeInput').removeClass('invisible');
            // Insert '0' in target size to prevent showing the input when not '0'
            $('#targetSize').val('');
        }
    }
};

/**
 * Checks the input values of the target size file
 * Modifies the input values if they are not correct
 */
const controlsTargetSize = () => {
    const max = 5000000;
    const min = 0;
    const val = $('#targetSize').val();
    // val is a string, and the compare (>,<,=) makes type-coersion
    if (val > max) {
        $('#targetSize').val(max);
    } else if (val <= min || val === '') {
        $('#targetSize').val('');
    }

    // Disable Range Quality and Range Size
    if (val > 0) {
        if (!$('#rangeQuality').hasClass('invisible')) {
            $('#rangeQuality').addClass('invisible');
            $('#infoSliders').removeClass('invisible');
            $('#rangeSize').addClass('invisible');
        }
    } else {
        if ($('#rangeQuality').hasClass('invisible')) {
            $('#rangeQuality').removeClass('invisible');
            $('#infoSliders').addClass('invisible');
            $('#rangeSize').removeClass('invisible');
        }
    }
};

// ***** LISTENERS *****

// Submit action
$('#submitBtn').on('click', compressFile);

// Checks file input
$('#myFile').on('change', validateFileInput);

// Checks input from the button to show the files after compression
$('#messages').on('click', submitCompare);

// Checks 
$('#compressionSwitch').on('change', selectTypeCompression);

// Controls input values of the target file size
$('#targetSize').on('input', controlsTargetSize);
