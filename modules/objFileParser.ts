//obj file parser 28/02/2017

import * as utilModul from "../modules/util";
import * as appcons from "../modules/AppConstans";
import * as object3d from "../modules/Object3D";
import * as databaseControl from "../modules/db";

var async = require('async');

enum FacesType {
    VERTEX_INDICES,
    TEXTURE_INDICES,
    NORMAL_INDICES
};

export class ObjFileParser {        
    
    private objFileContent: any;
    private object3D: object3d.Object3D;    

    constructor() {
        this.object3D = new object3d.Object3D();
    }

    public objFileParser(fileContent: any): string {        
        this.objFileContent = fileContent;
        return this.parse();
    }

    private parse(): string {        
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
                        case 'f':
                            this.object3D.vertexIndices += this.facesReader(line, lineLetter, FacesType.VERTEX_INDICES);
                            this.object3D.vertexNormalIndices += this.facesReader(line, lineLetter, FacesType.NORMAL_INDICES);
                            this.object3D.vertexTextureIndices += this.facesReader(line, lineLetter, FacesType.TEXTURE_INDICES);                            
                            break;
                    }
                }
            }
            var resultMsg: string;
            //console.log('@1');            
            var self = this;            //így kell, hogy a async lássa az objektum "külső" változóit https://www.codementor.io/codeforgeek/manage-async-nodejs-callback-example-code-du107q1pn
            async.series([
                function () {
                    var db = new databaseControl.DatabaseControlNameSpace.DBControl();
                    resultMsg = db.saveObject3D(self.object3D);
                    //console.log('@3');
                }
            ]);
            //console.log('@4');

            if (resultMsg == null || resultMsg.trim().length == 0) {
                resultMsg = appcons.AppConstans.ADMIN_OBJ_UPLOAD_FILE_SUCC_MSG;                                
            }
        } catch (ex) {
            console.log(ex.message);                
            resultMsg = appcons.AppConstans.ADMIN_OBJ_PARSE_FILE_EXPECT_ERR_MSG + ' ' + ex.message;
        }        
        return resultMsg;
    }

    private verticesReader(line: string, lineLetter: string): void {
        if (line != null && line.trim().length > 0) {
            line = this.removeLineLetter(line, lineLetter.length);
            var vertices = this.parseVertexLine(line);
        }
        for (var i = 0; i != vertices.length; i++) {
            switch (lineLetter) {
                case 'v': this.object3D.geomteryVertices += vertices[i] + ','; break;
                case 'vn': this.object3D.vertexNormals += vertices[i] + ','; break;
                case 'vt': this.object3D.textureCoords += vertices[i] + ','; break;
            }            
        }
    }

    private parseVertexLine(line: string): string[] {
        var elements: string[] = line.split(/[ ,]+/);
        var result: string[] = new Array();
        for (var i = 0; i != elements.length; i++) {
            result.push(parseFloat(elements[i]).toFixed(2));
        }
        return result;
    }

    private facesReader(line: string, lineLetter: string, facesType: FacesType): string {
        if (line != null && line.trim().length > 0) {
            line = this.removeLineLetter(line, lineLetter.length);
            return this.parseFacesIndicesLine(line, facesType);            
        }
        return null;
    }
    
    //v1/vt1/vn1 v2/vt2/vn2 v3/vt3/vn3
    private parseFacesIndicesLine(line: String, type: FacesType): string {
        var elements: string[] = line.split(/[ ,/]+/);
        var result: string = "";
        for (var i = 0; i != elements.length; i++) {
            if (type == FacesType.VERTEX_INDICES) {
                if (i == 0 || i == 3 || i == 6) {                    
                    result += elements[i] + ',';
                }
            }
            if (type == FacesType.TEXTURE_INDICES) {
                if (i == 1 || i == 4 || i == 7) {
                    result += elements[i] + ',';
                }
            }
            if (type == FacesType.NORMAL_INDICES) {
                if (i == 2 || i == 5 || i == 8) {
                    result += elements[i] + ',';
                }
            }
        }
        return result;
    }

    private removeLineLetter(line: string, startIndex: number): string {
        return line.substr(startIndex, line.length).trim();
    }

}