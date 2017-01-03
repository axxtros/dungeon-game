//client util services

var DEV_MODE = true;
var DEBUG_MODE = true;

function isDebugMode() {
    return DEBUG_MODE;
}

function isDevMode() {
    return DEV_MODE;
}

function log(msg) {
    if (DEBUG_MODE) {
        console.log(msg);
    }
}