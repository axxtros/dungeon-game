//appConstans 2017.03.01 applikációs szintű konstansok, szövegek, változók

export class AppConstans {

    public static ERROR_MESSAGE_PREFIX = '_ERR_';           //a prefixek legyenek azonos hosszúak (5 karakter)
    public static SUCCES_MESSAGE_PREFIX = '_SUC_';          
    public static ERROR_MESSAGE_COLOR = 'red';
    public static SUCCES_MESSAGE_COLOR = 'green';
    public static EMPTY_MESSAGE_COLOR = 'black';
    public static OPEN_PANEL_SYMBOL = '[▼]';              //http://stackoverflow.com/questions/2701192/what-characters-can-be-used-for-up-down-triangle-arrow-without-stem-for-displa
    public static CLOSE_PANEL_SYMBOL = '[▲]';

    //index page
    

    //admin page
    public static ADMIN_OBJ_UPLOAD_MENU_LABEL: string = 'OBJ állomány feltöltése';
    public static ADMIN_OBJ_UPLOAD_FILE_EXTENSION_ERR_MSG: string = AppConstans.ERROR_MESSAGE_PREFIX + 'A feltöltött állomány nem obj kiterjesztésű, ezért nem tölthető fel!';
    public static ADMIN_OBJ_UPLOAD_FILE_EXPECT_ERR_MSG: string = AppConstans.ERROR_MESSAGE_PREFIX + 'A feltöltés során váratlan hiba lépett fel!';
    public static ADMIN_OBJ_PARSE_FILE_EXPECT_ERR_MSG: string = AppConstans.ERROR_MESSAGE_PREFIX + 'Az állomány felolvasása során váratlan hiba lépett fel!';
    public static ADMIN_OBJ_SAVE_DB_ERR_MSG: string = AppConstans.ERROR_MESSAGE_PREFIX + 'Az adatbázis mentés során hiba lépett fel!';
    public static ADMIN_OBJ_UPLOAD_FILE_SUCC_MSG: string = AppConstans.SUCCES_MESSAGE_PREFIX + 'Az állomány beolvasása és feltöltése sikeresen befejezve!';

    //obj file control
    public static OBJECT_3D_SAVE_ERROR: string = 'A 3D-s adatok mentése közben hiba lépett fel!';
    public static OBJECT_3D_LOAD_ERROR: string = 'A 3D-s adatok betöltése közben hiba lépett fel!';

    constructor() {
    }

}