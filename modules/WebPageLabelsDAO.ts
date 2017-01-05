

export namespace WebpageLabelsNameSpace {

    export class WebPageLabels {

        static PROGRAM_NAME: string;
        static PROGRAM_VERSION: string;
        static PROGRAM_DEVELOPER: string;

        constructor() { }

        static fillPageLabel(_key: string, _value: string) {
            if (_key === null || _key === 'undefined' || _key === '' || _value === null || _value === 'undefined' || _value === '') {
                return;
            }
            switch (_key) {
                case 'PROGRAM_NAME': WebPageLabels.PROGRAM_NAME = _value; break;
                case 'PROGRAM_VERSION': WebPageLabels.PROGRAM_VERSION = _value; break;
                case 'PROGRAM_DEVELOPER': WebPageLabels.PROGRAM_DEVELOPER = _value; break;
            }
        }

    }

}

