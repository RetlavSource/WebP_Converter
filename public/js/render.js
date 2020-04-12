const elements = {
    'messages': document.getElementById('messages')
};

// These are the messages for the different phases of the encoder
const faseMessages = [
    'Analysing image ...',
    'Entering compressor ...',
    'Entering quantityser ...',
    'Entering LZ77 encoder ...',
    'Entering Huffman encoder ...',
    'Entering Entropy encoder ...',
    'Preparing images ...'
];

/**
 * Return the time needed for All the messages to appear
 * @param {Number} timeDelay 
 */
const getTotalMessagesTime = (timeDelay) => {
    // The +1 is the time to render the submit button
    return (faseMessages.length + 1) * timeDelay;
};

// Test function
const renderTest = (message) => {
    console.log(message);
};

/**
 * Inserts the Spinning Loader
 */
const renderLoader = () => {
    const loader = `
        <div class="mySpinner text-center">
            <div class="spinner-border text-primary" role="status"></div>
        </div>
    `;

    elements.messages.insertAdjacentHTML('afterbegin', loader);
};

/**
 * Removes the Spinning Loader
 */
const removeLoader = () => {
    const spinner = document.querySelector('.mySpinner');
    if (spinner) {
        spinner.parentElement.removeChild(spinner);
    }
};

/**
 * Turns Invisible, but still ocupies the place
 */
const stopLoader = () => {
    const spinner = document.querySelector('.mySpinner');
    if (spinner) {
        spinner.classList.add('invisible');
    }
};

/**
 * Insert the Messages
 * @param {Number} timeDelay 
 */
const insertMessages = (timeDelay) => {
    let delay = 0;

    faseMessages.forEach((value, index) => {
        delay += timeDelay;

        const msg = `<h4 class="myTextInfo text-center rangeText">-> ${value}</h4>`;

        setTimeout(() =>{
            elements.messages.insertAdjacentHTML('beforeend', msg);
        }, delay);
    });

    delay += timeDelay;

    const submitBtn = `
        <form id="toCompare" method="POST" action="/singlemagnify">
            <input type="button" class="btn btn-outline-primary myButton" value="Compare Files" id="btnForCompare">
        </form>
    `;

    setTimeout(() =>{
        elements.messages.insertAdjacentHTML('beforeend', submitBtn);
        stopLoader();
    }, delay);
};

/**
 * Removes All the messages, including the loader
 */
const removeAllMessages = () => {
    elements.messages.innerHTML = '';
};