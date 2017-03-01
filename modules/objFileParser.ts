//obj file parser 28/02/2017

import * as utilModul from "../modules/util";
import * as appcons from "../modules/AppConstans";

export class ObjFileParser {    

    private objFileContent: any;
    private vertices: number[];

    constructor() {
        this.vertices = new Array();
    }

    public objFileParser(fileContent: any): string {        
        this.objFileContent = fileContent;
        return this.parse();
    }

    private parse(): string {
        var resultMsg: string;
        for (var i = 0; i != this.objFileContent.length; i++) {
            var line: string = this.objFileContent[i];
            var firstChar = line[0];
            if (firstChar != null) {
                switch (firstChar) {
                    case 'v': this.addElementToVertices(line); break;
                }
            }
        }
        resultMsg = appcons.AppConstans.ADMIN_OBJ_UPLOAD_FILE_SUCC_MSG;
        return resultMsg;
    }

    private addElementToVertices(line: string): void {
        if (line != null && line.trim().length > 0) {
            line = this.removeFirstElementFromLine(line);
            var triangleVertices = this.getVerticesFromLine(line);
        }
        for (var i = 0; i != triangleVertices.length; i++) {
            this.vertices.push(triangleVertices[i]);
        }
    }

    private getVerticesFromLine(line: string): number[] {
        var elements: string[] = line.split(/[ ,]+/);
        var result: number[] = new Array();
        for (var i = 0; i != elements.length; i++) {
            result.push(parseFloat(elements[i]));
        }
        return result;
    }

    private removeFirstElementFromLine(line: string): string {
        return line.substr(1, line.length).trim();
    }

}