/*
 * Pathfinder - útvonal kereső - modul.
 * 23/01/2017
 */

/*
 * Tutorials:
 *
 */

///<reference path="../app.ts"/>

'use strict';

import * as utilModul from "../modules/util";

export class Pathfinder {

    private util = new utilModul.Util();
    private map: any;
    private startCellY: number;
    private startCellX: number;
    private targetCellY: number;
    private targetCellX: number;

    constructor(gameMap: any, startCellY: number, startCellX: number, targetCellY: number, targetCellX: number) {
        this.map = gameMap;
        this.startCellY = startCellY;
        this.startCellX = startCellX;
        this.targetCellY = targetCellY;
        this.targetCellX = targetCellX;
    }

    public searchPath(): any {
        console.log('@pathFinder server start...startCellY: ' + this.startCellY + ' startCellX: ' + this.startCellX);
        return 0;
    }

}
