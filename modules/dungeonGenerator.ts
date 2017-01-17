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

    //egy szoba lehetséges cella szélessége/magassága a kiválasztott középponthoz képest, csak páratlan érték lehet!!!
    private POSSIBLE_ROOM_SIZES = [3, 5, 7, 9, 11];

    private MAZE: number = 0;                   //folyosó (egységek által járható cellák)
    private WALL: number = 1;                   //fal (egységek által nem járható cellák)
    private MBRD: number = 2;                   //térkép határ (MBRD = map border) (nem járható, és ide semmilyen más specifikus cella nem generálható)
    private ROOM: number = 3;                   //szoba (egységek által járható cellák)
    private DOOR: number = 4;                   //ajtó

    constructor() {

    }

    public generator(mapWidth: number, mapHeight: number, roomNumber: number): any {        
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
        this.doorGenerator(map);
        //this.writeMapToServerConsole(map);
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
        //console.log('@map init mapWidth: ' + mapWidth + ' mapHeight: ' + mapHeight);
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
        var generatedRoomCounter: number = 0;               //hagyd benne!
        for (var i = 0; i != roomNumber; i++) {
            //FONTOS:   Egy adott szoba X, Y cella koordinátájának mindig páros számmnak kell lennie, a szoba szélességének, 
            //          illetve hosszúságának pedig mindig páratlannak kell lennie!
            var roomWidth = this.POSSIBLE_ROOM_SIZES[Math.floor((Math.random() * this.POSSIBLE_ROOM_SIZES.length))];
            var roomHeight = this.POSSIBLE_ROOM_SIZES[Math.floor((Math.random() * this.POSSIBLE_ROOM_SIZES.length))];

            //a szoba nem lóghat ki a térképről, ezért az X és Y meghatározása a szélek figyelésével generálódik
            //+ a szoba egyetlen cellája sem lehet rajta a térkép határon (nem lehet közvetlenül a térkép szélén) [ezért van a +2 , -2]
            var roomX = Math.floor((Math.random() * ((map[0].length - 2) - roomWidth))) + 2;    //-2, hogy bal oldalt ne lógjon ki a szélre, +2, hogy jobb oldalon ne lógjon ki a térképről
            roomX -= (roomX % 2 != 0 ? 1 : 0);
            var roomY = Math.floor((Math.random() * ((map.length - 2) - roomHeight))) + 2;      //-2, hogy alul ne lógjon ki a szélre, +2, hogy felül ne lógjon ki a térképről
            roomY -= (roomY % 2 != 0 ? 1 : 0);

            //console.log('@room roomX: ' + roomX + ' roomY: ' + roomY + ' roomWidth:' + roomWidth + ' roomHeight: ' + roomHeight);            
            var roomValidate = true;

            //a szoba nem fedhet le másik szobát (overlapping)
            for (var ry = roomY; ry != (roomY + roomHeight); ry++) {
                for (var rx = roomX; rx != (roomX + roomWidth); rx++) {
                    if (map[ry][rx] == this.ROOM) {
                        //console.log('@room overlapping');
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
        console.log('@room Needed room number / generated room: ' + roomNumber + ' / ' + generatedRoomCounter);
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
     */
    private doorGenerator(map: any): void {
        //összeszedjük a szobákat, azokat a térkép cellákat keressük meg, amelyek egy adott szoba bal-felső sarkát reprezentálják        
        var roomCells: { cy: number, cx: number }[] = new Array();
        for (var cy = 1; cy < map.length; cy++) {
            for (var cx = 1; cx < map[0].length; cx++) {
                if (map[cy][cx] == this.ROOM && map[cy][cx - 1] == this.WALL && map[cy - 1][cx] == this.WALL) {
                    roomCells.push({ cy: cy, cx: cx });
                }
            }
        }
        if (roomCells.length > 0) {
            console.log('@door Finding rooms: ' + roomCells.length);

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
                }
            }
            console.log(line);                          //összefüzve egy sorba, mert a node szerver log egy cmd, és ott minden egyes log automatikusan egy-egy új sor :)            
        }
        console.log('\r\n');
    }

    /**
     * @deprecated Nincs használva.
     * 'Fűrészfogas' maze generátor. (Minden körben, minden oldalra új random irány.)
     * @param map Térkép.
     * @param startCellX Kezdeti cella X koordinátája.
     * @param startCellY Kezdeti cella Y koordinátája.
     */
    private sawtoothMazeGenerator(map: any, startCellX: number, startCellY: number): void {        
        var cellNum: number = (map.length * map[0].length);
        var cells: { cx: number, cy: number }[] = new Array();
        var selectedElement: number;
        var cx: number = startCellX;                //bejárati cella X
        var cy: number = startCellY;                //bejárat  cella Y

        //kezdeti elem elhelyezése a listába
        //map[cy][cx] = this.ENTR;
        cells.push({ cx: cx, cy: cy });

        var idx: number = 20;
        while (cells.length /*idx*/ != 0) {
            idx--;
            //valamelyik elem kiválasztása a listából
            selectedElement = cells.length - 1;     //utolsó elem kiválasztása
            cx = cells[selectedElement].cx;
            cy = cells[selectedElement].cy;

            //irányok összekeverése
            var directions = [
                0,  //up
                1,  //down
                2,  //left
                3   //right
            ];

            for (var i = 0; i < directions.length; i++) {
                var randDir = Math.floor((Math.random() * 4));
                var tempDir = directions[i];
                directions[i] = directions[randDir];
                directions[randDir] = tempDir;
            }

            //végigmegyünk az összes irányon, és ha arra lehet menni, akkor azt betesszük a cells listába
            var upDir: boolean = true;
            var dwDir: boolean = true;
            var ltDir: boolean = true;
            var rtDir: boolean = true;
            for (var i = 0; i < directions.length; i++) {
            //var rDirection = Math.floor((Math.random() * 4));
                switch (directions[i] /*rDirection*/) {
                    case 0:         //up   
                        if (this.checkMapCell(map[cy - 1][cx - 1]) &&
                            this.checkMapCell(map[cy - 2][cx - 1]) &&
                            this.checkMapCell(map[cy - 2][cx]) &&
                            this.checkMapCell(map[cy - 2][cx + 1]) &&
                            this.checkMapCell(map[cy - 1][cx + 1]) &&
                            this.checkMapCell(map[cy - 1][cx])) {
                            map[cy - 1][cx] = this.MAZE;                //mind a két járatot fel kell venni, a közvetlen szomszédot,...
                            cells.push({ cx: cx, cy: (cy - 1) });                            
                            map[cy - 2][cx] = this.MAZE;                //...és a következőt is, így nem lesz egymás mellett kettő
                            cells.push({ cx: cx, cy: (cy - 2) });                                                        
                        } else {
                                upDir = false;
                        }                        
                        break;
                    case 1:         //down
                        if (this.checkMapCell(map[cy + 1][cx - 1]) &&
                            this.checkMapCell(map[cy + 2][cx - 1]) &&
                            this.checkMapCell(map[cy + 2][cx]) &&
                            this.checkMapCell(map[cy + 2][cx + 1]) &&
                            this.checkMapCell(map[cy + 1][cx + 1]) &&
                            this.checkMapCell(map[cy + 1][cx])) {
                            map[cy + 1][cx] = this.MAZE;
                            cells.push({ cx: cx, cy: (cy + 1) });                            
                            map[cy + 2][cx] = this.MAZE;
                            cells.push({ cx: cx, cy: (cy + 2) });                                                                                            
                        } else {
                            dwDir = false;
                        }                        
                        break;
                    case 2:         //left
                        if (this.checkMapCell(map[cy - 1][cx - 1]) &&
                            this.checkMapCell(map[cy - 1][cx - 2]) &&
                            this.checkMapCell(map[cy][cx - 2]) &&
                            this.checkMapCell(map[cy - 1][cx - 2]) &&
                            this.checkMapCell(map[cy - 1][cx - 1]) &&
                            this.checkMapCell(map[cy][cx - 1])) {
                            map[cy][cx - 1] = this.MAZE;
                            cells.push({ cx: (cx - 1), cy: cy });                            
                            map[cy][cx - 2] = this.MAZE;
                            cells.push({ cx: (cx - 2), cy: cy });                                                        
                        } else {
                            ltDir = false;
                        }                        
                        break;
                    case 3:         //right
                        if (this.checkMapCell(map[cy - 1][cx + 1]) &&
                            this.checkMapCell(map[cy - 1][cx + 2]) &&
                            this.checkMapCell(map[cy][cx + 2]) &&
                            this.checkMapCell(map[cy + 1][cx + 2]) &&
                            this.checkMapCell(map[cy + 1][cx + 1]) &&
                            this.checkMapCell(map[cy][cx + 1])) {
                            map[cy][cx + 1] = this.MAZE;
                            cells.push({ cx: (cx + 1), cy: cy });                            
                            map[cy][cx + 2] = this.MAZE;
                            cells.push({ cx: (cx + 2), cy: cy });                                                        
                        } else {
                            rtDir = false;
                        }                        
                        break;
                }
            }
            //ha egyik irányba sem lehet menni, akkor az adott elemet kivesszük a listából
            if (!upDir && !dwDir && !ltDir && !rtDir) {
                cells.splice(selectedElement, 1);         
                //console.log('@cells element delete');                           
            }
            //console.log('@cells.length: ' + cells.length);
        }   //while                
    }        

}