/*
 * Util modul.
 * 21/01/2017
 */

export class Util {

    constructor() {
    }

    public getRandomNumberMinMax(min: number, max: number): number {
        return Math.floor((Math.random() * max) + min);
    }

    

}