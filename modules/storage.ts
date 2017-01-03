//data storage entity

export namespace DataStorageNameSpace {

    export class BaseClass {

        static pageData: { key: string, value: string }[] = new Array();

        constructor() {
            
        }
        
        static addItem(item: any) {
            console.log('@BaseClass addItem, data: ' + item);
            BaseClass.pageData.push(item);
        }
    }

    export class WebPageDataStorage extends BaseClass {
        
        constructor() {
            super();
        }
        
        //getters/setters -----------------------------------------------------
        /*
        public set _pageData(data: any[]) {            
            pageData = data;
        }

        public get _pageData(): any[] {
            return pageData;
        }
        */
    }

}