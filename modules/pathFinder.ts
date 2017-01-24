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

import * as baseClassesModul from "../modules/baseClasses";
import * as utilModul from "../modules/util";

export class Pathfinder extends baseClassesModul.MapBase {

    private util = new utilModul.Util();
    private map: any;
    private startCell: baseClassesModul.MapCell;
    private targetCell: baseClassesModul.MapCell;
    private openCellList = [];
    private closeCellList = [];
    private resultPath = [];

    constructor(gameMap: any, startCellY: number, startCellX: number, targetCellY: number, targetCellX: number) {
        super();
        this.map = gameMap;
        this.startCell = new baseClassesModul.MapCell(startCellY, startCellX, baseClassesModul.CellPathType.STARTING_CELL);
        this.targetCell = new baseClassesModul.MapCell(targetCellY, targetCellX, baseClassesModul.CellPathType.TARGET_CELL);
        this.openCellList = new Array<baseClassesModul.MapCell>();
        this.closeCellList = new Array<baseClassesModul.MapCell>();        
        //csak tesztre, majd töröld ki!!!
        this.resultPath = new Array<number>();
        this.resultPath.push(startCellY);        
        this.resultPath.push(startCellX);        
    }

    public searchPath(): any {
        
        return this.resultPath;
    }
    
}
