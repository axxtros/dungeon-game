﻿//game data storage 23/01/2017

var st_gameMap = null;                 //az éppen aktuális térkép
var st_playerUnitPath = null;

function addNewGameMap(map) {
    st_gameMap = map;
}

function addPath(path) { 
    st_playerUnitPath = path;
}