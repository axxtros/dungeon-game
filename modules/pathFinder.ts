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

type MapCell = baseClassesModul.MapCell;                    //típus alias, hogy ne kelljen kiírni mindig a teljes elérést :)
type CellPathType = baseClassesModul.CellPathType;

export class Pathfinder extends baseClassesModul.MapBase {

    private util = new utilModul.Util();
    private map: any;
    private startCell: MapCell;
    private targetCell: MapCell;
    private openCellList = [];
    private closeCellList = [];
    private resultPath = [];
    

    constructor(gameMap: any, startCellY: number, startCellX: number, targetCellY: number, targetCellX: number) {
        super();
        this.map = gameMap;
        this.startCell = new baseClassesModul.MapCell(startCellY, startCellX, baseClassesModul.CellPathType.STARTING_CELL);
        this.targetCell = new baseClassesModul.MapCell(targetCellY, targetCellX, baseClassesModul.CellPathType.TARGET_CELL);
        this.openCellList = new Array<MapCell>();
        this.closeCellList = new Array<MapCell>();
        this.openCellList.push(this.startCell);        
        //csak tesztre, majd töröld ki!!!
        this.resultPath = new Array<number>();
        this.resultPath.push(startCellY);        
        this.resultPath.push(startCellX);        
    }

    public searchPath(): any {
        var heur = this.getCellHeuristic(this.startCell);
        return this.resultPath;
    }

    private getCellHeuristic(cell: MapCell): number {
        var heuristicX: number;
        if (this.targetCell.cellX < cell.cellX) {
            heuristicX = cell.cellX - this.targetCell.cellX; 
        } else if (this.targetCell.cellX > cell.cellX) {
            heuristicX = this.targetCell.cellX - cell.cellX;
        } else if (this.targetCell.cellX == cell.cellX) {
            heuristicX = 0;
        }
        var heuristicY: number;
        if (this.targetCell.cellY < cell.cellY) {
            heuristicY = cell.cellY - this.targetCell.cellY;
        } else if (this.targetCell.cellY > cell.cellY) {
            heuristicY = this.targetCell.cellY - cell.cellY;
        } else if (this.targetCell.cellY == cell.cellY) {
            heuristicY = 0;
        }
        return heuristicY + heuristicX;
    }

}
