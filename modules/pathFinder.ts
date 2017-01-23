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

class PathCell {

    private _cellY: number;
    private _cellX: number;
    private _g: number;    
    private _h: number;

    constructor(cellY: number, cellX: number) {
        this._cellY = cellY;
        this._cellX = cellX;
    }

    get cellY(): number {
        return this._cellY;
    }

    set cellY(cellY: number) {
        this._cellY = cellY;
    }

    get cellX(): number {
        return this._cellX;
    }

    set cellX(cellX: number) {
        this._cellX = cellX;
    }    

    get g(): number {
        return this._g;
    }

    set g(g: number) {
        this._g = g;
    }  

    get h(): number {
        return this._h;
    }

    set h(h: number) {
        this._h = h;
    }

    get gh(): number {
        return this._g + this._h;
    }
}

export class Pathfinder {

    private util = new utilModul.Util();
    private map: any;
    private startCellY: number;
    private startCellX: number;
    private targetCellY: number;
    private targetCellX: number;
    private resultPath = [];

    constructor(gameMap: any, startCellY: number, startCellX: number, targetCellY: number, targetCellX: number) {
        this.map = gameMap;
        this.startCellY = startCellY;
        this.startCellX = startCellX;
        this.targetCellY = targetCellY;
        this.targetCellX = targetCellX;
        this.resultPath = new Array<number>();
        this.resultPath.push(startCellY);
        this.resultPath.push(startCellX);
    }

    public searchPath(): any {
        console.log('@pathFinder server start...startCellY: ' + this.startCellY + ' startCellX: ' + this.startCellX);
        
        return this.resultPath;
    }

}
