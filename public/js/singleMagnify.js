
let native_width = 0;
let native_height = 0;

$(document).ready(function () {
    
    // Triggers when window resizes
    $(window).on('resize', checkWidth);

    const image_object = new Image();
    image_object.src = $(".small").attr("src");
    native_width = 3840;//image_object.width;
    native_height = 2400;//image_object.height;
    $('.large').css({'background-size': native_width + 'px ' + native_height + 'px', 'background-repeat': 'no-repeat' });
    //var native_width = 0;
    //var native_height = 0;

    $(".magnify").mousemove(function (e) {
        if (!native_width && !native_height) {

            //var image_object = new Image();
            //image_object.src = $(".small").attr("src");

            //native_width = image_object.width;
            //native_height = image_object.height;
            const strSize = $('.large').css('background-size').split(' ');
            native_width = parseInt(strSize[0].split('px', 1));
            native_height = parseInt(strSize[1].split('px', 1));
        } else {
            var magnify_offset = $(this).offset();
            var mx = e.pageX - magnify_offset.left;
            var my = e.pageY - magnify_offset.top;

            // To test the inputs
            test(magnify_offset, e, mx, my, this);

            if (mx < $(this).width() && my < $(this).height() && mx > 0 && my > 0) {
                $(".large").fadeIn(100);
            } else {
                $(".large").fadeOut(100);
            }
            if ($(".large").is(":visible")) {
                var rx = Math.round(mx / $(".small").width() * native_width - $(".large").width() / 2) * -1;
                var ry = Math.round(my / $(".small").height() * native_height - $(".large").height() / 2) * -1;
                var bgp = rx + "px " + ry + "px";

                var px = mx - $(".large").width() / 2;
                var py = my - $(".large").height() / 2;

                $(".large").css({ left: px, top: py, backgroundPosition: bgp });
            }
        }
    });
});

/**
 *  Testing Parameters
 * 
 * @param {*} magnify_offset 
 * @param {*} e 
 * @param {*} mx 
 * @param {*} my 
 * @param {*} thisClass 
 */
const test = (magnify_offset, e, mx, my, thisClass) => {
    console.log('======================================================================');
    console.log('native_width--> ', native_width, ' -- native_height--> ', native_height);
    console.log('mx-> ', mx, ' = e.pageX-> ', e.pageX, ' - magnify_offset.left--> ', magnify_offset.left);
    console.log('my-> ', my, ' = e.pageY-> ', e.pageY, ' - magnify_offset.top--> ', magnify_offset.top);
    console.log('this-->', thisClass);
    console.log('$(this).width()-> ', $(thisClass).width(), ' -- $(this).height()-> ', $(thisClass).height());
    console.log('$(".large").width()-> ', $(".large").width(), ' -- $(".large").height()-> ', $(".large").height());
    console.log('$(".large").css( "background-size" )-> ', $(".large").css("background-size"), 'TypeOf--> ', typeof ($(".large").css("background-size")));
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
