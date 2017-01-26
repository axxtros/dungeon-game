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

    constructor(gameMap: any, startCellY: number, startCellX: number, targetCellY: number, targetCellX: number, a: boolean) {
        super();       
        this.map = gameMap;
        if (a) {
            this.startCell = new baseClassesModul.MapCell(startCellY, startCellX, null, baseClassesModul.CellPathType.STARTING_CELL);
            this.targetCell = new baseClassesModul.MapCell(targetCellY, targetCellX, null, baseClassesModul.CellPathType.TARGET_CELL);
        } else {
            this.startCell = new baseClassesModul.MapCell(targetCellY, targetCellX, null, baseClassesModul.CellPathType.TARGET_CELL);
            this.targetCell = new baseClassesModul.MapCell(startCellY, startCellX, null, baseClassesModul.CellPathType.STARTING_CELL);
        }                
        this.openCellList = new Array<MapCell>();
        this.closeCellList = new Array<MapCell>();        
        this.endPathFinding = false;        
    }

    public searchPath(): any {
        //csak akkor kezdjük el az útvonal keresést, ha a kezdő cella, és a cél cella is egység által járható cella
        if ((this.isPassableUnitCell(this.map, this.startCell.cellY, this.startCell.cellX)) &&
            (this.isPassableUnitCell(this.map, this.targetCell.cellY, this.targetCell.cellX))) {
            
            this.closeCellList.push(this.startCell);
                    
            var idx = 3;
            while (!this.endPathFinding) {
                idx--;
                if (idx == 0) {
                    //break;
                }

                var parentCell: MapCell = this.closeCellList[this.closeCellList.length - 1];
                this.searchNeighbourCell(parentCell);
                var nextCell: MapCell = this.selectMinCell();
                //this.addToCloseList(nextCell);
                this.closeCellList.push(nextCell);
                //this.closeCellList.sort(this.cellArrayCompare);
            }

            var resultPathCells = [];
            for (var i = this.closeCellList.length - 1; i != 0; i--) {
                var pathCell: MapCell = this.closeCellList[i].parentCell;
                resultPathCells.push(pathCell.cellY);
                resultPathCells.push(pathCell.cellX);
            }
            return resultPathCells;
        } else {
            return null;
        }
    }

    /**
     * Megkeressük a paraméterben átadott cella lehetséges szomszédjait, amerre lehetne menni.
     * @param parentCell
     */
    private searchNeighbourCell(parentCell: MapCell): void {
        var neighbourCell: MapCell = null;
        if (parentCell) {
            //fent
            neighbourCell = new baseClassesModul.MapCell(parentCell.cellY - 1, parentCell.cellX, parentCell);
            this.checkAndAddCell(neighbourCell);
            //jobb
            neighbourCell = new baseClassesModul.MapCell(parentCell.cellY, parentCell.cellX + 1, parentCell);
            this.checkAndAddCell(neighbourCell);
            //alul
            neighbourCell = new baseClassesModul.MapCell(parentCell.cellY + 1, parentCell.cellX, parentCell);
            this.checkAndAddCell(neighbourCell);
            //bal
            neighbourCell = new baseClassesModul.MapCell(parentCell.cellY, parentCell.cellX - 1, parentCell);
            this.checkAndAddCell(neighbourCell);

            this.removeCellFromOpenList(parentCell);
        } else {
            console.log('@pf parent cell error');
        }        
    }

    private checkAndAddCell(cell: MapCell): void {
        if (cell.cellY == this.targetCell.cellY && cell.cellX == this.targetCell.cellX) {
            this.endPathFinding = true;
            return;
        }
        if (this.isPassableUnitCell(this.map, cell.cellY, cell.cellX) && !this.isContainCloseList(cell)) {
            this.calcCellPathValues(cell);
            this.addToOpenList(cell);
        }
    }

    /**
     * True, ha a paraméterben megadott cellát tartalmazza a closeList.
     * @param cell
     */
    private isContainCloseList(cell: MapCell): boolean {
        for (var i = 0; i != this.closeCellList.length; i++) {
            if (this.closeCellList[i].id == cell.id) {
                return true;
            }
        }
        return false;
    }

    /**
     * A paraméterben átadott cell h,g,f értékeinek számítása.
     * @param cell
     */
    private calcCellPathValues(cell: MapCell): void {
        //h
        var disy: number = Math.abs(this.targetCell.cellY - cell.cellY) * this.MANHATTAN_MULTIPLE_COST;
        var disx: number = Math.abs(this.targetCell.cellX - cell.cellX) * this.MANHATTAN_MULTIPLE_COST;
        cell.h = (disy + disx);
        //g
        cell.g = this.NEXT_COST;
        //f
        cell.f = (cell.g + cell.h);
    }

    private addToOpenList(cell: MapCell): void {
        var isContain = false;
        for (var idx = 0; idx != this.openCellList.length; idx++) {
            if (this.openCellList[idx].id == cell.id) {
                //this.openCellList[idx].parentCell = cell.parentCell;
                isContain = true;
                break;
            }
        }
        if (!isContain) {
            this.openCellList.push(cell);
        }
    }

    private addToCloseList(cell: MapCell): void {
        for (var i = 0; i != this.closeCellList.length; i++) {            
                                        
        }
        this.closeCellList.push(cell);
        this.closeCellList.sort(this.cellArrayCompare);        
    }

    private removeCellFromOpenList(cell: MapCell): void {
        for (var i = 0; i != this.openCellList.length; i++) {
            if (this.openCellList[i].id == cell.id) {
                this.openCellList.splice(i, 1);
                return;
            }
        }
    }

    private selectMinCell(): MapCell {
        this.openCellList.sort(this.cellArrayCompare);
        var resultIdx: number = 0;        
        var result: MapCell = this.openCellList[resultIdx];
        this.openCellList.splice(resultIdx, 1);        
        return result;
    }

    private cellArrayCompare(first: MapCell, second: MapCell): number {
        if (first.f < second.f || first.h < second.h)
            return -1;
        if (first.f > second.f || first.h > second.h)
            return 1;
        return 0;
    }

}
