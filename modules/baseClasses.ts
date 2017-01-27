/*
 * Osztályok ősosztályai modul.
 * 23/01/2017
 */

/**
 * Lehetséges cellatípusok az útvonalkeresés kapcsán.
 */
export const enum CellPathType {
    STARTING_CELL = 1,              //útvonal kereső induló cella
    TARGET_CELL = 2,                //útvonal kereső cél cella
    NA = 3                          //ez nem olyan cella, amely az útvonalkeresésben részt venne (not avaiable)
};

/**
 * Egy adott térképcellát reprezentáló osztály, minden olyan attributummal, amely szükséges lehet vagy a dungeon generátornak, vagy az útvonal keresőnek.
 */
export class MapCell {
    
    private _cellY: number;
    private _cellX: number;
    private _id: string;
    private _type: number;              //cella típusa
    private _g: number;                 //távolság a kezdettől    
    private _h: number;                 //heuristic, távolság a céltól
    private _f: number;                 //g + h
    private _parentCell: MapCell;       //útvonalban az elöző cellája
    private _pathCellType: CellPathType;

    constructor(cellY: number, cellX: number, parentCell?: MapCell, pathCellType?: CellPathType) {
        this._cellY = cellY;
        this._cellX = cellX;
        this._id = this._cellY + '' + this._cellX;
        this._g = 0;
        this._h = 0;
        this._f = 0;
        if (parentCell) {
            this._parentCell = parentCell;
        } else {
            this._parentCell = null;
        }
        if (pathCellType) {
            this._pathCellType = pathCellType;
        }        
    }

    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get cellY(): number {
        return this._cellY;
    }

    set cellY(cellY: number) {
        this._cellY = cellY;
    }

    get type(): number {
        return this._type;
    }

    set type(type: number) {
        this._type = type;
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
    
    get f(): number {
        return this._g + this._h;
    }

    set f(f: number) {
        this._f = f;
    }

    get pathCellType(): CellPathType {
        return this._pathCellType;
    }

    set pathCellType(pathCellType: CellPathType) {
        this._pathCellType = pathCellType;
    }

    get parentCell(): MapCell {
        return this._parentCell;
    }

    set parentCell(parentCell: MapCell) {
        this._parentCell = parentCell;
    }
}

/**
 * A térképpel kapcsolatos osztályok ősosztálya.
 */
export abstract class MapBase {

    private DEBUG_CONSOLE_PRINT: boolean = false;

    //térkép cella típusok
    private _MAZE: number = 0;                           //folyosó (egységek által járható cellák)
    private _WALL: number = 1;                           //fal (egységek által nem járható cellák)
    private _MBRD: number = 2;                           //térkép határ (MBRD = map border) (nem járható, és ide semmilyen más specifikus cella nem generálható)
    private _ROOM: number = 3;                           //szoba (egységek által járható cellák)    
    private _DOOR: number = 4;                           //ajtó
    private _TEST_POSS_DOOR: number = 5;                 //lehetséges ajtók (teszt miatt)
    private _OKCELL: number = 6;                         //cella bejárva (teszt miatt)

    private _PASSABLE_UNIT_CELLS_TYPE = [this._MAZE, this._DOOR, this._ROOM];                   //egység által bejárható cella típusok
    private _NOT_PASSABLE_UNIT_CELLS_TYPE = [this._WALL, this._MBRD, this._OKCELL];             //egység által nem bejárható cella típusok

    constructor() {

    }

    /**
     * True, ha az adott cella a térképen a játékos egység által bejárható.
     * @param map
     * @param cellY
     * @param cellX
     */
    public isPassableUnitCell(map: any, cellY: number, cellX: number): boolean {
        for (var i = 0; i != this.PASSABLE_UNIT_CELLS_TYPE.length; i++) {
            if (map[cellY][cellX] == this.PASSABLE_UNIT_CELLS_TYPE[i])
                return true;
        }
        return false;
    }

    /**
     * True, ha az adott cella a térképen a játékos által nem bejárható.
     * @param map
     * @param cellY
     * @param cellX
     */
    public isNotPassableUnitCell(map: any, cellY: number, cellX: number): boolean {
        for (var i = 0; i != this.NOT_PASSABLE_UNIT_CELLS_TYPE.length; i++) {
            if (map[cellY][cellX] == this.NOT_PASSABLE_UNIT_CELLS_TYPE[i])
                return true;
        }
        return false;
    }

    public _DEBUG_LOG(msg: string): void {
        if (this.DEBUG_CONSOLE_PRINT) {
            console.log('@map log: ' + msg);
        }
    }

    //getters/setters ---------------------------------------------------------

    /**
     * Folyosó, egységek által járható cella típus.
     */
    get MAZE(): number {
        return this._MAZE;
    }

    /**
     * Fal, egységek által nem járható cella típus.
     */
    get WALL(): number {
        return this._WALL;
    }

    /**
     * Térkép határ (MBRD = map border) (nem járható, és ide semmilyen más specifikus cella nem generálható).
     */
    get MBRD(): number {
        return this._MBRD;
    }

    /**
     * Szoba, egységek által járható cella típus.
     */
    get ROOM(): number {
        return this._ROOM;
    }

    /**
     * Ajtó cella típus.
     */
    get DOOR(): number {
        return this._DOOR;
    }

    /**
     * Lehetséges ajtó (teszt miatt), ahová a rendszer le tud tenni egy adott ajtó cellát.
     */
    get TEST_POSS_DOOR(): number {
        return this._TEST_POSS_DOOR;
    }

    /**
     * A generálás során a rendszer által bejárt cella, tehát ez a cella a játékos számára bejárható, és elérhető. (teszt miatt)
     */
    get OKCELL(): number {
        return this._OKCELL;
    }

    /**
     * Játékos, és gépi egység által bejárható cella típusok listája.
     */
    get PASSABLE_UNIT_CELLS_TYPE(): any {
        return this._PASSABLE_UNIT_CELLS_TYPE;
    }

    /**
     * Játékos, és gépi egység által nem bejárható cella típusok listája.
     */
    get NOT_PASSABLE_UNIT_CELLS_TYPE(): any {
        return this._NOT_PASSABLE_UNIT_CELLS_TYPE;
    }
}