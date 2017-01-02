//cleints side javascript

var GAME_DIV_WIDTH = 1000;						//1000
var GAME_DIV_HEIGHT = 800;						//800

var gamediv;
var mapCanvas;
var unitCanvas;
var missileCanvas;
var devCanvas;

function initCanvasComponents() {    
    log('Initalizate client side HTML components. START');
    
    var gamediv = document.getElementById('gamediv');
    if (gamediv === null || gamediv === 'undefined') {
        log('Nof find gamediv element!');
        return;
    }
    gamediv.style.width = GAME_DIV_WIDTH + 'px';
    gamediv.style.height = GAME_DIV_HEIGHT + 'px';    
    
    

    log('Initalizate client side HTML components. END');
}

function main() { 
    initCanvasComponents();    
}

main();