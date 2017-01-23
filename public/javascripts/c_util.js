//client util services

var DEV_MODE = true;
var DEBUG_MODE = true;
var ENABLED_MOUSE_EVENT = true;

function isDebugMode() {
    return DEBUG_MODE;
}

function isDevMode() {
    return DEV_MODE;
}

function isEnabledMouseEvents() { 
    return ENABLED_MOUSE_EVENT;
}

function DEBUG_LOG(msg) {
    if (DEBUG_MODE) {
        console.log(msg);
    }
}