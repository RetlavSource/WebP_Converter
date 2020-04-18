// Pre search the DOM for the elements, for fast processing
const largeImage = $(".large1");
const largeImage2 = $(".large2");
const smallImage = $(".small1");
const smallImage2 = $(".small2");
const magnifyZone = $(".magnify1");
const magnifyZone2 = $(".magnify2");

// Controls the value of the ZOOM slider (update is done in listeners zone at bottom)
var zoomSlider = document.getElementById("zoomRange");
var zoomOutput = document.getElementById("zoomValue");
zoomOutput.innerHTML = zoomSlider.value + 'x'; // Display the default slider value

// Some global variables used in the majority of the functions
let native_width = 0;
let native_height = 0;

// Create a global image object type
const image_object = new Image();
image_object.src = smallImage.attr("src");


/**
 * Creates the mesure sizes of the zoomed image for the specified zoom value
 * @param {Number} zoom zoom value
 */
const zoomFactor = zoom => {
    native_width = image_object.width * zoom; // 3840
    native_height = image_object.height * zoom; // 2400
    largeImage.css({ 'background-size': native_width + 'px ' + native_height + 'px', 'background-repeat': 'no-repeat' });
    largeImage2.css({ 'background-size': native_width + 'px ' + native_height + 'px', 'background-repeat': 'no-repeat' });
};

/**
 * Produces the magnfying glass over the browser image
 * @param {Event} event event options object
 */
const magnifyImage = event => {
    if (!native_width && !native_height) {
        const strSize = largeImage.css('background-size').split(' ');
        native_width = parseInt(strSize[0].split('px', 1));
        native_height = parseInt(strSize[1].split('px', 1));
    } else {
        let activeMagnifyZone;
        if (event.target.matches('.magnify1, .magnify1 *')) {
            activeMagnifyZone = magnifyZone;
        } else if (event.target.matches('.magnify2, .magnify2 *')) {
            activeMagnifyZone = magnifyZone2;
        }
        var magnify_offset = activeMagnifyZone.offset();
        var mx = event.pageX - magnify_offset.left;
        var my = event.pageY - magnify_offset.top;

        // To test the inputs
        test(magnify_offset, event, mx, my, activeMagnifyZone);

        if (mx < activeMagnifyZone.width() && my < activeMagnifyZone.height() && mx > 0 && my > 0) {
            largeImage.fadeIn(100);
            largeImage2.fadeIn(100);
        } else {
            largeImage.fadeOut(100);
            largeImage2.fadeOut(100);
        }
        if (largeImage.is(":visible") || largeImage2.is(":visible")) {
            var rx = Math.round(mx / smallImage.width() * native_width - largeImage.width() / 2) * -1;
            var ry = Math.round(my / smallImage.height() * native_height - largeImage.height() / 2) * -1;
            var bgp = rx + "px " + ry + "px";

            var px = mx - largeImage.width() / 2;
            var py = my - largeImage.height() / 2;

            largeImage.css({ left: px, top: py, backgroundPosition: bgp });
            largeImage2.css({ left: px, top: py, backgroundPosition: bgp });
        }
    }
};

/**
 *  Testing Parameters
 * 
 * @param {*} magnify_offset 
 * @param {*} event 
 * @param {*} mx 
 * @param {*} my 
 * @param {*} thisClass 
 */
const test = (magnify_offset, event, mx, my, thisClass) => {
    console.log('======================================================================');
    console.log('native_width--> ', native_width, ' -- native_height--> ', native_height);
    console.log('mx-> ', mx, ' = event.pageX-> ', event.pageX, ' - magnify_offset.left--> ', magnify_offset.left);
    console.log('my-> ', my, ' = event.pageY-> ', event.pageY, ' - magnify_offset.top--> ', magnify_offset.top);
    console.log('thisClass-->', thisClass);
    console.log('thisClass.width()-> ', thisClass.width(), ' -- thisClass.height()-> ', thisClass.height());
    console.log('largeImage.width()-> ', largeImage.width(), ' -- largeImage.height()-> ', largeImage.height());
    console.log('largeImage.css( "background-size" )-> ', largeImage.css("background-size"), 'TypeOf--> ', typeof (largeImage.css("background-size")));
};

/**
 * Checks the maximum WIDTH of the window browser
 *  Use like (jQuery) -> $(window).on('resize', checkWidth)
 */
const checkWidth = () => {
    console.log('======================================================================');
    console.log('outerWidth--> ', window.outerWidth);
    console.log('innerWidth--> ', window.innerWidth);
    console.log('self.innerWidth--> ', self.innerWidth);
    console.log('parent.innerWidth--> ', parent.innerWidth);
    console.log('top.innerWidth--> ', top.innerWidth);
};



// ***** LISTENERS *****

/**
 * Mouse movment over the image1 (original image)
 * (joined an exemple of mouse click, for precise compare)
 */
magnifyZone.mousemove(magnifyImage);

/**
 * Mouse movment over the image2 (webp image)
 * (joined an exemple of mouse click, for precise compare)
 */
magnifyZone2.mousemove(magnifyImage);

/**
 * Triggers when window resizes
 */
$(window).on('resize', checkWidth);

/**
 * Update the current slider value (each time you drag the slider handle),
 * and calls zoomFactor for aply tthe zoom level.
 * Did not use jQuery, because it doesn´t have constant "oninput" readings
 */
zoomSlider.oninput = function () {
    zoomOutput.innerHTML = this.value + 'x';
    zoomFactor(this.value);
}

/**
 * When ALL the page elements loads
 * Starts with a zoom factor of 1x
 */
$(document).ready(function () {
    zoomFactor(1);
});
