//data storage entity

export namespace DataStorageNameSpace {

    export class BaseClass {

        static pageData: { key: string, value: string }[] = new Array();

        constructor() {
            
        }
        
        static addItem(_key: any, _value: any) {
            console.log('@BaseClass addItem, key: ' + _key + ' value: ' + _value);
            BaseClass.pageData.push({ key: _key, value: _value });
        }

        static getItemValue(_key: any): any {
            if (BaseClass.pageData.length > 0) {
                for (var i = 0; i != BaseClass.pageData.length; i++) {
                    var item = BaseClass.pageData[i];
                    if (item.key === _key) {
                        console.log('@BaseClass getItemValue key: ' + item.key + ' value: ' + item.value);
                        return item.value;
                    }
                }
            }
            console.log('@BaseClass ' + _key + '-re key value not found!');
            return null;
        }
    }

    export class WebPageDataStorage extends BaseClass {
        
        constructor() {
            super();
        }
                
    }

}