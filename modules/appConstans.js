//appConstans 2017.03.01 applikációs szintű konstansok, szövegek, változók
"use strict";
var AppConstans = (function () {
    function AppConstans() {
    }
    AppConstans.ERROR_MESSAGE_PREFIX = '_ERR_';
    AppConstans.SUCCES_MESSAGE_PREFIX = '_SUC_';
    AppConstans.ERROR_MESSAGE_COLOR = 'red';
    AppConstans.SUCCES_MESSAGE_COLOR = 'green';
    AppConstans.EMPTY_MESSAGE_COLOR = 'black';
    AppConstans.OPEN_PANEL_SYMBOL = '[+]';
    AppConstans.CLOSE_PANEL_SYMBOL = '[-]';
    //index page
    //admin page
    AppConstans.ADMIN_OBJ_UPLOAD_FILE_EXTENSION_ERR_MSG = AppConstans.ERROR_MESSAGE_PREFIX + 'A feltöltött állomány nem obj kiterjesztésű, ezért nem tölthető fel!';
    AppConstans.ADMIN_OBJ_UPLOAD_FILE_EXPECT_ERR_MSG = AppConstans.ERROR_MESSAGE_PREFIX + 'A feltöltés során váratlan hiba lépett fel!';
    AppConstans.ADMIN_OBJ_PARSE_FILE_EXPECT_ERR_MSG = AppConstans.ERROR_MESSAGE_PREFIX + 'Az állomány felolvasása során váratlan hiba lépett fel!';
    AppConstans.ADMIN_OBJ_SAVE_DB_ERR_MSG = AppConstans.ERROR_MESSAGE_PREFIX + 'Az adatbázis mentés során hiba lépett fel!';
    AppConstans.ADMIN_OBJ_UPLOAD_FILE_SUCC_MSG = AppConstans.SUCCES_MESSAGE_PREFIX + 'Feltöltés sikeresen befejezve!';
    return AppConstans;
}());
exports.AppConstans = AppConstans;
//# sourceMappingURL=AppConstans.js.map