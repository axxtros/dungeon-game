/*
 * Dungeon generátor modul.
 * 10/01/2017
 */

/*
 * Tutorials:
 * http://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/
 * https://infoc.eet.bme.hu/labirintus/ (magyar)
 * http://stackoverflow.com/questions/16150255/javascript-maze-generator (van teszt is alatta)
 */

///<reference path="../app.ts"/>

'use strict';

//var async = require('async');
import * as baseClassesModul from "../modules/baseClasses";
import * as utilModul from "../modules/util";


/*
    FELADATOK:
    Kód felgyorsítása, pl. a maze generálsánál addig van benne a while ciklusban, amíg mind a négy irány nem lesz false, ezt lehetne úgy gyorsítani, hogy
    a még lehetséges irányokat tárljuk, és abból választunk, így sok - felesleges - random kört kikerülhetünk.

    Szobák méreteinek jobb beállítása. Csak olyan szobák kerüljenek ki, amelyek vagy nxn-esek, vagy nx(n-1) vagy nx(n+1) méretűek a lehetséges méretek közül.
*/

/**
 * Egy adott térképcellát reprezentáló osztály.
 */
class MapCell {

    private _cellY: number;
    private _cellX: number;
    private _type: number;

    constructor() {
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

    get type(): number {
        return this._type;
    }

    set type(type: number) {
        this._type = type;
    }
}

const enum RoomType {
    HOMOGENEOUS_ROOM = 1,    
    RANDOM_ROOM = 2
};

export class DungeonGenerator extends baseClassesModul.MapBase {    

    private util = new utilModul.Util();

    private DEBUG_CONSOLE_PRINT: boolean = false;

    //a dungeon generálás egyes fázisainak engedélyezése/tiltása
    private ROOM_GENERATOR_ENABLED: boolean = true;
    private MAZE_GENERATOR_ENABLED: boolean = true;
    private DOOR_GENERATOR_ENABLED: boolean = true;
    private MAP_ENTRANCE_CHECK_ENABLED: boolean = true;
    private VISIBLE_POSSIBLE_DOORS: boolean = false;
    private REMOVE_DEAD_CELLS_ENABLED: boolean = true;
    private POST_PROCESSES_ENABLED: boolean = true;
    private TEST_ENTRANCE_MAP_ENABLED: boolean = false;
    private WRITE_MAP_TO_CONSOLE_ENABLED: boolean = false;           

    constructor() {
        super();
    }

    public generator(mapWidth: number, mapHeight: number, roomNumber: number, doorsPerRoom: number): any {        
        var map = this.initMap(mapWidth, mapHeight);
        var entranceCheckMap: any;
        if (this.ROOM_GENERATOR_ENABLED) {
            this.roomGenerator(map, roomNumber, RoomType.HOMOGENEOUS_ROOM);
        }
        if (this.MAZE_GENERATOR_ENABLED) {
            this.mazeGenerator(map);
        }
        if (this.ROOM_GENERATOR_ENABLED && this.DOOR_GENERATOR_ENABLED) {
            this.doorGenerator(map, doorsPerRoom);
        }
        if (this.ROOM_GENERATOR_ENABLED && this.MAZE_GENERATOR_ENABLED && this.DOOR_GENERATOR_ENABLED && this.MAP_ENTRANCE_CHECK_ENABLED) {
            entranceCheckMap = this.mapEntranceCheck(map, false);
            this.eraseNotEntranceCellFromMap(map, entranceCheckMap);
        }
        if (this.MAZE_GENERATOR_ENABLED && this.REMOVE_DEAD_CELLS_ENABLED) {
            this.removeDeadEndCells(map);
        }
        if (this.ROOM_GENERATOR_ENABLED && this.MAZE_GENERATOR_ENABLED && this.DOOR_GENERATOR_ENABLED && this.REMOVE_DEAD_CELLS_ENABLED && this.POST_PROCESSES_ENABLED) {
            this.mapPostProcesses(map);
        }
        if (this.TEST_ENTRANCE_MAP_ENABLED) {
            this.mapEntranceCheck(map, true);
        }
        if (this.ROOM_GENERATOR_ENABLED && this.MAZE_GENERATOR_ENABLED && this.DOOR_GENERATOR_ENABLED && this.WRITE_MAP_TO_CONSOLE_ENABLED) {
            this.writeMapToServerConsole(map);
        }           
        return map;
    }

    private initMap(mapWidth: number, mapHeight: number): any {
        var map = [];
        mapWidth += (mapWidth % 2 == 0 ? 1 : 0);                                            //hogy mindig biztosan páratlan legyen a térkép szélessége és
        mapHeight += (mapHeight % 2 == 0 ? 1 : 0);                                          //magassága
        for (var cellY = 0; cellY < mapHeight; cellY++) {
            map[cellY] = [];
            for (var cellX = 0; cellX < mapWidth; cellX++) {                
                if ((cellX == 0 || cellX == mapWidth - 1) || (cellY == 0 || cellY == mapHeight - 1)) {      //a térkép szélek bejelölése
                    map[cellY][cellX] = this.MBRD;                    
                } else {
                    map[cellY][cellX] = this.WALL;                    
                }                                                 
            }
        }
        this._DEBUG_LOG('@map init mapWidth: ' + mapWidth + ' mapHeight: ' + mapHeight);        
        return map;
    }

    /**
     * A térképen található szobák generálása.
     * @param map Térkép.
     * @param roomNumber Ennyi szobát próbál meg begenerálni, de ha átlapolás van már egy korábban lerakott szobával, akkor azt kihagyja.
     * @homogeneousRooms Ha true, akkor a szobák szélessége és magassága csak kis mértékben térnek el egymástól, 'kicsi, takaros' szobák lesznek.
     */
    private roomGenerator(map: any, roomNumber: number, roomType: RoomType): void {
        roomNumber < 2 ? roomNumber = 2 : roomNumber = roomNumber;  //mert minimum két szoba kell a maze-ek törlése miatt
        
        //egy szoba lehetséges cella szélessége/magassága a kiválasztott középponthoz képest, csak páratlan érték lehet!!!
        var POSSIBLE_ROOM_SIZES = [3, 5, 7, 9/*, 11, 13, 15, 17, 19, 21*/];
        var ROOM_SIZE_MIN = POSSIBLE_ROOM_SIZES[0];
        var ROOM_SIZE_MAX = POSSIBLE_ROOM_SIZES[POSSIBLE_ROOM_SIZES.length - 1];
        var generatedRoomCounter: number = 0;                   //hagyd benne!
        var ROOM_OVERLAPPING_EXCEPTION_MAXIMUM: number = 100;   //ez egy viszonyítási szám, nagyjából kb. ha már 100-szor nem tud szobát elhelyezni a térképen, akkor már nincs hely újabb szobáknak
        var overlappingCounter: number = 0;                     //ha már túl sok a szoba átfedés, akkor az már valószinüleg azért van, mert a térkép méretéhez képest
        var overlappingException: boolean = false;              //nem lehet további szobákat lerakni, ekkor elég annyi szoba, amennyi már le van generálva

        //FONTOS:   Egy adott szoba X, Y cella koordinátájának mindig páros számmnak kell lennie, a szoba szélességének, 
        //          illetve hosszúságának pedig mindig páratlannak kell lennie!            
        var roomWidth: number;
        var roomHeight: number;

        while ((generatedRoomCounter != roomNumber) && !overlappingException) {                       

            if (roomType == RoomType.HOMOGENEOUS_ROOM) {
                var randomRoomWidth: number = this.util.getRandomNumberMinMax(ROOM_SIZE_MIN, ROOM_SIZE_MAX);                
                var randomChoose = this.util.getRandomNumberMinMax(0, 1);
                switch (randomChoose) {
                    case 0: randomRoomWidth += (randomRoomWidth % 2 == 0 ? 1 : 0); break;
                    case 1: randomRoomWidth -= (randomRoomWidth % 2 == 0 ? 1 : 0); break;
                }
                var randomRoomHeight: number;
                randomChoose = this.util.getRandomNumberMinMax(0, 2);
                switch (randomChoose) {
                    case 0:
                        if (randomRoomWidth != ROOM_SIZE_MIN) {
                            randomRoomHeight = randomRoomWidth - 2;
                        } else {
                            randomRoomHeight = randomRoomWidth + 2;
                        }                       
                        break;
                    case 1: randomRoomHeight = randomRoomWidth;
                        break;
                    case 2:
                        if (randomRoomWidth != ROOM_SIZE_MAX) {
                            randomRoomHeight = randomRoomWidth + 2;
                        } else {
                            randomRoomHeight = randomRoomWidth - 2;
                        }
                        break;
                }
                roomWidth = randomRoomWidth;
                roomHeight = randomRoomHeight;
                this._DEBUG_LOG('@room roomWidth: ' + roomWidth + ' roomHeight: ' + roomHeight);                
            } else {
                roomWidth = POSSIBLE_ROOM_SIZES[Math.floor((Math.random() * POSSIBLE_ROOM_SIZES.length))];
                roomHeight = POSSIBLE_ROOM_SIZES[Math.floor((Math.random() * POSSIBLE_ROOM_SIZES.length))];
            }            

            //a szoba nem lóghat ki a térképről, ezért az X és Y meghatározása a szélek figyelésével generálódik
            //+ a szoba egyetlen cellája sem lehet rajta a térkép határon (nem lehet közvetlenül a térkép szélén) [ezért van a +2 , -2]
            var roomX = Math.floor((Math.random() * ((map[0].length - 2) - roomWidth))) + 2;    //-2, hogy bal oldalt ne lógjon ki a szélre, +2, hogy jobb oldalon ne lógjon ki a térképről
            roomX -= (roomX % 2 != 0 ? 1 : 0);
            var roomY = Math.floor((Math.random() * ((map.length - 2) - roomHeight))) + 2;      //-2, hogy alul ne lógjon ki a szélre, +2, hogy felül ne lógjon ki a térképről
            roomY -= (roomY % 2 != 0 ? 1 : 0);

            this._DEBUG_LOG('@room roomX: ' + roomX + ' roomY: ' + roomY + ' roomWidth:' + roomWidth + ' roomHeight: ' + roomHeight);
            var roomValidate = true;

            //a szoba nem fedhet le másik szobát (overlapping)
            for (var ry = roomY; ry != (roomY + roomHeight); ry++) {
                for (var rx = roomX; rx != (roomX + roomWidth); rx++) {
                    if (map[ry][rx] == this.ROOM) {
                        this._DEBUG_LOG('@room overlapping');
                        roomValidate = false;
                        break;
                    }
                    if (!roomValidate) break;
                }
                if (!roomValidate) break;
            }

            //két szoba között minimum egy, de mindenképpen páratlan térképrácsnak kell lennie - minden oldalról
            //Ez a feltétel, a szoba fenti (számolt) lehelyezéséből adódóan mindig igaz lesz.

            //ha szoba validációja rendben lefutott, akkor beírjuk a szobát a térképbe
            if (roomValidate) {
                generatedRoomCounter++;
                for (var ry = roomY; ry != (roomY + roomHeight); ry++) {
                    for (var rx = roomX; rx != (roomX + roomWidth); rx++) {
                        map[ry][rx] = this.ROOM;
                    }
                }
            } else {
                overlappingCounter++;
            }

            if (overlappingCounter == ROOM_OVERLAPPING_EXCEPTION_MAXIMUM) {                
                overlappingException = true;
                this._DEBUG_LOG('@room overlapping exception');
            }            
        }                        
        this._DEBUG_LOG('@room Needed room number / generated room: ' + roomNumber + ' / ' + generatedRoomCounter);
    }

    private mazeGenerator(map: any): void {
        //kitöltetlen helyek keresése labirintus generálásra
        for (var cellY = 1; cellY < map.length - 1; cellY++) {
            for (var cellX = 1; cellX < map[0].length - 1; cellX++) {
                if (this.checkIsNeedMazeGenerated(map, cellY, cellX)) {
                    this.createMaze(map, cellY, cellX);
                }
            }
        }
    }

    /**
     * True, ha egy adott cellát teljes egészében fal vesz körül, mert akkor ott labirintust kell generálni,
     * hogy ne legyenek kitöltetlen helyek a térképen. (Például két szoba összezáródásánál.)
     * @param cellY Adott térkép cell Y koordinátátja.
     * @param cellX Adott térkép cell X koordinátátja.
     */
    private checkIsNeedMazeGenerated(map: any, cellY: number, cellX: number): boolean {
        if (map[cellY - 1][cellX - 1] == this.WALL &&
            map[cellY - 1][cellX] == this.WALL &&
            map[cellY - 1][cellX + 1] == this.WALL &&
            map[cellY][cellX + 1] == this.WALL &&
            map[cellY + 1][cellX + 1] == this.WALL &&
            map[cellY + 1][cellX] == this.WALL &&
            map[cellY + 1][cellX - 1] == this.WALL &&
            map[cellY][cellX - 1] == this.WALL) {
            return true;            
        } 
        return false;
    }

    /**
     * Körmentes (perfect) labirintus generátor.
     * @param map Térkép
     * @param startX Kezdő térkép cellája X koordinátája.
     * @param startY Kezdő térkép cellája Y koordinátája.
     */
    private createMaze(map: any, startY: number, startX: number): void {
        startX += (startX % 2 != 0 ? 1 : 0);                                                //a kezdeti celláknak mindig páros koordinátákon kell elhelyezkednie
        startY += (startY % 2 != 0 ? 1 : 0);
        if (startX < 2) { startX = 2; }                                                     //biztosítékok, hogy a kezdő hely ne legyen a térképen kívűl
        if (startX > map[0].length) { startX = map[0].length - 3; }                         //azért 3, mert a térkép mindig páratlan széles (init-nél biztosítva), páratlanból páratlan pedig mindig páros lesz
        if (startY < 2) { startY = 2; }
        if (startY > map.length) { startY = map.length - 3; }
        var cellNum: number = (map.length * map[0].length);
        var cells: { cy: number, cx: number }[] = new Array();
        var cy: number;
        var cx: number;
        var selectedElement: number;

        map[startY][startX] = this.MAZE;                                                    //kezdeti koordináták elhelyezése
        cells.push({ cy: startY, cx: startX });
        
        while (cells.length != 0) {            
            var upDir: boolean = true;
            var dwDir: boolean = true;
            var ltDir: boolean = true;
            var rtDir: boolean = true;
            var next: boolean = false;
            selectedElement = cells.length - 1;
            cx = cells[selectedElement].cx;
            cy = cells[selectedElement].cy;
            while (!((next) || (!upDir && !dwDir && !ltDir && !rtDir))) {
                var selectedRandDirection = Math.floor((Math.random() * 4));                //0: UP, 1: DOWN, 2: LEFT, 3: RIGHT
                switch (selectedRandDirection) {
                    case 0:     //UP
                        if (upDir &&
                            this.checkMapCell(map[cy - 1][cx]) &&
                            this.checkMapCell(map[cy - 1][cx - 1]) &&
                            this.checkMapCell(map[cy - 2][cx - 1]) &&
                            this.checkMapCell(map[cy - 2][cx]) &&
                            this.checkMapCell(map[cy - 2][cx + 1]) &&
                            this.checkMapCell(map[cy - 1][cx + 1])) {
                            map[cy - 1][cx] = this.MAZE;                                    //mind a két járatot fel kell venni, a közvetlen szomszédot, és a következőt is, így nem lesz egymás mellett kettő
                            cells.push({ cy: (cy - 1), cx: cx });
                            map[cy - 2][cx] = this.MAZE;
                            cells.push({ cy: (cy - 2), cx: cx });
                            next = true;
                        } else {
                            upDir = false;
                        }
                        break;
                    case 1:     //DOWN
                        if (dwDir &&
                            this.checkMapCell(map[cy + 1][cx]) &&
                            this.checkMapCell(map[cy + 1][cx - 1]) &&
                            this.checkMapCell(map[cy + 2][cx - 1]) &&
                            this.checkMapCell(map[cy + 2][cx]) &&
                            this.checkMapCell(map[cy + 2][cx + 1]) &&
                            this.checkMapCell(map[cy + +1][cx - 1])) {
                            map[cy + 1][cx] = this.MAZE;
                            cells.push({ cy: (cy + 1), cx: cx });
                            map[cy + 2][cx] = this.MAZE;
                            cells.push({ cy: (cy + 2), cx: cx });
                            next = true;
                        } else {
                            dwDir = false;
                        }
                        break;
                    case 2:     //LEFT
                        if (ltDir &&
                            this.checkMapCell(map[cy][cx - 1]) &&
                            this.checkMapCell(map[cy - 1][cx - 1]) &&
                            this.checkMapCell(map[cy - 1][cx - 2]) &&
                            this.checkMapCell(map[cy][cx - 2]) &&
                            this.checkMapCell(map[cy + 1][cx - 2]) &&
                            this.checkMapCell(map[cy + 1][cx - 1])) {
                            map[cy][cx - 1] = this.MAZE;
                            cells.push({ cy: cy, cx: (cx - 1) });
                            map[cy][cx - 2] = this.MAZE;
                            cells.push({ cy: cy, cx: (cx - 2) });
                            next = true;
                        } else {
                            ltDir = false;
                        }
                        break;
                    case 3:     //RIGHT
                        if (rtDir &&
                            this.checkMapCell(map[cy][cx + 1]) &&
                            this.checkMapCell(map[cy - 1][cx + 1]) &&
                            this.checkMapCell(map[cy - 1][cx + 2]) &&
                            this.checkMapCell(map[cy][cx + 2]) &&
                            this.checkMapCell(map[cy + 1][cx + 2]) &&
                            this.checkMapCell(map[cy + 1][cx + 1])) {
                            map[cy][cx + 1] = this.MAZE;
                            cells.push({ cy: cy, cx: (cx + 1) });
                            map[cy][cx + 2] = this.MAZE;
                            cells.push({ cy: cy, cx: (cx + 2) });
                            next = true;
                        } else {
                            rtDir = false;
                        }
                        break;
                }
            }
            if (!upDir && !dwDir && !ltDir && !rtDir) {
                cells.splice(selectedElement, 1);             
            }
        }
    }        

    /**
     * True, ha a paraméterben megadott cella nem a felsoroltak közül való.
     * @param cell
     */
    private checkMapCell(cell: number): boolean {
        return (
            (cell != this.MAZE) &&
            (cell != this.MBRD) &&
            (cell != this.ROOM));
    }

    /**
     * Ajtógenerálás, szoba-labirintus, illetve szoba-szoba között.
     * @param map Térkép.
     * @param doorsPerRoom Egy adott szobának hány ajtaja legyen. (Ideális eset 2.)
     */
    private doorGenerator(map: any, doorsPerRoom: number): void {
        if (doorsPerRoom == 0)
            return;        

        doorsPerRoom = 3;           //Azért van beégetve, mert így szép a labirintus. Egy ajtóval nem biztos, hogy minden szobának lesz ajtaja,
                                    //ennél több ajtóval pedig 'hülyén' néz ki a labirintus. Ez így legyen jó, később majd meglátjuk. :)        

        //Összeszedjük a szobákat, azokat a térkép cellákat keressük meg, amelyek egy adott szoba bal-felső sarkát reprezentálják.
        //Utána minden egyes megtalált szoba szélein végig kell menni, és össze kell gyűjteni azokat a celláikat, 
        //amelyek mellett egy WALL, utána pedig vagy MAZE, vagy pedig egy ROOM cella található.Ezek melletti WALL cellát lehet
        //kicserélni DOOR típusú cellára, amely egy ajtót reprezentál a térképen. A megtalált cellák közül véletlenszerűen kell
        //választani egyet vagy többet.
        var mapDoorCells: { cy: number, cx: number }[] = new Array();
        if (this.VISIBLE_POSSIBLE_DOORS) {
            var allDoorCells: { cy: number, cx: number }[] = new Array();       //tesztre, hogy lássak minden lehetséges ajtó cellát, ne töröld ki!!!
        }

        for (var cy = 1; cy < map.length; cy++) {
            for (var cx = 1; cx < map[0].length; cx++) {

                //egy szoba bal-felső sarka
                if (map[cy][cx] == this.ROOM && (map[cy][cx - 1] == this.WALL || map[cy][cx - 1] == this.DOOR) && (map[cy - 1][cx] == this.WALL || map[cy - 1][cx] == this.DOOR)) {
                    var possibleMazeDoors: { cy: number, cx: number }[] = new Array();  //folyosó és szoba közötti ajtók
                    var possibleRoomDoors: { cy: number, cx: number }[] = new Array();  //két szoba közti ajtók
                    var roomY: number = cy;
                    var roomX: number = cx;
                    //az óramutató járásának megfelelően körbejárjuk a szoba széleit alkotó cellákat
                    //felső szobahatár cellák keresése                    
                    while (map[roomY][roomX] != this.WALL) {                                                                                    //jobb-felső sarok elérése                    
                        if (map[roomY][roomX] == this.ROOM && map[roomY - 1][roomX] == this.WALL && map[roomY - 2][roomX] == this.MAZE) {
                            possibleMazeDoors.push({ cy: (roomY - 1), cx: roomX });
                        }                        
                        if (map[roomY][roomX] == this.ROOM && map[roomY - 1][roomX] == this.WALL && map[roomY - 2][roomX] == this.ROOM) {
                            possibleRoomDoors.push({ cy: (roomY - 1), cx: roomX });
                        }
                        roomX++;
                    }
                    roomX--;    //korrekció, hogy újra a ROOM-on legyen a kurzor
                    //jobb oldali szobahatár cella kereső
                    while (map[roomY][roomX] != this.WALL) {                                                                                    //jobb-alsó sarok elérése
                        if (map[roomY][roomX] == this.ROOM && map[roomY][roomX + 1] == this.WALL && map[roomY][roomX + 2] == this.MAZE) {
                            possibleMazeDoors.push({ cy: roomY, cx: (roomX + 1) });
                        }                        
                        if (map[roomY][roomX] == this.ROOM && map[roomY][roomX + 1] == this.WALL && map[roomY][roomX + 2] == this.ROOM) {
                            possibleRoomDoors.push({ cy: roomY, cx: (roomX + 1) });
                        }
                        roomY++;
                    }
                    roomY--;    //korrekció, hogy újra a ROOM-on legyen a kurzor
                    //alsó szobahatár cella kereső
                    while (map[roomY][roomX] != this.WALL) {                                                                                    //bal-alsó sarok elérése
                        if (map[roomY][roomX] == this.ROOM && map[roomY + 1][roomX] == this.WALL && map[roomY + 2][roomX] == this.MAZE) {
                            possibleMazeDoors.push({ cy: (roomY + 1), cx: roomX });
                        }                        
                        if (map[roomY][roomX] == this.ROOM && map[roomY + 1][roomX] == this.WALL && map[roomY + 2][roomX] == this.ROOM) {
                            possibleRoomDoors.push({ cy: (roomY + 1), cx: roomX });
                        }
                        roomX--;
                    }
                    roomX++;    //korrekció, hogy újra a ROOM-on legyen a kurzor
                    //bal oldali szobahatár cella kereső
                    while (map[roomY][roomX] != this.WALL) {                                                                                    //újra vissza a bal-felső sarokba
                        if (map[roomY][roomX] == this.ROOM && map[roomY][roomX - 1] == this.WALL && map[roomY][roomX - 2] == this.MAZE) {
                            possibleMazeDoors.push({ cy: roomY, cx: (roomX - 1) });                            
                        }                        
                        if (map[roomY][roomX] == this.ROOM && map[roomY][roomX - 1] == this.WALL && map[roomY][roomX - 2] == this.ROOM) {
                            possibleRoomDoors.push({ cy: roomY, cx: (roomX - 1) });
                        }
                        roomY--;
                    }

                    //az adott szoba ajtócelláinak véletlenszerű kiválasztása, és hozzáadása a térképhez                    
                    var doorsNum: number = (possibleMazeDoors.length) + (possibleRoomDoors.length);
                    var onlyRoomDoors: boolean = possibleMazeDoors.length == 0 ? true : false;              //ha csak szobához csatlakoztatható része lenne a szobának                    

                    if (doorsNum < doorsPerRoom) {
                        doorsPerRoom = doorsNum;
                    }
                    
                    for (var i = 0; i != doorsPerRoom; i++) {
                        //az első ajtó ha lehet, akkor mindig a labirintushoz (maze-hez) csatlakozzon, és csak utána egy másik szobához
                        if (i == 0 || i == 1) {
                            if (possibleMazeDoors.length > 0) {
                                var selectedDoor = Math.floor((Math.random() * (possibleMazeDoors.length - 1)));
                                if (this.noOtherDoorCell(map, possibleMazeDoors[selectedDoor].cy, possibleMazeDoors[selectedDoor].cx)) {
                                    map[possibleMazeDoors[selectedDoor].cy][possibleMazeDoors[selectedDoor].cx] = this.DOOR;
                                        
                                }
                            } else if (possibleRoomDoors.length > 0) {
                                var selectedDoor = Math.floor((Math.random() * (possibleRoomDoors.length - 1)));
                                if (this.noOtherDoorCell(map, possibleRoomDoors[selectedDoor].cy, possibleRoomDoors[selectedDoor].cx)) {
                                    map[possibleRoomDoors[selectedDoor].cy][possibleRoomDoors[selectedDoor].cx] = this.DOOR;
                                        
                                }
                            }
                        }
                        //a második ajtó - ha még nincs másik szobához csatlakozás - akkor szobához csatlakozzon
                        if (i == 2) {
                            if (possibleRoomDoors.length > 0) {
                                var selectedDoor = Math.floor((Math.random() * (possibleRoomDoors.length - 1)));
                                if (this.noOtherDoorCell(map, possibleRoomDoors[selectedDoor].cy, possibleRoomDoors[selectedDoor].cx)) {
                                    map[possibleRoomDoors[selectedDoor].cy][possibleRoomDoors[selectedDoor].cx] = this.DOOR;
                                        
                                }
                            }
                        }
                        //minden további ajtó véletlenszerűen van kiválasztva, itt már nincs figyelve, hogy mihez csatlakozik
                        if (i >= 3) {
                            //NOP...
                        }
                    }                                        

                    if (this.VISIBLE_POSSIBLE_DOORS) {
                        allDoorCells.push.apply(allDoorCells, possibleMazeDoors);
                        allDoorCells.push.apply(allDoorCells, possibleRoomDoors);
                    }                    
                }
            }    
        }

        //az összes lehetséges ajtócella hozzáadása a térképhez
        if (this.VISIBLE_POSSIBLE_DOORS) {
            for (var i = 0; i != allDoorCells.length; i++) {
                if (map[allDoorCells[i].cy][allDoorCells[i].cx] != this.DOOR) {
                    map[allDoorCells[i].cy][allDoorCells[i].cx] = this.TEST_POSS_DOOR;
                }
            }
        }        
    }

    /**
     * True, ha nincs a kiválasztott ajtó közvetlen környezetében (alatta, felette, mellette) másik ajtó cella a térképen.
     * @param map Térkép.
     * @param doorY Lehetséges ajtó cellájának x koordinátája.
     * @param doorX Lehetséges ajtó cellájának y koordinátája.
     */
    private noOtherDoorCell(map: any, doorY: number, doorX: number): boolean {
        if (map[doorY - 1][doorX] != this.DOOR &&
            map[doorY + 1][doorX] != this.DOOR &&
            map[doorY][doorX - 1] != this.DOOR &&
            map[doorY][doorX + 1] != this.DOOR) {
            return true;
        }
        return false;
    }

    /**
     * Törli azokat a MAZE cellákat a térképről, amelyek zsákutcába vezetnek. (Ez hosszabb művelet lehet, a térkép bonyolultságától függően.)
     * @param map
     */
    private removeDeadEndCells(map: any): void {
        //Olyan maze map cellákat keresünk, és törlünk (visszaállítjuk wall-ra), amelyeket három wall típusú cella vesz körül.
        var done: boolean = false;
        var foundDeletedCell: boolean = false;
        while (!done) {            
            foundDeletedCell = false;
            for (var cy = 1; cy != map.length - 1; cy++) {
                for (var cx = 1; cx != map[0].length - 1; cx++) {
                    if (this.isNeedDeleteCell(map, cy, cx, this.MAZE, false)) {
                        map[cy][cx] = this.WALL;
                        foundDeletedCell = true;                        
                    }
                }
            }
            if (!foundDeletedCell) {
                done = true;
            }
        }        
    }

    /**
     * Utólagos műveletek elvégzése a térképen. Semmihez sem kapcsolodó cellák és magányos szobák törlése.
     * @param map
     */
    private mapPostProcesses(map: any): void {        
        for (var cy = 0; cy != map.length - 1; cy++) {
            for (var cx = 0; cx != map[0].length - 1; cx++) {
                //A folysók visszatörléséből adódóan, azoknál a részeknél, amelyek nem tudnak csatlakozni a fő labirintushoz, ott az utolsó cella önmagában megmarad, ezt törölni kell.
                //(Azért marad meg, mert az utolsó visszatörölt maze cellát négy wall típusú cella veszi körül, a visszatörlés pedig csak három szomszédos wall cellát figyel.)
                if (this.isNeedDeleteCell(map, cy, cx, this.MAZE, true)) {
                    map[cy][cx] = this.WALL;
                }
                //Lehetnek olyan szoba ajtók, amelyek nem csatlakoznak maze-hez, vagy másik room-hoz. (A semmibe vezetnek, egy wall cellába.) 
                //Azért lehetnek ilyenek, mert eredetileg olyan labirintus szakazhoz lettek kigenerálva, amelyek nem csatlakoznak a fő labirintushoz, 
                //és teljes egészében vissza lettek törölve.
                if (this.isNeedDeleteCell(map, cy, cx, this.DOOR, false)) {
                    map[cy][cx] = this.WALL;
                }
            }
        }                        
    }

    /**
     * True, ha törölhető az adott cella. Akkor törölhető, ha az adott 'cellType' cellát három oldaláról WALL típusú cella veszi körül.
     * @param map Térkép.
     * @param cellY Adott cella y koordinátája.
     * @param cellX Adott cella x koordinátája.
     * @param cellType Milyen típusú törlendő cellát keresünk.
     * @param searchLastMazeCell Utolsó-e az a cella, amit keresünk. Ha igen, akkor azt négy wall típusú cella veszi körül.
     */
    private isNeedDeleteCell(map: any, cellY: number, cellX: number, cellType: number, searchLastCell: boolean) {        
        var wallCellNumber = 0;
        if (map[cellY][cellX] == cellType && map[cellY - 1][cellX] == this.WALL) {
            wallCellNumber++;
        }
        if (map[cellY][cellX] == cellType && map[cellY + 1][cellX] == this.WALL) {
            wallCellNumber++;
        }
        if (map[cellY][cellX] == cellType && map[cellY][cellX - 1] == this.WALL) {
            wallCellNumber++;
        }
        if (map[cellY][cellX] == cellType && map[cellY][cellX + 1] == this.WALL) {
            wallCellNumber++;
        }
        if (!searchLastCell)
            return wallCellNumber == 3;
        else
            return wallCellNumber == 4;
    }

    /**
     * Nem maradhat a térképen olyan szoba, amelynek egyetlen egy ajtaja sincs, így nem csatlakozik sehová sem. Az ilyen szobákat törölni kell.
     * Ehhez be kell járni a teljes térképet. (maze + door + room).
     * @param map
     * @param test True, ha végelegesen felépített térkép teszt szükséges, és nem a generálás lépésekénti bejárás kell.
     */
    private mapEntranceCheck(originalMap: any, test: boolean): any {        

        //hogy ne az eredeti térképen történjen az ellenőrzés, átmásoljuk az eredeti térkép tartalmát
        var checkMap = [];     
        if (!test) {
            for (var cy = 0; cy != originalMap.length - 1; cy++) {
                checkMap[cy] = [];
                for (var cx = 0; cx != originalMap[0].length - 1; cx++) {
                    var cellElement = originalMap[cy][cx];
                    checkMap[cy][cx] = cellElement;
                }
            }
        } else {
            checkMap = originalMap;     //ekkor nem lesz a térkép új objektum
        }            

        //kezdő maze cella kiválasztása, innen indul a bejárás
        var startY: number = 0;
        var startX: number = 0;
        var mapHalfY: number = Math.floor(checkMap.length / 2);
        var mapHalfX: number = Math.floor(checkMap[0].length / 2);        

        if (this.isPassableUnitCell(checkMap, mapHalfY, mapHalfX)) {            //ha szerencsénk van, akkor pont beletalálunk - elsőre - egy járható cellába
            startY = mapHalfY;
            startX = mapHalfX;            
        } else {                                                                //de ha nincs szerencsénk :), akkor megkeressük a térkép közepéhez relatív a legközelebbi járható cellát
            var isDoneStartPos: boolean = false;
            while (!isDoneStartPos) {
                var randCellY = Math.floor((Math.random() * checkMap.length - 1)) + 1;
                var randCellX = Math.floor((Math.random() * checkMap[0].length - 1)) + 1;
                if (this.isPassableUnitCell(checkMap, randCellY, randCellX)) {
                    startY = randCellY;
                    startX = randCellX;                                                            
                    isDoneStartPos = true;                    
                }
            }
        }        

        //bejárása az összes maze, door, room celláknak (és megjelölni őket, hogy már be vannak járva)        
        var upDir: boolean = true;
        var dwDir: boolean = true;
        var ltDir: boolean = true;
        var rtDir: boolean = true;        
        var selectedElement: number;
        var cellY: number;
        var cellX: number;        

        var cells: { cy: number, cx: number }[] = new Array();
        cells.push({ cy: startY, cx: startX });
        
        while (cells.length != 0) {
            upDir = true;
            dwDir = true;
            ltDir = true;
            rtDir = true;            
            selectedElement = 0;
            cellY = cells[selectedElement].cy;
            cellX = cells[selectedElement].cx;            
            while (!(!upDir && !dwDir && !ltDir && !rtDir)) {
                var selectedRandDirection = Math.floor((Math.random() * 4));                //0: UP, 1: DOWN, 2: LEFT, 3: RIGHT
                switch (selectedRandDirection) {
                    case 0:         //UP
                        if (upDir &&
                            this.isPassableUnitCell(checkMap, cellY - 1, cellX)) {
                            checkMap[cellY - 1][cellX] = this.OKCELL;
                            cells.push({ cy: cellY - 1, cx: cellX });
                            upDir = false;                            
                        } else {
                            upDir = false;                            
                        }
                        break;
                    case 1:         //DOWN
                        if (dwDir &&
                            this.isPassableUnitCell(checkMap, cellY + 1, cellX)) {
                            checkMap[cellY + 1][cellX] = this.OKCELL;
                            cells.push({ cy: cellY + 1, cx: cellX });
                            dwDir = false;                            
                        } else {
                            dwDir = false;                            
                        }
                        break;
                    case 2:         //LEFT
                        if (ltDir &&
                            this.isPassableUnitCell(checkMap, cellY, cellX - 1)) {
                            checkMap[cellY][cellX - 1] = this.OKCELL;
                            cells.push({ cy: cellY, cx: cellX - 1 });
                            ltDir = false;                            
                        } else {
                            ltDir = false;                            
                        }
                        break;
                    case 3:         //RIGHT
                        if (rtDir &&
                            this.isPassableUnitCell(checkMap, cellY, cellX + 1)) {
                            checkMap[cellY][cellX + 1] = this.OKCELL;
                            cells.push({ cy: cellY, cx: cellX + 1 });
                            rtDir = false;                            
                        } else {
                            rtDir = false;                            
                        }
                        break;
                }
            }
            if (!upDir && !dwDir && !ltDir && !rtDir) {
                cells.splice(selectedElement, 1);
            }
        }
        return checkMap;                        
    }    

    /**
     * A bejárt és ellenörzött térkép segítségével töröljük az eredeti térképről - a játékos által - nem elérhető cellákat.     
     * @param originalMap
     * @param entranceCheckMap
     */
    private eraseNotEntranceCellFromMap(originalMap: any, entranceCheckMap: any): void {
        for (var cy = 0; cy != originalMap.length - 1; cy++) {
            for (var cx = 0; cx != originalMap[0].length - 1; cx++) {
                if ((!this.isNotPassableUnitCell(originalMap, cy, cx)) && entranceCheckMap[cy][cx] != this.OKCELL) {
                    originalMap[cy][cx] = this.WALL;
                }
            }
        }
    }

    /**
     * True, ha az adott cella a térképen a játékos egység által bejárható.
     * @param map
     * @param cellY
     * @param cellX
     */
    private isPassableUnitCell(map: any, cellY: number, cellX: number): boolean {
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
    private isNotPassableUnitCell(map: any, cellY: number, cellX: number): boolean {
        for (var i = 0; i != this.NOT_PASSABLE_UNIT_CELLS_TYPE.length; i++) {
            if (map[cellY][cellX] == this.NOT_PASSABLE_UNIT_CELLS_TYPE[i])
                return true;
        }
        return false;
    }

    private writeMapToServerConsole(map: any): void {
        console.log('\r\n');
        for (var y = 0; y < map.length; y++) {
            var line = '';
            for (var x = 0; x < map[y].length; x++) {
                if (map[y][x] == this.MAZE) {
                    line += ' ';
                } else if (map[y][x] == this.WALL) {
                    line += 'X';
                } else if (map[y][x] == this.MBRD) {
                    line += 'B';
                } else if (map[y][x] == this.ROOM) {
                    line += '.';
                } else if (map[y][x] == this.DOOR) {
                    line += 'D';
                } else if (map[y][x] == this.TEST_POSS_DOOR) {
                    line += 'P';
                }
            }
            console.log(line);                          //összefüzve egy sorba, mert a node szerver log egy cmd, és ott minden egyes log automatikusan egy-egy új sor :)            
        }
        console.log('\r\n');
    }

    private _DEBUG_LOG(msg: string): void {
        if (this.DEBUG_CONSOLE_PRINT) {
            console.log('@dungeonGenerator.js :' + msg);
        }
    }
    
}