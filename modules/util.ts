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

    /**
     * True, ha az állomány kiterjesztése megegyezik a paraméterben megadott értékkel.
     */
    public static checkFileExtension(filename: string, needExtension: string): boolean {
        if (filename != null && filename.trim().length > 0) {
            var fileExtension = filename.substring(filename.length - needExtension.length, filename.length).trim().toLowerCase();
            if (needExtension.toLowerCase().trim() == fileExtension) {
                return true;
            }
        }
        return false;
    }

}