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

    private MAZE: number = 0;                   //folyosó (járható)
    private WALL: number = 1;                   //fall (nem járható)
    private MBRD: number = 2;                   //térkép határ

    constructor() {

    }

    public generator(width: number, height: number): any {        
        var map = this.initMap(width, height);        
        this.mazeGenerator(map, 2, 2);
        this.writeMapToServerConsole(map);
        return map;
    }

    private initMap(mapWidth: number, mapHeight: number): any {
        var map = [];
        for (var y = 0; y < mapHeight; y++) {
            map[y] = [];
            for (var x = 0; x < mapWidth; x++) {                
                if ( (x == 0 || x == mapWidth - 1) || (y == 0 || y == mapHeight - 1) ) {      //a térkép szélek bejelölése
                    //map[y][x] = this.MAZE;
                    map[y][x] = this.MBRD;
                } else {
                    map[y][x] = this.WALL;
                }                                                 
            }
        }
        console.log('@map mapWidth: ' + mapWidth + ' mapHeight: ' + mapHeight);
        return map;
    }    

    private mazeGenerator(map: any, startCellX: number, startCellY: number): void {        
        var cellNum: number = (map.length * map[0].length);
        var cells: { cx: number, cy: number }[] = new Array();
        var selectedElement: number;
        var cx: number = startCellX;                //bejárati cella X
        var cy: number = startCellY;                //bejárat  cella Y

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
                        if (this.checkMapCell(map[cy - 1][cx - 1]) &&
                            this.checkMapCell(map[cy - 2][cx - 1]) &&
                            this.checkMapCell(map[cy - 2][cx]) &&
                            this.checkMapCell(map[cy - 2][cx + 1]) &&
                            this.checkMapCell(map[cy - 1][cx + 1]) &&
                            this.checkMapCell(map[cy - 1][cx])) {
                            map[cy - 1][cx] = this.MAZE;                //mind a két járatot fel kell venni, a közvetlen szomszédot,...
                            cells.push({ cx: cx, cy: (cy - 1) });
                            map[cy - 2][cx] = this.MAZE;                //...és a következőt is, így nem lesz egymás mellett kettő
                            cells.push({ cx: cx, cy: (cy - 2) });
                        } else {
                                upDir = false;
                        }
                        //if (map[cy - 1][cx - 1] != this.MAZE &&
                        //        map[cy - 2][cx - 1] != this.MAZE &&
                        //        map[cy - 2][cx]     != this.MAZE &&
                        //        map[cy - 2][cx + 1] != this.MAZE &&
                        //        map[cy - 1][cx + 1] != this.MAZE &&
                        //        map[cy - 1][cx]     != this.MAZE) {
                        //    map[cy - 1][cx] = this.MAZE;                //mind a két járatot fel kell venni, a közvetlen szomszédot,...
                        //    cells.push({ cx: cx, cy: (cy - 1) });
                        //    map[cy - 2][cx] = this.MAZE;                //...és a következőt is, így nem lesz egymás mellett kettő
                        //    cells.push({ cx: cx, cy: (cy - 2) });                   
                        //} else {
                        //    upDir = false;                                
                        //}
                        break;
                    case 1:         //down
                        if (this.checkMapCell(map[cy + 1][cx - 1]) &&
                            this.checkMapCell(map[cy + 2][cx - 1]) &&
                            this.checkMapCell(map[cy + 2][cx]) &&
                            this.checkMapCell(map[cy + 2][cx + 1]) &&
                            this.checkMapCell(map[cy + 1][cx + 1]) &&
                            this.checkMapCell(map[cy + 1][cx])) {
                            map[cy + 1][cx] = this.MAZE;
                            cells.push({ cx: cx, cy: (cy + 1) });
                            map[cy + 2][cx] = this.MAZE;
                            cells.push({ cx: cx, cy: (cy + 2) });
                        } else {
                            dwDir = false;
                        }
                        //if (map[cy + 1][cx - 1] != this.MAZE &&
                        //        map[cy + 2][cx - 1] != this.MAZE &&
                        //        map[cy + 2][cx]     != this.MAZE &&
                        //        map[cy + 2][cx + 1] != this.MAZE &&
                        //        map[cy + 1][cx + 1] != this.MAZE &&
                        //        map[cy + 1][cx]     != this.MAZE) {
                        //    map[cy + 1][cx] = this.MAZE;
                        //    cells.push({ cx: cx, cy: (cy + 1) });
                        //    map[cy + 2][cx] = this.MAZE;
                        //    cells.push({ cx: cx, cy: (cy + 2) });
                        //} else {
                        //    dwDir = false;
                        //}
                        break;
                    case 2:         //left
                        if (this.checkMapCell(map[cy - 1][cx - 1]) &&
                            this.checkMapCell(map[cy - 1][cx - 2]) &&
                            this.checkMapCell(map[cy][cx - 2]) &&
                            this.checkMapCell(map[cy - 1][cx - 2]) &&
                            this.checkMapCell(map[cy - 1][cx - 1]) &&
                            this.checkMapCell(map[cy][cx - 1])) {
                            map[cy][cx - 1] = this.MAZE;
                            cells.push({ cx: (cx - 1), cy: cy });
                            map[cy][cx - 2] = this.MAZE;
                            cells.push({ cx: (cx - 2), cy: cy });
                        } else {
                            ltDir = false;
                        }
                        //if (map[cy - 1][cx - 1] != this.MAZE &&
                        //        map[cy - 1][cx - 2] != this.MAZE &&
                        //        map[cy][cx - 2]     != this.MAZE &&
                        //        map[cy - 1][cx - 2] != this.MAZE &&
                        //        map[cy - 1][cx - 1] != this.MAZE &&
                        //        map[cy][cx - 1]     != this.MAZE) {
                        //    map[cy][cx - 1] = this.MAZE;
                        //    cells.push({ cx: (cx - 1), cy: cy });
                        //    map[cy][cx - 2] = this.MAZE;
                        //    cells.push({ cx: (cx - 2), cy: cy });
                        //} else {
                        //    ltDir = false;
                        //}
                        break;
                    case 3:         //right
                        if (this.checkMapCell(map[cy - 1][cx + 1]) &&
                            this.checkMapCell(map[cy - 1][cx + 2]) &&
                            this.checkMapCell(map[cy][cx + 2]) &&
                            this.checkMapCell(map[cy + 1][cx + 2]) &&
                            this.checkMapCell(map[cy + 1][cx + 1]) &&
                            this.checkMapCell(map[cy][cx + 1])) {
                            map[cy][cx + 1] = this.MAZE;
                            cells.push({ cx: (cx + 1), cy: cy });
                            map[cy][cx + 2] = this.MAZE;
                            cells.push({ cx: (cx + 2), cy: cy });
                        } else {
                            rtDir = false;
                        }
                        //if (map[cy - 1][cx + 1] != this.MAZE &&
                        //        map[cy - 1][cx + 2] != this.MAZE &&
                        //        map[cy][cx + 2]     != this.MAZE &&
                        //        map[cy + 1][cx + 2] != this.MAZE &&
                        //        map[cy + 1][cx + 1] != this.MAZE &&
                        //        map[cy][cx + 1]     != this.MAZE) {
                        //    map[cy][cx + 1] = this.MAZE;
                        //    cells.push({ cx: (cx + 1), cy: cy });
                        //    map[cy][cx + 2] = this.MAZE;
                        //    cells.push({ cx: (cx + 2), cy: cy });
                        //} else {
                        //    rtDir = false;
                        //}
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

    private checkMapCell(cell: number): boolean {
        return cell != this.MAZE && cell != this.MBRD;
    }

    private writeMapToServerConsole(map: any): void {
        console.log('\r\n');
        for (var y = 0; y < map.length; y++) {
            var line = '';            
            for (var x = 0; x < map[y].length; x++) {                
                if (map[y][x] == this.MAZE) {
                    line += ' ';
                } else if (map[y][x] == this.WALL) {
                    line += 'X';
                } else if (map[y][x] == this.MBRD) {
                    line += 'B';
                }                
            }
            console.log(line);                          //összefüzve egy sorba, mert a node szerver log egy cmd, és ott minden egyes log automatikusan egy-egy új sor :)            
        }
        console.log('\r\n');
    }

}