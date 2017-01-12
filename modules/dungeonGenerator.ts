/*
 * Dungeon generátor modul.
 * 10/01/2017
 */

/*
 * Tutorials:
 * http://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/
 * https://infoc.eet.bme.hu/labirintus/ (magyar)
 * http://stackoverflow.com/questions/16150255/javascript-maze-generator (van teszt is alatta)
 */

///<reference path="../app.ts"/>

'use strict';

var async = require('async');

export class DungeonGenerator {

    private MAZE: number = 0;
    private WALL: number = 1;

    constructor() {

    }

    public generator(width: number, height: number): any {
        console.log('@dungeonGenerator.generator() map width: ' + width + ' map height: ' + height);
        var map = this.initMap(width, height);        
        this.mazeGenerator(map, 1, 1);      
        this.writeMapToServerConsole(map);
        return map;
    }

    private initMap(mapWidth: number, mapHeight: number): any {
        var map = [];
        for (var y = 0; y < mapHeight; y++) {
            map[y] = [];
            for (var x = 0; x < mapWidth; x++) {                
                if ( (x == 0 || x == mapWidth - 1) || (y == 0 || y == mapHeight - 1) ) {      //a szélek miatt
                    map[y][x] = this.WALL;
                } else {
                    map[y][x] = this.MAZE;
                }                                                 
            }
        }
        return map;
    }    

    private mazeGenerator(map: any, x: number, y: number): void {

    }

    //private mazeGenerator(map: any, x: number, y: number): void {        

    //    var directions = [
    //        0,  //up
    //        1,  //down
    //        2,  //left
    //        3   //right
    //    ];

    //    map[x][y] = 1;  //maze

    //    for (var i = 0; i < directions.length; i++) {
    //        var randDir = Math.floor((Math.random() * 4));
    //        var tempDir = directions[i];
    //        directions[i] = directions[randDir];
    //        directions[randDir] = tempDir;
    //    }

    //    for (var i = 0; i < directions.length; i++) {
    //        switch (directions[i]) {
    //            case 0:     //up
    //                if (y >= 2 && map[y - 2][x] != 1) {
    //                    map[y - 1][x] = 1;
    //                    //this.mazeGenerator(map, x, y - 2);
    //                    setTimeout(function () {
    //                        this.mazeGenerator(map, x, (y - 2));
    //                    }, 1000);
    //                }
    //                break;
    //            case 1:     //down
    //                if (y < map.length - 2 && map[y + 2][x] != 1) {
    //                    map[y + 1][x] = 1;
    //                    //this.mazeGenerator(map, x, y + 2);                        
    //                    setTimeout(function () {
    //                        this.mazeGenerator(map, x, (y + 2));                        
    //                    }, 1000);
    //                }
    //                break;
    //            case 2:     //left
    //                if (x >= 2 && map[y][x - 2] != 1) {
    //                    map[y][x - 1] = 1;
    //                    //this.mazeGenerator(map, x - 2, y);                        
    //                    setTimeout(function () {
    //                        this.mazeGenerator(map, (x - 2), y);                        
    //                    }, 1000);
    //                }
    //                break;
    //            case 3:     //right
    //                if (x < map[0].length - 2 && map[y][x + 2] != 1) {
    //                    map[y][x + 1] = 1;
    //                    //this.mazeGenerator(map, x + 2, y);
    //                    setTimeout(function () {
    //                        this.mazeGenerator(map, (x + 2), y);
    //                    }, 1000);
    //                }
    //                break;
    //        }
    //    }        
    //}

    private writeMapToServerConsole(map: any): void {
        console.log('\r\n');
        for (var i = 0; i < map.length; i++) {
            var line = '';           
            for (var j = 0; j < map[i].length; j++) {                
                line += map[i][j] + ' ';
            }
            console.log(line);                          //összefüzve egy sorba, mert a node szerver log egy cmd, és ott minden egyes log automatikusan egy-egy új sor :)            
        }
        console.log('\r\n');
    }

}