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

    private ENTR: number = 2;
    private MAZE: number = 1;
    private WALL: number = 0;  

    constructor() {

    }

    public generator(width: number, height: number): any {
        //console.log('@dungeonGenerator.generator() map width: ' + width + ' map height: ' + height);
        var map = this.initMap(width, height);        
        this.mazeGenerator(map, 2, 2);
        //this.writeMapToServerConsole(map);
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
        var cellNum: number = (map.length * map[0].length);
        var cells: { cx: number, cy: number }[] = new Array();
        var selectedElement: number;
        var cx: number = x;
        var cy: number = y;        

        //kezdeti elem elhelyezése a listába
        //map[cy][cx] = this.ENTR;
        cells.push({ cx: cx, cy: cy });

        var idx: number = 20;
        while (cells.length /*idx*/ != 0) {
            idx--;
            //valamelyik elem kiválasztása a listából
            selectedElement = cells.length - 1;     //utolsó elem kiválasztása
            cx = cells[selectedElement].cx;
            cy = cells[selectedElement].cy;

            //irányok összekeverése
            var directions = [
                0,  //up
                1,  //down
                2,  //left
                3   //right
            ];

            for (var i = 0; i < directions.length; i++) {
                var randDir = Math.floor((Math.random() * 4));
                var tempDir = directions[i];
                directions[i] = directions[randDir];
                directions[randDir] = tempDir;
            }

            //végigmegyünk az összes irányon, és ha arra lehet menni, akkor azt betesszük a cells listába
            var upDir: boolean = true;
            var dwDir: boolean = true;
            var ltDir: boolean = true;
            var rtDir: boolean = true;
            for (var i = 0; i < directions.length; i++) {
            //var rDirection = Math.floor((Math.random() * 4));
                switch (directions[i] /*rDirection*/) {
                    case 0:         //up    
                        if (map[cy - 1][cx - 1] != this.WALL &&
                                map[cy - 2][cx - 1] != this.WALL &&
                                map[cy - 2][cx]     != this.WALL &&
                                map[cy - 2][cx + 1] != this.WALL &&
                                map[cy - 1][cx + 1] != this.WALL &&
                                map[cy - 1][cx]     != this.WALL) {
                            map[cy - 1][cx] = this.WALL;                //mind a két járatot fel kell venni, a közvetlen szomszédot,...
                            cells.push({ cx: cx, cy: (cy - 1) });
                            map[cy - 2][cx] = this.WALL;                //...és a következőt is, így nem lesz egymás mellett kettő
                            cells.push({ cx: cx, cy: (cy - 2) });                   
                        } else {
                            upDir = false;                                
                        }
                        break;
                    case 1:         //down
                        if (map[cy + 1][cx - 1] != this.WALL &&
                                map[cy + 2][cx - 1] != this.WALL &&
                                map[cy + 2][cx]     != this.WALL &&
                                map[cy + 2][cx + 1] != this.WALL &&
                                map[cy + 1][cx + 1] != this.WALL &&
                                map[cy + 1][cx]     != this.WALL) {
                            map[cy + 1][cx] = this.WALL;
                            cells.push({ cx: cx, cy: (cy + 1) });
                            map[cy + 2][cx] = this.WALL;
                            cells.push({ cx: cx, cy: (cy + 2) });
                        } else {
                            dwDir = false;
                        }
                        break;
                    case 2:         //left
                        if (map[cy - 1][cx - 1] != this.WALL &&
                                map[cy - 1][cx - 2] != this.WALL &&
                                map[cy][cx - 2]     != this.WALL &&
                                map[cy - 1][cx - 2] != this.WALL &&
                                map[cy - 1][cx - 1] != this.WALL &&
                                map[cy][cx - 1]     != this.WALL) {
                            map[cy][cx - 1] = this.WALL;
                            cells.push({ cx: (cx - 1), cy: cy });
                            map[cy][cx - 2] = this.WALL;
                            cells.push({ cx: (cx - 2), cy: cy });
                        } else {
                            ltDir = false;
                        }
                        break;
                    case 3:         //right
                        if (map[cy - 1][cx + 1] != this.WALL &&
                                map[cy - 1][cx + 2] != this.WALL &&
                                map[cy][cx + 2]     != this.WALL &&
                                map[cy + 1][cx + 2] != this.WALL &&
                                map[cy + 1][cx + 1] != this.WALL &&
                                map[cy][cx + 1]     != this.WALL) {
                            map[cy][cx + 1] = this.WALL;
                            cells.push({ cx: (cx + 1), cy: cy });
                            map[cy][cx + 2] = this.WALL;
                            cells.push({ cx: (cx + 2), cy: cy });
                        } else {
                            rtDir = false;
                        }
                        break;
                }
            }
            
            //ha egyik irányba sem lehet menni, akkor az adott elemet kivesszük a listából
            if (!upDir && !dwDir && !ltDir && !rtDir) {
                cells.splice(selectedElement, 1);         
                //console.log('@cells element delete');                           
            }
            //console.log('@cells.length: ' + cells.length);
        }   //while
                
    }    
    
    private writeMapToServerConsole(map: any): void {
        console.log('\r\n');
        for (var y = 0; y < map.length; y++) {
            var line = '';           
            for (var x = 0; x < map[y].length; x++) {                
                line += map[y][x] + ' ';
            }
            console.log(line);                          //összefüzve egy sorba, mert a node szerver log egy cmd, és ott minden egyes log automatikusan egy-egy új sor :)            
        }
        console.log('\r\n');
    }

}