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
                    
            var idx = 10;
            while (!this.endPathFinding) {
                idx--;
                if (idx == 0) {
                    break;
                }

                var selectedCell: MapCell = this.closeCellList[this.closeCellList.length - 1];
                this.searchNeighbourCell(selectedCell);
                this.selectNextCell();
                            
            }
            return this.getPath();
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
            this.checkCell(neighbourCell);
            //jobb
            neighbourCell = new baseClassesModul.MapCell(parentCell.cellY, parentCell.cellX + 1, parentCell);
            this.checkCell(neighbourCell);
            //alul
            neighbourCell = new baseClassesModul.MapCell(parentCell.cellY + 1, parentCell.cellX, parentCell);
            this.checkCell(neighbourCell);
            //bal
            neighbourCell = new baseClassesModul.MapCell(parentCell.cellY, parentCell.cellX - 1, parentCell);
            this.checkCell(neighbourCell);            
        } else {
            console.log('@pf parent cell error');
        }        
    }

    private checkCell(cell: MapCell): void {
        if (this.isCellIsTargetCell(cell)) {            
            this.endPathFinding = true;
            return;
        }
        if (this.isPassableUnitCell(this.map, cell.cellY, cell.cellX) && !this.isContainCloseList(cell)) {
            this.calcCellPathValues(cell);
            this.addCellToCloseList(cell);
        }
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

    private selectNextCell(): void {
        var selectedCellIndex: number = 0;
        var selectedCell: MapCell = this.openCellList[selectedCellIndex];
        for (var i = 0; i != this.openCellList.length; i++) {
            var openCell: MapCell = this.openCellList[i];
            if (openCell.f != 0 && openCell.f < selectedCell.f) {
                selectedCell = openCell;
                selectedCellIndex = i;
            }
        }
        this.addCellToCloseList(selectedCell);
        this.removeCellFromOpenList(selectedCell);        
    }

    private getPath(): Array<number> {
        var result: Array<number>;
        for (var i = this.closeCellList.length; i != 0; i--) {
            var nextPathCell: MapCell = this.closeCellList[i];
            var nextPathParentCell: MapCell = this.getCellFromCloseList(nextPathCell.id);
            result.push(nextPathParentCell.cellY);
            result.push(nextPathParentCell.cellX);
        }
        return result;
    }

    /**
     * A paraméterben megadott cellát hozzáadja a várakozási cellák listájához, ha abban még - id alapján - nincs benne.
     * @param cell
     */
    private addCellToOpenList(cell: MapCell): void {        
        for (var i = 0; i != this.openCellList.length; i++) {
            var openCell: MapCell = this.openCellList[i];
            if (openCell.id == cell.id) {
                return;
            }
        }
        this.openCellList.push(cell);        
    }

    /**
     * A paraméterben megadott cellát hozzáadja a már korábban megvizsgált cellák listájához, ha abban még - id alapján - nincs benne.
     * @param cell
     */
    private addCellToCloseList(cell: MapCell): void {
        for (var i = 0; i != this.closeCellList.length; i++) {
            var closeCell: MapCell = this.closeCellList[i];
            if (closeCell.id == cell.id) {
                return;
            }
        }
        this.closeCellList.push(cell);
    }

    /**
     * Visszaadja a paraméterben megadott id-jú cellát a megvizsgált cellák listájából.
     * @param cellId
     */
    private getCellFromCloseList(cellId: string): MapCell {        
        for (var i = 0; i != this.closeCellList.length; i++) {
            var closeCell: MapCell = this.closeCellList[i];
            if (closeCell.id == cellId) {
                return closeCell;
            }
        }
        return null;
    }

    /**
     * A paraméterben megadott cellát eltávolítja - id alapján - az openList-ből.
     * @param cell
     */
    private removeCellFromOpenList(cell: MapCell): void {
        for (var i = 0; i != this.openCellList.length; i++) {
            if (this.openCellList[i].id == cell.id) {
                this.openCellList.splice(i, 1);
                return;
            }
        }
    }

    /**
     * A paraméterben megadott cellát eltávolítja - id alapján - a closeList-ből.
     * @param cell
     */
    private removeCellFromCloseList(cell: MapCell): void {
        for (var i = 0; i != this.closeCellList.length; i++) {
            if (this.closeCellList[i].id == cell.id) {
                this.closeCellList.splice(i, 1);
                return;
            }
        }
    }

    /**
     * True, ha a paraméterben megadott cella az útvonal kiinduló cellája.
     * @param cell
     */
    private isCellIsStartCell(cell: MapCell): boolean {
        if (cell.cellY == this.startCell.cellY && cell.cellX == this.startCell.cellX)
            return true;
        return false;
    }

    /**
     * True, ha a paraméterben megadott cella az útvonal célcellája.
     * @param cell
     */
    private isCellIsTargetCell(cell: MapCell): boolean {
        if (cell.cellY == this.targetCell.cellY && cell.cellX == this.targetCell.cellX)
            return true;
        return false;
    }

    /**
     * True, a paraméterben megadott cellát tartalmazza az openList.
     * @param cell
     */
    private isContaintOpenList(cell: MapCell): boolean {
        for (var i = 0; i != this.openCellList.length; i++)
            if (this.openCellList[i].id == cell.id)
                return true;
        return false;
    }

    /**
     * True, ha a paraméterben megadott cellát tartalmazza a closeList.
     * @param cell
     */
    private isContainCloseList(cell: MapCell): boolean {
        for (var i = 0; i != this.closeCellList.length; i++)
            if (this.closeCellList[i].id == cell.id)
                return true;
        return false;
    }

    private cellCompare(first: MapCell, second: MapCell): number {
        if (first.f < second.f)
            return -1;
        if (first.f > second.f)
            return 1;
        return 0;
    }

}
