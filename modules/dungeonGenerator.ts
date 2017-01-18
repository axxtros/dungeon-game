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

export class DungeonGenerator {    

    private DEBUG: boolean = false;
    private WRITE_MAP_TO_CONSOLE: boolean = false;

    //map cella típusok
    private MAZE: number = 0;                   //folyosó (egységek által járható cellák)
    private WALL: number = 1;                   //fal (egységek által nem járható cellák)
    private MBRD: number = 2;                   //térkép határ (MBRD = map border) (nem járható, és ide semmilyen más specifikus cella nem generálható)
    private ROOM: number = 3;                   //szoba (egységek által járható cellák)    
    private DOOR: number = 4;                   //ajtó
    private PDOR: number = 5;                   //lehetséges ajtó (teszt miatt)

    constructor() {

    }

    public generator(mapWidth: number, mapHeight: number, roomNumber: number, doorsPerRoom: number): any {        
        var map = this.initMap(mapWidth, mapHeight);
        this.roomGenerator(map, roomNumber);
        //kitöltetlen helyek keresése labirintus generálásra
        for (var y = 1; y < mapHeight - 1; y++) {
            for (var x = 1; x < mapWidth - 1; x++) {
                if (this.checkIsNeedMazeGenerated(map, y, x)) {
                    this.mazeGenerator(map, x, y);
                }
            }
        }
        this.doorGenerator(map, doorsPerRoom);
        this.removeDeadEndCells(map);
        if (this.WRITE_MAP_TO_CONSOLE) {
            this.writeMapToServerConsole(map);
        }        
        return map;
    }    

    private initMap(mapWidth: number, mapHeight: number): any {
        var map = [];
        mapWidth += (mapWidth % 2 == 0 ? 1 : 0);                                            //hogy mindig biztosan páratlan legyen a térkép szélessége és
        mapHeight += (mapHeight % 2 == 0 ? 1 : 0);                                          //magassága
        for (var y = 0; y < mapHeight; y++) {
            map[y] = [];
            for (var x = 0; x < mapWidth; x++) {                
                if ((x == 0 || x == mapWidth - 1) || (y == 0 || y == mapHeight - 1)) {      //a térkép szélek bejelölése
                    map[y][x] = this.MBRD;                    
                } else {
                    map[y][x] = this.WALL;                    
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
     */
    private roomGenerator(map: any, roomNumber: number): void {
        if (roomNumber == 0)
            return;

        //egy szoba lehetséges cella szélessége/magassága a kiválasztott középponthoz képest, csak páratlan érték lehet!!!
        var POSSIBLE_ROOM_SIZES = [5, 7, 9, 11];        
        var generatedRoomCounter: number = 0;               //hagyd benne!

        for (var i = 0; i != roomNumber; i++) {
            //FONTOS:   Egy adott szoba X, Y cella koordinátájának mindig páros számmnak kell lennie, a szoba szélességének, 
            //          illetve hosszúságának pedig mindig páratlannak kell lennie!
            var roomWidth = POSSIBLE_ROOM_SIZES[Math.floor((Math.random() * POSSIBLE_ROOM_SIZES.length))];
            var roomHeight = POSSIBLE_ROOM_SIZES[Math.floor((Math.random() * POSSIBLE_ROOM_SIZES.length))];

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
            }                        
        }        
        this._DEBUG_LOG('@room Needed room number / generated room: ' + roomNumber + ' / ' + generatedRoomCounter);
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
    private mazeGenerator(map: any, startX: number, startY: number): void {
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

        var VISIBLE_POSSIBLE_DOORS: boolean = false;

        doorsPerRoom = 2;           //Azért van beégetve, mert így szép a labirintus. Egy ajtóval nem biztos, hogy minden szobának lesz ajtaja,
                                    //ennél több ajtóval pedig 'hülyén' néz ki a labirintus. Ez így legyen jó, később majd meglátjuk. :)        

        //Összeszedjük a szobákat, azokat a térkép cellákat keressük meg, amelyek egy adott szoba bal-felső sarkát reprezentálják.
        //Utána minden egyes megtalált szoba szélein végig kell menni, és össze kell gyűjteni azokat a celláikat, 
        //amelyek mellett egy WALL, utána pedig vagy MAZE, vagy pedig egy ROOM cella található.Ezek melletti WALL cellát lehet
        //kicserélni DOOR típusú cellára, amely egy ajtót reprezentál a térképen. A megtalált cellák közül véletlenszerűen kell
        //választani egyet vagy többet.
        var mapDoorCells: { cy: number, cx: number }[] = new Array();
        if (VISIBLE_POSSIBLE_DOORS) {
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
                    var onlyRoomDoors: boolean = possibleMazeDoors.length == 0 ? true : false;      //ha csak szobához csatlakoztatható része lenne a szobának                    
                    for (var i = 0; i != doorsPerRoom; i++) {
                        //az első ajtó ha lehet, akkor mindig a labirintushoz (maze-hez) csatlakozzon, és csak utána egy másik szobához
                        if (i == 0) {
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
                        if (i == 1 && !onlyRoomDoors) {
                            if (possibleRoomDoors.length > 0) {
                                var selectedDoor = Math.floor((Math.random() * (possibleRoomDoors.length - 1)));
                                if (this.noOtherDoorCell(map, possibleRoomDoors[selectedDoor].cy, possibleRoomDoors[selectedDoor].cx)) {
                                    map[possibleRoomDoors[selectedDoor].cy][possibleRoomDoors[selectedDoor].cx] = this.DOOR;
                                }                                
                            }
                        }
                        //minden további ajtó véletlenszerűen van kiválasztva, itt már nincs figyelve, hogy mihez csatlakozik
                        if (i >= 2) {
                            //NOP...
                        }
                    }                    

                    if (VISIBLE_POSSIBLE_DOORS) {
                        allDoorCells.push.apply(allDoorCells, possibleMazeDoors);
                        allDoorCells.push.apply(allDoorCells, possibleRoomDoors);
                    }                    
                }
            }    
        }

        //az összes lehetséges ajtócella hozzáadása a térképhez
        if (VISIBLE_POSSIBLE_DOORS) {
            for (var i = 0; i != allDoorCells.length; i++) {
                if (map[allDoorCells[i].cy][allDoorCells[i].cx] != this.DOOR) {
                    map[allDoorCells[i].cy][allDoorCells[i].cx] = this.PDOR;
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
     * Törli azokat a MAZE cellákat a térképről, amelyek zsákutcába vezetnek.
     * @param map
     */
    private removeDeadEndCells(map: any): void {
        //Olyan MAZE map cellákat keresünk, és törlünk (visszaállítjuk WALL-ra), amelyeket három WALL cella vesz körül.       
        var done: boolean = false;

        while (!done) {
                        
        }
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
                    line += 'R';
                } else if (map[y][x] == this.DOOR) {
                    line += 'D';
                } else if (map[y][x] == this.PDOR) {
                    line += 'P';
                }
            }
            console.log(line);                          //összefüzve egy sorba, mert a node szerver log egy cmd, és ott minden egyes log automatikusan egy-egy új sor :)            
        }
        console.log('\r\n');
    }

    private _DEBUG_LOG(msg: string): void {
        if (this.DEBUG) {
            console.log('@dungeonGenerator.js :' + msg);
        }
    }
    
}