/*
 * Dungeon generátor modul.
 * 10/01/2017
 */

/*
 * Tutorials:
 * http://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/
 */

///<reference path="../app.ts"/>

'use strict';

export class DungeonGenerator {

    constructor() {

    }

    public generator(width: any, height: any): number[][] {
        console.log('@dungeonGenerator.generator() width: ' + width + ' height: ' + height);
        //socket.emit('test_data_from_server', 1, 2);
        var map = [];
        map.push([101, 201]);
        return map;
    }

}