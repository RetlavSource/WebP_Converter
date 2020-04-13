
var slider = document.getElementById("myRange");
var output = document.getElementById("valueRange");
output.innerHTML = slider.value === '100' ? 'lossless' : slider.value + '%'; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = this.value === '100' ? 'lossless' : this.value + '%';
}

/**
*  Estrutura da APP
*  -- Verificar se imagem carregada é válida (através de listener) (criar função verificar)
*      -> Se NÃO for válida: 
*          - mudar a border em vermelho (set CSS "box-shadow: 0px 0px 8px 0px rgb(238, 0, 0)")
*          - colocar o texto de aviso visível
*      -> Se for válida:
*          - mudar a border de volta para o original (set CSS "box-shadow: 0px 0px 8px 0px rgba(0, 123, 238, 1)")
*          - colocar o texto de aviso invisível
*  -- ANTES DE SUBMETER
*      -> verificar se imagem carregada é válida
*          - não válida, parar e proceder passos anteriores
*      -> usar a api "fetch()"
*          -> response === 200 (OK):
*              - colocar "display: none;" no CSS da classe pai
*              - imprimir as diversas fazes do processo WebP com "setTimeout()" (ciar div's e preencher elementos)
*              - colocar botão em uma <form>, com a action pretendida e fazer "$('element').submit()"
*                  - como ´so existe este botão, clicando, segue para a outra página
*          -> response !== 200 (NOT OK):
*              - exibir mensagem de erro a pedir para tentar novamente
*              - para a execução
*/

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

const compressFile = (event) => {
    console.log('Submited Form!!');

    testTheLoader();
    return;

    // const theFile = document.getElementById('myFile').files[0];

    // Validate File Input - returns the File if valid or false if not
    const theFile = validateFileInput();
    const formData = new FormData();
    if (!theFile) {
        console.log('No valid File!');
        return;
    } else {
        console.log('File is valid');
        formData.append('imageFile', theFile);
        formData.append('compression', $('#myRange').attr('value'));
        formData.append('windowWidth', window.innerWidth);
    };


    // printFormData(formData);
    return;



    // Function to clear a setTimeout
    setTimeout(() => {
        console.log('Clearing the timeOut ...');
        clearTimeout(timed);
    }, 1500)

    const timed = setTimeout(() => {
        console.log('Submitting ...');

        // fetch('/testapi', {
        //     method: 'POST'
        // })
        // .then((response) => {
        //     return response.text();
        // })
        // .then((data) => {
        //     console.log(data);
        // });

        // $('#myForm').submit();
    }, 2000);


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
 * Validates the File Input field.
 *  If NOT valid - Adds a warning message and change border color.
 *  If VALID - Removes the warning message and change border color to default.
 * 
 *  Returns JQuery instance of the File Input if valid, and false if not.
 */
const validateFileInput = () => {
    // const theFile = document.getElementById('myFile').files[0];
    const theFile = $('#myFile')[0].files[0];

    if (!theFile) { // theFile === undefined (not exists)
        console.log('No file chosen!');
        setWarningMessage('Please select an Image File!');
        return false;
    } else if (theFile.type !== 'image/jpeg' && theFile.type !== 'image/png') {
        setWarningMessage('The file must be an Image File (.jpeg/.png)!');
        return false;
    } else if (theFile.name === '' || theFile === null) {
        setWarningMessage('Please chose an Image File!');
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
    if(event.target.matches('#btnForCompare')) {
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
