//appConstans 2017.03.01 applikációs szintű konstansok, szövegek, változók

export class AppConstans {

    public static ERROR_MESSAGE_PREFIX = '_ERR_';
    public static SUCCES_MESSAGE_PREFIX = '_SUC_';
    public static ERROR_MESSAGE_COLOR = 'red';
    public static SUCCES_MESSAGE_COLOR = 'green';
    public static EMPTY_MESSAGE_COLOR = 'black';

    //index page


    //admin page
    public static ADMIN_OBJ_UPLOAD_FILE_EXTENSION_ERR_MSG: string = AppConstans.ERROR_MESSAGE_PREFIX + 'A feltöltött állomány nem obj kiterjesztésű, ezért nem tölthető fel!';
    public static ADMIN_OBJ_UPLOAD_FILE_EXPECT_ERR_MSG: string = AppConstans.ERROR_MESSAGE_PREFIX + 'A feltöltés során váratlan hiba lépett fel!';
    public static ADMIN_OBJ_PARSE_FILE_EXPECT_ERR_MSG: string = AppConstans.ERROR_MESSAGE_PREFIX + 'Az állomány felolvasása során váratlan hiba lépett fel!';
    public static ADMIN_OBJ_UPLOAD_FILE_SUCC_MSG: string = AppConstans.SUCCES_MESSAGE_PREFIX + 'Feltöltés sikeresen befejezve!';

    constructor() {        
    }

}