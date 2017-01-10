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

    public generator(width: any, height: any): number[][] {
        console.log('@dungeonGenerator.generator() map width: ' + width + ' map height: ' + height);
        var map = this.initMap(width, height);        
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

    private writeMapToServerConsole(map: any): void {
        for (var i = 0; i < map.length; i++) {
            var line = '';           
            for (var j = 0; j < map[i].length; j++) {                
                line += map[i][j] + ' ';
            }
            console.log(line);                          //mert a node szerver log egy cmd, és ott minden egyes log automatikusan egy-egy új sor :)
            //console.log('\r\n');
        }
    }

}