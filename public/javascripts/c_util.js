//client util services

var DEV_MODE = true;
var DEBUG_MODE = false;
var ENABLED_MOUSE_EVENT = true;
var ENABLED_KEY_EVENT = true;
var ENABLED_3D_TUTORIAL_CANVAS = true;
var DIV_SLIDE_ANIMATION_SPEED = 100;

var coord3D = {
    x : 0,
    y : 0
};

function isDebugMode() {
    return DEBUG_MODE;
}

function isDevMode() {
    return DEV_MODE;
}

function isEnabledKeyEvents() { 
    return ENABLED_KEY_EVENT;
}

function isEnabledMouseEvents() { 
    return ENABLED_MOUSE_EVENT;
}

function isEnabled3DTutorialCanvas() { 
    return ENABLED_3D_TUTORIAL_CANVAS;
}

function DEBUG_LOG(msg) {
    if (DEBUG_MODE) {
        console.log(msg);
    }
}

/**
 * Az egér canvas koordinátákat átkonvertálja a webGL 3D-s kordinátáivá. 
 */
function c_util_convertMouseClickedCoordTo3DCoord(event, canvas) {
    var x = event.clientX;
    var y = event.clientY;
    var rect = event.target.getBoundingClientRect();
    var result = new Object();
    result.x = (( (x - rect.left) - (canvas.width / 2) ) / (canvas.width / 2) );
    result.y = ( ( (canvas.height / 2) - (y - rect.top) ) / (canvas.height / 2) );
    return result;
}

/**
 * A paraméterben megadott div elem animációval megvalósított le/fel nyitása.
 */ 
function toggleDiv(elementID) {
    if (elementID != null) {
        var element = document.getElementById(elementID);
        if (element != null) { 
            if (element.style.display == 'block') {                
                $(element).slideUp(DIV_SLIDE_ANIMATION_SPEED, function () {
                    element.setAttribute("style", "display:none");
                    //a msg div-ek tartalmát törölni kell, rá kell keresni jqeryvel az msg div-ekre
                });                
            } else {                
                $(element).slideDown(DIV_SLIDE_ANIMATION_SPEED, function () {
                    element.setAttribute("style", "display:block");
                });                
            }
        }        
    }
}