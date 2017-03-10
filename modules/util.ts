/*
 * Util modul.
 * 21/01/2017
 */

import * as appcons from "../modules/AppConstans";

export class Util {

    public static SEPARATOR_CHARACTER: string = ',';

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

    public static getLayoutMessageColor(msg: string): string {
        if (msg == null || msg == '0' || msg == 'NaN'/* || msg.trim().length <= 0*/) {
            return appcons.AppConstans.EMPTY_MESSAGE_COLOR;
        }
        if (msg.trim().substr(0, appcons.AppConstans.SUCCES_MESSAGE_PREFIX.length) == appcons.AppConstans.SUCCES_MESSAGE_PREFIX) {
            return appcons.AppConstans.SUCCES_MESSAGE_COLOR;
        }
        if (msg.trim().substr(0, appcons.AppConstans.ERROR_MESSAGE_PREFIX.length) == appcons.AppConstans.ERROR_MESSAGE_PREFIX) {
            return appcons.AppConstans.ERROR_MESSAGE_COLOR;
        }
        return appcons.AppConstans.EMPTY_MESSAGE_COLOR;
    }

    public static getLayoutMessage(msg: string): string {
        if (msg == null || msg == '0' || msg == 'NaN'/* || msg.trim().length <= 0*/) {
            return "";
        }
        if (msg.substr(0, appcons.AppConstans.SUCCES_MESSAGE_PREFIX.length) == appcons.AppConstans.SUCCES_MESSAGE_PREFIX ||
            msg.substr(0, appcons.AppConstans.ERROR_MESSAGE_PREFIX.length) == appcons.AppConstans.ERROR_MESSAGE_PREFIX) {
            return msg.substr(appcons.AppConstans.SUCCES_MESSAGE_PREFIX.length, msg.length).trim();
        }
        return "";        
    }

    public static cutLastCharacter(value: string, cuttingChar: string): string {
        if (value == null)
            return null;
        if (value.substr(value.length - 1, value.length) == cuttingChar) {
            return value.substr(0, value.length - 1);
        }
        return value;
    }

    public static convertStringToFloat32Array(dbArray: string): Float32Array {
        if (dbArray == null || dbArray.trim().length <= 0)
            return null;
        var elements: string[] = dbArray.split(this.SEPARATOR_CHARACTER);
        if (elements != null && elements.length != 0) {
            var result: Float32Array = new Float32Array(elements.length);
            for (var i = 0; i != elements.length; i++) {
                result[i] = parseFloat(elements[i]);
            }
            return result;
        }
        return null;
    }

    public static convertStringToUint8Array(dbArray: string): Uint8Array {
        if (dbArray == null || dbArray.trim().length <= 0)
            return null;
        var elements: string[] = dbArray.split(this.SEPARATOR_CHARACTER);
        if (elements != null && elements.length != 0) {
            var result: Uint8Array = new Uint8Array(elements.length);
            for (var i = 0; i != elements.length; i++) {
                result[i] = parseFloat(elements[i]);
            }
            return result;
        }
        return null;
    }

}