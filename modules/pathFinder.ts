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
    private DIAGONAL_COST: number = 2;                      //átlós távolság ára (a dungeon-ban alapértelmezetten nem lehet átlósan lépni, ezért itt nincs használva)
    private NEXT_COST: number = 1;                          //egyenes - szomszédos - cellába történő mozgatás ára

    private util = new utilModul.Util();
    private map: any;                                       //az adott térkép, amin az útvonalat keresni kell
    private startCell: MapCell;                             //kiinduláis cella, ahonnét indulunk
    private targetCell: MapCell;                            //célcella, ahová el akarunk jutni
    private openCellList = [];                              //a már megvizsgált de onnan még továbbléphető cellák gyűjtője
    private closeCellList = [];                             //az útvonalba elhelyezett (véglegesített) cellák gyűjtőhelye
    private endPathFinding: boolean;                        //ha true, akkor megvan a cél cella, vége az útkeresésnek
    private reversedPathSearch: boolean;                    //ha true, akkor a célcellából keresünk a kiinduló cella felé útvonalat (megj: általában mindig hosszabb útvonal jön ki, mint normális keresés alatt)

    constructor(gameMap: any, startCellY: number, startCellX: number, targetCellY: number, targetCellX: number, reversedPathSearch: boolean) {
        super();        
        this.map = gameMap;
        this.reversedPathSearch = reversedPathSearch;
        if (!this.reversedPathSearch) {     //normál útvonal keresés, start-tól a target-ig
            this.startCell = new baseClassesModul.MapCell(startCellY, startCellX, null, baseClassesModul.CellPathType.STARTING_CELL);
            this.targetCell = new baseClassesModul.MapCell(targetCellY, targetCellX, null, baseClassesModul.CellPathType.TARGET_CELL);
        } else {                            //fordított útvonalkeresés, a target-től a start-ig
            this.startCell = new baseClassesModul.MapCell(targetCellY, targetCellX, null, baseClassesModul.CellPathType.TARGET_CELL);
            this.targetCell = new baseClassesModul.MapCell(startCellY, startCellX, null, baseClassesModul.CellPathType.STARTING_CELL);
        }        
        this.openCellList = new Array<MapCell>();
        this.closeCellList = new Array<MapCell>();
        this.endPathFinding = false;
    }

    public searchPath(): any {
        if (this.map == null) {
            return null;
        }
        //a kezdő cellának is, és a cél cellának is a térképen kell elhelyezkednie, ha azon nincs rajta akkor nincs útvonalkeresés
        if (!(this.startCell.cellY > 0 && this.startCell.cellY < this.map.length &&
            this.startCell.cellX > 0 && this.startCell.cellX < this.map[0].length &&
            this.targetCell.cellY > 0 && this.targetCell.cellY < this.map.length &&
            this.targetCell.cellX > 0 && this.targetCell.cellX < this.map[0].length)) {
            return null;
        }
        //csak akkor kezdjük el az útvonal keresést, ha a kezdő cella, és a cél cella is egység által járható cella
        if ((this.isPassableUnitCell(this.map, this.startCell.cellY, this.startCell.cellX)) &&
            (this.isPassableUnitCell(this.map, this.targetCell.cellY, this.targetCell.cellX))) {            
            this.generatePath();            
            return this.getFinalPath();
        } else {
            return null;
        }
    }

    private generatePath(): void {
        this.closeCellList.push(this.startCell);
        while (!this.endPathFinding) {
            var selectedCell: MapCell = this.closeCellList[this.closeCellList.length - 1];
            this.searchNeighbourCell(selectedCell);
            if (!this.endPathFinding) {
                this.selectNextCell();
            }
        }
    }

    /**
     * Megkeressük a paraméterben átadott cella lehetséges szomszédjait, amerre lehetne menni.
     * (Átlós cellák a dungeon sajátosságai miatt itt nem jöhetnek szóba, ezért azokban nem is keresünk.)
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
            this._DEBUG_LOG('ERROR: @pathFinder searchNeighbourCell parent is undefinded!');
            console.log('ERROR: @pathFinder searchNeighbourCell parent is undefinded!');
        }        
    }

    private checkCell(cell: MapCell): void {
        if (this.isCellIsTargetCell(cell)) {            
            this.endPathFinding = true;
            return;
        }
        if (this.isPassableUnitCell(this.map, cell.cellY, cell.cellX) && !this.isContainCloseList(cell)) {
            this.calcCellPathValues(cell);
            this.addCellToOpenList(cell);
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
        if (this.openCellList.length > 0) {
            var selectedCellIndex: number = 0;
            var selectedCell: MapCell = this.openCellList[selectedCellIndex];
            for (var i = 0; i != this.openCellList.length; i++) {
                var openCell: MapCell = this.openCellList[i];
                if (openCell.f != 0 && openCell.f < selectedCell.f) {
                    selectedCell = openCell;
                    selectedCellIndex = i;
                }
            }
            //console.log('selectNextCell Y:' + selectedCell.cellY + ' X: ' + selectedCell.cellX);
            this.addCellToCloseList(selectedCell);
            this.removeCellFromOpenList(selectedCell);        
        }        
    }

    private getFinalPath(): Array<number> {
        var result: Array<number> = new Array<number>();
        var pathCell: MapCell = this.closeCellList[this.closeCellList.length - 1];
        var isExistParent: boolean = true;
        for (var i = this.closeCellList.length - 1; i != 0; i--) {
            if (pathCell != null && isExistParent) {                                                        //csak akkor, ha létezik szülő cella
                if (!(pathCell.cellY == this.startCell.cellY && pathCell.cellX == this.startCell.cellX)) {  //hogy a cél cella ne kerüljön be a path-be
                    //http://stackoverflow.com/questions/8073673/how-can-i-add-new-array-elements-at-the-beginning-of-an-array-in-javascript
                    result.unshift(pathCell.cellX);             //shift < - array -> pop
                    result.unshift(pathCell.cellY);             //unshift -> array <- push
                    isExistParent = true;                                                                                    
                }                
            }
            try {
                pathCell = this.getCellFromCloseList(pathCell.parentCell.id);
            } catch (err) {     //az utolsó - start cellának - nincs id-ja, ezért hibát dob, de azt elnyeljük, mert már az az utolsó            
                isExistParent = false;
                this._DEBUG_LOG(err.message);
            }
        }
        //utolsó cellaként hozzáadjuk az utvonalhoz a cél cellát (itt a push miatt először Y-ont, majd X-et!!!)
        result.push(this.targetCell.cellY);
        result.push(this.targetCell.cellX);        
        if (this.isDebugMode()) {
            this.writeConsoleFinalPath(result);
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

    private writeConsoleFinalPath(path: Array<number>): void {
        console.log();
        console.log('path closeCellList length: ' + this.closeCellList.length);
        console.log('path cell length: ' + (path.length / 2));
        console.log('start Y: ' + this.startCell.cellY + ' X: ' + this.startCell.cellX + ' target Y: ' + this.targetCell.cellY + ' X: ' + this.targetCell.cellX);
        var line: string = "";        
        for (var i = 0; i != path.length;) {
            line += ' Y:' + path[i] + ' X:' + path[i + 1] + ' |';
            i += 2;
        }
        console.log(line);
    }

}
