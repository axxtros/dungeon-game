/*
 * Osztályok ősosztályai modul.
 * 23/01/2017
 */

/**
 * A térképpel kapcsolatos osztályok ősosztálya.
 */
export abstract class MapBase {

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