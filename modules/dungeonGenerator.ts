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

var async = require('async');

export class DungeonGenerator {

    private POSSIBLE_ROOM_SIZES = [3, 5, 7];    //egy szoba lehetséges cella szélessége/magassága a kiválasztott középponthoz képest
    private MAZE: number = 0;                   //folyosó (egységek által járható cellák)
    private WALL: number = 1;                   //fal (egységek által nem járható cellák)
    private MBRD: number = 2;                   //térkép határ (MBRD = map border) (ide semmilyen specifikus cella nem generálható)
    private ROOM: number = 3;                   //szoba (egységek által járható cellák)

    constructor() {

    }

    public generator(width: number, height: number): any {        
        var map = this.initMap(width, height);
        //this.roomGenerator(map, 10);
        //this.roomGenerator2(map, 10);
        //this.mazeGenerator(map, 2, 2);
        //this.mazeGenerator2(map, 3, 3);
        this.mazeGenerator3(map, 2, 2);
        //this.writeMapToServerConsole(map);
        return map;
    }

    private initMap(mapWidth: number, mapHeight: number): any {
        var map = [];
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
        console.log('@map mapWidth: ' + mapWidth + ' mapHeight: ' + mapHeight);
        return map;
    }    

    private mazeGenerator3(map: any, startX: number, startY: number): void {
        var cellNum: number = (map.length * map[0].length);
        var cells: { cy: number, cx: number }[] = new Array();
        var cy: number;
        var cx: number;
        var selectedElement: number;

        cells.push({ cy: startY, cx: startX });

        
        var tempIdx = 10;
        while (tempIdx != 0) {
            tempIdx--;
            
            selectedElement = cells.length - 1;
            cx = cells[selectedElement].cx;
            cy = cells[selectedElement].cy;
            var selectedRandDirection = Math.floor((Math.random() * 4));                //0: UP, 1: DOWN, 2: LEFT, 3: RIGHT
            switch (selectedRandDirection) {
                case 0:     //UP
                    if (this.checkMapCell(cells[cy - 1][cx]) &&
                        this.checkMapCell(cells[cy - 1][cx - 1]) &&
                        this.checkMapCell(cells[cy - 2][cx - 1]) &&
                        this.checkMapCell(cells[cy - 2][cx]) &&
                        this.checkMapCell(cells[cy - 2][cx + 1]) &&
                        this.checkMapCell(cells[cy - 1][cx + 1])) {
                        map[cy - 1][cx] = this.MAZE;
                        cells.push({ cy: cy - 1, cx: cx });
                    }
                    break;
                case 1:     //DOWN
                    break;
                case 2:     //LEFT
                    break;
                case 3:     //RIGHT
                    break;
            }

        }

    }

    private roomGenerator(map: any, roomNumber: number): void {
        for (var i = 0; i != roomNumber; i++) {
            var roomCenterX: number = Math.floor((Math.random() * map[0].length));
            roomCenterX += (roomCenterX % 2 == 0 ? 1 : 0);                              //hogy csak páratlan legyen a közepe X-re
            var roomCenterY: number = Math.floor((Math.random() * map.length));
            roomCenterY += (roomCenterY % 2 == 0 ? 1 : 0);                              //hogy csak páratlan legyen a közepe Y-ra
            var rWidth: number = Math.floor((Math.random() * this.POSSIBLE_ROOM_SIZES.length));
            var roomWidth: number = this.POSSIBLE_ROOM_SIZES[rWidth];
            roomWidth += (roomWidth % 2 == 0 ? 1 : 0);
            var rHeight: number = Math.floor((Math.random() * this.POSSIBLE_ROOM_SIZES.length));
            var roomHeight: number = this.POSSIBLE_ROOM_SIZES[rHeight];
            roomHeight += (roomHeight % 2 == 0 ? 1 : 0);
            console.log('@room roomCenterX: ' + roomCenterX + ' roomCenterY: ' + roomCenterY + ' roomWidth:' + roomWidth + ' roomHeight: ' + roomHeight);

            var roomValidate = true;
            //a szoba nem lóghat ki a térképről
            if ((roomCenterY - roomHeight - 2) <= 0 || (roomCenterY + roomHeight + 2) >= map.length || (roomCenterX - roomWidth - 2) <= 0 || (roomCenterX + roomWidth + 2) >= map[0].length) {
                console.log('@room A szoba nincs rajta a térképen teljes terjedelmében!');
                roomValidate = false;
            }
            if (roomValidate) {
                for (var roomYElement = (roomCenterY - roomHeight); roomYElement != (roomCenterY + roomHeight); roomYElement++) {
                    for (var roomXElement = (roomCenterX - roomWidth); roomXElement != (roomCenterX + roomWidth); roomXElement++) {
                        if (!roomValidate) {
                            break;
                        }
                        //a szoba egyetlen cellája sem lehet rajta a térkép határon (nem lehet közvetlenül a térkép szélén)
                        if (map[roomYElement][roomXElement] == this.MBRD) {
                            console.log('@room A szoba egy vagy több cellája a térképhatárra esik!');
                            roomValidate = false;
                        }
                        //a szoba nem fedhet le másik szobát (overlapping)
                        if (map[roomYElement][roomXElement] == this.ROOM) {
                            console.log('@room A szoba egy vagy több cellája egy másik szobára esik!');
                            roomValidate = false;
                        }
                        //két szoba között minimum három, de mindenképpen páratlan térképrácsnak kell lennie - minden oldalról
                        if (map[roomYElement - 1][roomXElement - 1] == this.ROOM ||
                            map[roomYElement - 1][roomXElement] == this.ROOM ||
                            map[roomYElement - 1][roomXElement + 1] == this.ROOM ||
                            map[roomYElement][roomXElement + 1] == this.ROOM ||
                            map[roomYElement + 1][roomXElement + 1] == this.ROOM ||
                            map[roomYElement + 1][roomXElement] == this.ROOM ||
                            map[roomYElement + 1][roomXElement - 1] == this.ROOM ||
                            map[roomYElement][roomXElement - 1] == this.ROOM) {
                            console.log('@room A szoba határának minimális távolsága nincs meg egy másik szobához képest!');
                            roomValidate = false;
                        }
                        if (roomValidate) {
                            if (map[roomYElement - 2][roomXElement - 2] == this.ROOM ||
                                map[roomYElement - 2][roomXElement - 1] == this.ROOM ||
                                map[roomYElement - 2][roomXElement] == this.ROOM ||
                                map[roomYElement - 2][roomXElement + 1] == this.ROOM ||
                                map[roomYElement - 2][roomXElement + 2] == this.ROOM ||

                                map[roomYElement - 1][roomXElement + 2] == this.ROOM ||
                                map[roomYElement][roomXElement + 2] == this.ROOM ||
                                map[roomYElement + 1][roomXElement + 2] == this.ROOM ||
                                map[roomYElement + 2][roomXElement + 2] == this.ROOM ||

                                map[roomYElement + 2][roomXElement + 1] == this.ROOM ||
                                map[roomYElement + 2][roomXElement] == this.ROOM ||
                                map[roomYElement + 2][roomXElement - 1] == this.ROOM ||
                                map[roomYElement + 2][roomXElement - 2] == this.ROOM ||

                                map[roomYElement + 1][roomXElement - 2] == this.ROOM ||
                                map[roomYElement][roomXElement - 2] == this.ROOM ||
                                map[roomYElement - 1][roomXElement - 2] == this.ROOM) {
                                console.log('@room A szoba határának minimális távolsága nincs meg egy másik szobához képest!');
                                roomValidate = false;
                            }
                        }

                    }
                }
            }
            //a szoba validálva van, mehet a térképbe
            if (roomValidate) {
                for (var roomYElement = (roomCenterY - roomHeight); roomYElement != (roomCenterY + roomHeight); roomYElement++) {
                    for (var roomXElement = (roomCenterX - roomWidth); roomXElement != (roomCenterX + roomWidth); roomXElement++) {
                        map[roomYElement][roomXElement] = this.ROOM;
                    }
                }
            }
        }
    }

    private roomGenerator2(map: any, roomNumber: number): void {
        map[2][2] = this.ROOM;
        map[3][2] = this.ROOM;
        map[4][2] = this.ROOM;
        map[2][3] = this.ROOM;
        map[2][4] = this.ROOM;
        map[2][5] = this.ROOM;
    }

    private mazeGenerator(map: any, startCellX: number, startCellY: number): void {        
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

    private mazeGenerator2(map: any, startCellX: number, startCellY: number): void {
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
            var next: boolean = false;
            //for (var i = 0; i < directions.length; i++) {

            while (!((next) || (!upDir && !dwDir && !ltDir && !rtDir))) {
                var selectedDirection = Math.floor((Math.random() * 4));
                switch (/*directions[i]*/ selectedDirection) {
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
                            next = true;
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
                            next = true;
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
                            next = true;
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
                            next = true;
                        } else {
                            rtDir = false;
                        }
                        break;
                }
            }

            //} //for

            //ha egyik irányba sem lehet menni, akkor az adott elemet kivesszük a listából
            if (!upDir && !dwDir && !ltDir && !rtDir) {
                cells.splice(selectedElement, 1);
                //console.log('@cells element delete');                           
            }
            //console.log('@cells.length: ' + cells.length);
        }   //while

    }

    private checkMapCell(cell: number): boolean {
        return cell != this.MAZE && cell != this.MBRD && cell != this.ROOM;
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
                }                
            }
            console.log(line);                          //összefüzve egy sorba, mert a node szerver log egy cmd, és ott minden egyes log automatikusan egy-egy új sor :)            
        }
        console.log('\r\n');
    }

}