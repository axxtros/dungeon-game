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

const enum CellPathCostType {
    NEXT = 1,
    DIAGONAL = 2
};

export class Pathfinder extends baseClassesModul.MapBase {

    private MANHATTAN_MULTIPLE_COST: number = 1;            //manhattem távolság ára
    private DIAGONAL_COST: number = 2;                      //átlós távolság ára
    private NEXT_COST: number = 1;                          //egyenes - szomszédos - cellába történő mozgatás ára

    private util = new utilModul.Util();
    private map: any;
    private startCell: MapCell;
    private targetCell: MapCell;
    private openCellList = [];
    private closeCellList = [];
    private endPathFinding: boolean;                        //ha true, akkor megvan a cél cella    

    constructor(gameMap: any, startCellY: number, startCellX: number, targetCellY: number, targetCellX: number) {
        super();
        console.log('@pf startCellY: ' + startCellY + ' startCellX: ' + startCellX + ' targetCellY: ' + targetCellY + ' targetCellX: ' + targetCellX);
        this.map = gameMap;
        this.startCell = new baseClassesModul.MapCell(startCellY, startCellX, baseClassesModul.CellPathType.STARTING_CELL);
        this.targetCell = new baseClassesModul.MapCell(targetCellY, targetCellX, baseClassesModul.CellPathType.TARGET_CELL);
        this.openCellList = new Array<MapCell>();
        this.closeCellList = new Array<MapCell>();        
        this.endPathFinding = false;        
    }

    public searchPath(): any {
        var currentCell: MapCell = this.startCell;
        this.closeCellList.push(currentCell);
        
        var idx = 10;
        while (!this.endPathFinding /*idx != 0*/) {
            idx--;
            currentCell = this.closeCellList[this.closeCellList.length - 1];
            this.searchNeighborCells(currentCell);
        }
        console.log('@pf end pathfind');
        return this.unboxPathCellCoords();
    }    

    /**
     * Adott cell körüli szomszédos cellák keresése, és h, g és f számítása a megtalált cellára.
     * @param tile Az aktuális cella.
     */
    private searchNeighborCells(currentCell: MapCell) {
        var neighborCell: MapCell;
        //bal-felső cella
        neighborCell = new baseClassesModul.MapCell(currentCell.cellY - 1, currentCell.cellX - 1, baseClassesModul.CellPathType.NA);
        if (this.isTargetCell(neighborCell)) {
            this.endPathFinding = true;
            return;
        }
        if (this.isPassableUnitCell(this.map, neighborCell.cellY, neighborCell.cellX) && !this.isStartCell(neighborCell)) {
            this.calcCellPathValues(neighborCell, CellPathCostType.DIAGONAL);
            this.openCellList.push(neighborCell);
        }
        //felső cella
        neighborCell = new baseClassesModul.MapCell(currentCell.cellY - 1, currentCell.cellX, baseClassesModul.CellPathType.NA);
        if (this.isTargetCell(neighborCell)) {
            this.endPathFinding = true;
            return;
        }
        if (this.isPassableUnitCell(this.map, neighborCell.cellY, neighborCell.cellX) && !this.isStartCell(neighborCell)) {
            this.calcCellPathValues(neighborCell, CellPathCostType.NEXT);
            this.openCellList.push(neighborCell);
        }
        //jobb-felső cella
        neighborCell = new baseClassesModul.MapCell(currentCell.cellY - 1, currentCell.cellX + 1, baseClassesModul.CellPathType.NA);
        if (this.isTargetCell(neighborCell)) {
            this.endPathFinding = true;
            return;
        }
        if (this.isPassableUnitCell(this.map, neighborCell.cellY, neighborCell.cellX) && !this.isStartCell(neighborCell)) {
            this.calcCellPathValues(neighborCell, CellPathCostType.DIAGONAL);
            this.openCellList.push(neighborCell);
        }
        //jobb cella
        neighborCell = new baseClassesModul.MapCell(currentCell.cellY, currentCell.cellX + 1, baseClassesModul.CellPathType.NA);
        if (this.isTargetCell(neighborCell)) {
            this.endPathFinding = true;
            return;
        }
        if (this.isPassableUnitCell(this.map, neighborCell.cellY, neighborCell.cellX) && !this.isStartCell(neighborCell)) {
            this.calcCellPathValues(neighborCell, CellPathCostType.NEXT);
            this.openCellList.push(neighborCell);
        }
        //jobb-alsó cella
        neighborCell = new baseClassesModul.MapCell(currentCell.cellY + 1, currentCell.cellX + 1, baseClassesModul.CellPathType.NA);
        if (this.isTargetCell(neighborCell)) {
            this.endPathFinding = true;
            return;
        }
        if (this.isPassableUnitCell(this.map, neighborCell.cellY, neighborCell.cellX) && !this.isStartCell(neighborCell)) {
            this.calcCellPathValues(neighborCell, CellPathCostType.DIAGONAL);
            this.openCellList.push(neighborCell);
        }
        //alsó cella
        neighborCell = new baseClassesModul.MapCell(currentCell.cellY + 1, currentCell.cellX, baseClassesModul.CellPathType.NA);
        if (this.isTargetCell(neighborCell)) {
            this.endPathFinding = true;
            return;
        }
        if (this.isPassableUnitCell(this.map, neighborCell.cellY, neighborCell.cellX) && !this.isStartCell(neighborCell)) {
            this.calcCellPathValues(neighborCell, CellPathCostType.NEXT);
            this.openCellList.push(neighborCell);
        }
        //bal-alsó cella
        neighborCell = new baseClassesModul.MapCell(currentCell.cellY - 1, currentCell.cellX - 1, baseClassesModul.CellPathType.NA);
        if (this.isTargetCell(neighborCell)) {
            this.endPathFinding = true;
            return;
        }
        if (this.isPassableUnitCell(this.map, neighborCell.cellY, neighborCell.cellX) && !this.isStartCell(neighborCell)) {
            this.calcCellPathValues(neighborCell, CellPathCostType.DIAGONAL);
            this.openCellList.push(neighborCell);
        }
        //bal cella
        neighborCell = new baseClassesModul.MapCell(currentCell.cellY, currentCell.cellX - 1, baseClassesModul.CellPathType.NA);
        if (this.isTargetCell(neighborCell)) {
            this.endPathFinding = true;
            return;
        }
        if (this.isPassableUnitCell(this.map, neighborCell.cellY, neighborCell.cellX) && !this.isStartCell(neighborCell)) {
            this.calcCellPathValues(neighborCell, CellPathCostType.NEXT);
            this.openCellList.push(neighborCell);
        }
        this.selectNextCell(currentCell);
    }

    /**
     * True, ha a paraméterben megadott cella a kezdőcella, amiből el kell indulni.
     * @param cell
     */
    private isStartCell(cell: MapCell): boolean {
        return ((cell.cellY == this.startCell.cellY) && (cell.cellX == this.startCell.cellX));
    }

    /**
     * True, ha a paraméterben megadott cella a célcella, amit el kell érni.
     * @param cell
     */
    private isTargetCell(cell: MapCell): boolean {
        return ((cell.cellY == this.targetCell.cellY) && (cell.cellX == this.targetCell.cellX));
    }

    /**
     * Kiszámolja a paraméterben megkapott cella h, g és f értékeit.
     * @param cell
     */
    private calcCellPathValues(cell: MapCell, cellPathCostType: CellPathCostType): MapCell {
        //h	
        var disy = Math.abs(this.targetCell.cellY - cell.cellY) * this.MANHATTAN_MULTIPLE_COST;
        var disx = Math.abs(this.targetCell.cellX - cell.cellX) * this.MANHATTAN_MULTIPLE_COST;
        cell.h = (disy + disx);
        //g	
        if (cellPathCostType == CellPathCostType.DIAGONAL) {
            cell.g = this.DIAGONAL_COST;
        } else {
            cell.g = this.NEXT_COST;
        }
        //f
        cell.f = cell.g + cell.h;
        return cell;
    }

    private selectNextCell(cell: MapCell): void {
        if (this.openCellList.length > 0) {
            var minCellIndex: number = 0;
            var selectedCell: MapCell = this.openCellList[minCellIndex];
            console.log('@pf selectedCell.f: ' + selectedCell.f + ' selectedCell.h: ' + selectedCell.h);
            for (var idx = (minCellIndex + 1); idx != this.openCellList.length; idx++) {
                console.log('@pf this.openCellList[idx].f: ' + this.openCellList[idx].f + ' this.openCellList[idx].h: ' + this.openCellList[idx].h);
                if ((this.openCellList[idx].f < selectedCell.f) || ((this.openCellList[idx].f == selectedCell.f) && (this.openCellList[idx].h < selectedCell.h))) {
                    selectedCell = this.openCellList[idx];
                    minCellIndex = idx;
                    console.log('@pf selected openCellList[idx].f: ' + this.openCellList[idx].f + ' openCellList[idx].h: ' + this.openCellList[idx].h);
                }
            }
            this.closeCellList.push(selectedCell);
            this.openCellList.splice(minCellIndex, 1);
        } else {
            this.endPathFinding = true;
        }      

        //for (var i = 0; i != this.openCellList.length; i++) {
        //    if (cell.id == this.openCellList[i].id) {
        //        this.openCellList.splice(i, 1);
        //        break;
        //    }            
        //}
        //if (this.openCellList.length > 1) {            
        //    this.sortCellList(this.openCellList);
        //    var selectedElement: MapCell = this.openCellList[0];
        //    this.closeCellList.push(selectedElement);
            
        //} else {
        //    this.endPathFinding = true;            
        //}
    }

    private sortCellList(list: any): void {
        //this.openCellList.sort(list);
        this.openCellList.sort(this.mapCellCompare);
    }

    private mapCellCompare(first: MapCell, second: MapCell) {
        if (first.f < second.f || first.h < second.h)
            return -1;
        if (first.f > second.f || first.h > second.h)
            return 1;
        return 0;
    }

    /**
     * Az útvonal cellák Y, X koordinátáinak visszaadása.
     */
    private unboxPathCellCoords(): Array<number> {
        var resultPath = [];
        for (var i = 0; i != this.closeCellList.length; i++) {
            var pathCell: baseClassesModul.MapCell = this.closeCellList[i];
            resultPath.push(pathCell.cellY);
            resultPath.push(pathCell.cellX);
        }
        return resultPath;
    }

    private cellArraySort(cell1: MapCell, cell2: MapCell): number {
        //http://stackoverflow.com/questions/13211709/javascript-sort-array-by-multiple-number-fields
        return Math.abs(cell1.f - cell2.f); //|| Math.abs(cell1.h - cell2.h);  //több attributum szerinti rendezés
    }

}
