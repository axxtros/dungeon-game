/*
 * Dungeon generátor modul.
 * 10/01/2017
 */

/*
 * Tutorials:
 * http://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/
 * https://infoc.eet.bme.hu/labirintus/ (magyar)
 */

///<reference path="../app.ts"/>

'use strict';

export class DungeonGenerator {

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
        for (var i = 0; i < mapHeight; i++) {
            map[i] = [];
            for (var j = 0; j < mapWidth; j++) {
                map[i][j] = 0;
            }
        }
        return map;
    }

    private mazeGenerator(map: any, x: number, y: number): void {
        var directions = [
            0,  //up
            1,  //down
            2,  //left
            3   //right
        ];

        map[x][y] = 1;  //maze

        for (var i = 0; i < directions.length; i++) {
            var randDir = Math.floor((Math.random() * 4));
            var tempDir = directions[i];
            directions[i] = directions[randDir];
            directions[randDir] = tempDir;
        }

        for (var i = 0; i < directions.length; i++) {
            switch (directions[i]) {
                case 0:     //up
                    if (y >= 2 && map[y - 2][x] != 1) {
                        map[y - 1][x] = 1;
                        this.mazeGenerator(map, x, y - 2);
                    }
                    break;
                case 1:     //down
                    if (y < map.lenght - 2 && map[y + 2][x] != 1) {
                        map[y + 1][x] = 1;
                        this.mazeGenerator(map, x, y + 2);
                    }
                    break;
                case 2:     //left
                    if (x >= 2 && map[y][x - 2] != 1) {
                        map[y][x - 1] = 1;
                        this.mazeGenerator(map, x - 2, y);
                    }
                    break;
                case 3:     //right
                    if (x < map[0].length - 2 && map[y][x + 2] != 1) {
                        map[y][x + 1] = 1;
                        this.mazeGenerator(map, x + 2, y);
                    }
                    break;
            }
        }
    }

    private writeMapToServerConsole(map: any): void {
        console.log('\r\n');
        for (var i = 0; i < map.length; i++) {
            var line = '';           
            for (var j = 0; j < map[i].length; j++) {                
                line += map[i][j] + ' ';
            }
            console.log(line);                          //mert a node szerver log egy cmd, és ott minden egyes log automatikusan egy-egy új sor :)            
        }
        console.log('\r\n');
    }

}