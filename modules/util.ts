/*
 * Util modul.
 * 21/01/2017
 */

import * as appcons from "../modules/AppConstans";

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

}