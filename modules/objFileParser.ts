//obj file parser 28/02/2017

import * as utilModul from "../modules/util";
import * as appcons from "../modules/AppConstans";

export class Object3D {

    private _objectname: string;
    private _groupname: string;
    private _geomteryVertices: number[];           //v
    private _vertexNormals: number[];              //vn
    private _textureCoords: number[];              //vt
    private _vertexIndices: number[];              //f
    private _vertexTextureIndices: number[];       //f
    private _vertexNormalIndices: number[];        //f

    constructor() {
        this._objectname = "";
        this._groupname = "";
        this._geomteryVertices = new Array();
        this._vertexNormals = new Array();
        this._textureCoords = new Array();
        this._vertexIndices = new Array();
        this._vertexTextureIndices = new Array();
        this._vertexNormalIndices = new Array();
    }

    get objectname(): string {
        return this._objectname;
    }
    set objectname(objectname: string) {
        this._objectname = objectname;
    }

    get groupname(): string {
        return this._groupname;
    }
    set groupname(groupname: string) {
        this._groupname = groupname;
    }

    get geomteryVertices(): number[] {
        return this._geomteryVertices;
    }

    set geomteryVertices(geomteryVertices: number[]) {
        this._geomteryVertices = geomteryVertices;
    }

    get vertexNormals(): number[] {
        return this._vertexNormals;
    }

    set vertexNormals(vertexNormals: number[]) {
        this._vertexNormals = vertexNormals;
    }

    get textureCoords(): number[] {
        return this._textureCoords;
    }

    set textureCoords(textureCoords: number[]) {
        this._textureCoords = textureCoords;
    }

    get vertexIndices(): number[] {
        return this._vertexIndices;
    }

    set vertexIndices(vertexIndices: number[]) {
        this._vertexIndices = vertexIndices;
    }

    get vertexTextureIndices(): number[] {
        return this._vertexTextureIndices;
    }

    set vertexTextureIndices(vertexTextureIndices: number[]) {
        this._vertexTextureIndices = vertexTextureIndices;
    }

    get vertexNormalIndices(): number[] {
        return this._vertexNormalIndices;
    }

    set vertexNormalIndices(vertexNormalIndices: number[]) {
        this._vertexNormalIndices = vertexNormalIndices;
    }
}

export class ObjFileParser {        

    private objFileContent: any;
    private object3D: Object3D;    

    constructor() {
        this.object3D = new Object3D();
    }

    public objFileParser(fileContent: any): string {        
        this.objFileContent = fileContent;
        return this.parse();
    }

    private parse(): string {
        var resultMsg: string;
        try {
            for (var i = 0; i != this.objFileContent.length; i++) {
                var line: string = this.objFileContent[i];
                var lineLetter = line.substr(0, 2).trim();
                if (lineLetter != null) {
                    switch (lineLetter) {
                        case 'v': this.verticesReader(line, lineLetter); break;
                        case 'vn': this.verticesReader(line, lineLetter); break;
                        case 'vt': this.verticesReader(line, lineLetter); break;
                        case 'o': this.object3D.objectname = this.removeLineLetter(line, lineLetter.length); break;
                        case 'g': this.object3D.groupname = this.removeLineLetter(line, lineLetter.length); break;
                    }
                }
            }            
            resultMsg = appcons.AppConstans.ADMIN_OBJ_UPLOAD_FILE_SUCC_MSG;            
        } catch (ex) {
            console.log(ex.message);                
            resultMsg = appcons.AppConstans.ADMIN_OBJ_PARSE_FILE_EXPECT_ERR_MSG + ' ' + ex.message;
        }                
        return resultMsg;
    }

    private verticesReader(line: string, lineLetter: string): void {
        if (line != null && line.trim().length > 0) {
            line = this.removeLineLetter(line, lineLetter.length);
            var vertices = this.parseLine(line);
        }
        for (var i = 0; i != vertices.length; i++) {
            switch (lineLetter) {
                case 'v': this.object3D.geomteryVertices.push(vertices[i]); break;
                case 'vn': this.object3D.vertexNormals.push(vertices[i]); break;
                case 'vt': this.object3D.textureCoords.push(vertices[i]); break;
            }            
        }
    }

    private parseLine(line: string): number[] {
        var elements: string[] = line.split(/[ ,]+/);
        var result: number[] = new Array();
        for (var i = 0; i != elements.length; i++) {
            result.push(parseFloat(elements[i]));
        }
        return result;
    }

    private removeLineLetter(line: string, startIndex: number): string {
        return line.substr(startIndex, line.length).trim();
    }

}