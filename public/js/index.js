/**
 * Controls the value of the slider.
 * Did not use jQuery, because it doesn´t have constant "oninput" readings.
 */
var slider = document.getElementById("myRange");
var output = document.getElementById("valueRange");
output.innerHTML = slider.value + '%'; // Display the default slider value
slider.oninput = function () {  // Update the current slider value (each time you drag the slider handle)
    output.innerHTML = this.value + '%';
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
    const formData = new FormData();
    if (!theFile) {
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
    };
};

/**
 * Event delegation for the button to show files after compression
 * It submits a form that links to the files compressed
 * @param {Event} event 
 */
const submitCompare = (event) => {
    if (event.target.matches('#btnForCompare')) {
        $('#toCompare').submit();
    };
};

// ***** LISTENERS *****

// Submit action
$('#submitBtn').on('click', compressFile);

// Checks file input
$('#myFile').on('change', validateFileInput);

// Checks input from the button to show the files after compression
$('#messages').on('click', submitCompare);

/*
// Radio button check
function getSelected () {
  if(document.getElementById('one').checked) {
    document.getElementById('txtx').innerHTML = "ONE";
  }else if(document.getElementById('two').checked) {
    document.getElementById('txtx').innerHTML = "TWO";
  }else if(document.getElementById('three').checked) {
    document.getElementById('txtx').innerHTML = "THREE";
  }else if(document.getElementById('four').checked) {
    document.getElementById('txtx').innerHTML = "FOUR";
  }
}
document.getElementById('.sel').addEventListener('click', getSelected);

*/
