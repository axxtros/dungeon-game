//appConstans 2017.03.01 applikációs szintű konstansok, szövegek, változók
"use strict";
var AppConstans = (function () {
    function AppConstans() {
    }
    AppConstans.ERROR_MESSAGE_PREFIX = '_ERR_'; //a prefixek legyenek azonos hosszúak (5 karakter)
    AppConstans.SUCCES_MESSAGE_PREFIX = '_SUC_';
    AppConstans.ERROR_MESSAGE_COLOR = 'red';
    AppConstans.SUCCES_MESSAGE_COLOR = 'green';
    AppConstans.EMPTY_MESSAGE_COLOR = 'black';
    AppConstans.OPEN_PANEL_SYMBOL = '[▼]'; //http://stackoverflow.com/questions/2701192/what-characters-can-be-used-for-up-down-triangle-arrow-without-stem-for-displa
    AppConstans.CLOSE_PANEL_SYMBOL = '[▲]';
    //index page
    //admin page
    //obj file control
    AppConstans.ADMIN_OBJ_UPLOAD_MENU_LABEL = 'OBJ állomány feltöltése';
    AppConstans.ADMIN_OBJ_UPLOAD_FILE_EXTENSION_ERR_MSG = AppConstans.ERROR_MESSAGE_PREFIX + 'A feltöltött állomány nem obj kiterjesztésű, ezért nem tölthető fel!';
    AppConstans.ADMIN_OBJ_UPLOAD_FILE_EXPECT_ERR_MSG = AppConstans.ERROR_MESSAGE_PREFIX + 'A feltöltés során váratlan hiba lépett fel!';
    AppConstans.ADMIN_OBJ_PARSE_FILE_EXPECT_ERR_MSG = AppConstans.ERROR_MESSAGE_PREFIX + 'Az állomány felolvasása során váratlan hiba lépett fel!';
    AppConstans.ADMIN_OBJ_SAVE_DB_ERR_MSG = AppConstans.ERROR_MESSAGE_PREFIX + 'Az adatbázis mentés során hiba lépett fel!';
    AppConstans.ADMIN_OBJ_UPLOAD_FILE_SUCC_MSG = AppConstans.SUCCES_MESSAGE_PREFIX + 'Az állomány beolvasása és feltöltése sikeresen befejezve!';
    AppConstans.OBJECT_3D_SAVE_ERROR = 'A 3D-s adatok mentése közben hiba lépett fel!';
    AppConstans.OBJECT_3D_LOAD_ERROR = 'A 3D-s adatok betöltése közben hiba lépett fel!';
    //obj loader
    AppConstans.OBJ_LOADER_MENU_LABEL = '3D mesh betöltése';
    return AppConstans;
}());
exports.AppConstans = AppConstans;
//# sourceMappingURL=appConstans.js.map