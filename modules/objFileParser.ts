//obj file parser 28/02/2017

import * as utilModul from "../modules/util";
import * as appcons from "../modules/AppConstans";
import * as object3d from "../modules/Object3D";
import * as databaseControl from "../modules/db";

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
                        case 'f':
                            var vertexIndices: number[] = this.facesReader(line, lineLetter, FacesType.VERTEX_INDICES);                            
                            for (var vi = 0; vi != vertexIndices.length; vi++) {
                                this.object3D.vertexIndices.push(vertexIndices[vi]);
                            }
                            var normalIndices: number[] = this.facesReader(line, lineLetter, FacesType.NORMAL_INDICES);
                            for (var ni = 0; ni != normalIndices.length; ni++) {
                                this.object3D.vertexNormalIndices.push(normalIndices[ni]);
                            }
                            var textureIndices: number[] = this.facesReader(line, lineLetter, FacesType.TEXTURE_INDICES);
                            for (var ti = 0; ti != textureIndices.length; ti++) {
                                this.object3D.vertexTextureIndices.push(textureIndices[ti]);
                            }
                            break;
                    }
                }
            }            
            resultMsg = appcons.AppConstans.ADMIN_OBJ_UPLOAD_FILE_SUCC_MSG;            
        } catch (ex) {
            console.log(ex.message);                
            resultMsg = appcons.AppConstans.ADMIN_OBJ_PARSE_FILE_EXPECT_ERR_MSG + ' ' + ex.message;
        }
        var db = new databaseControl.DatabaseControlNameSpace.DBControl();
        db.saveObject3D(this.object3D);             
        return resultMsg;
    }

    private verticesReader(line: string, lineLetter: string): void {
        if (line != null && line.trim().length > 0) {
            line = this.removeLineLetter(line, lineLetter.length);
            var vertices = this.parseVertexLine(line);
        }
        for (var i = 0; i != vertices.length; i++) {
            switch (lineLetter) {
                case 'v': this.object3D.geomteryVertices.push(vertices[i]); break;
                case 'vn': this.object3D.vertexNormals.push(vertices[i]); break;
                case 'vt': this.object3D.textureCoords.push(vertices[i]); break;
            }            
        }
    }

    private parseVertexLine(line: string): number[] {
        var elements: string[] = line.split(/[ ,]+/);
        var result: number[] = new Array();
        for (var i = 0; i != elements.length; i++) {
            result.push(parseFloat(elements[i]));
        }
        return result;
    }

    private facesReader(line: string, lineLetter: string, facesType: FacesType): number[] {
        if (line != null && line.trim().length > 0) {
            line = this.removeLineLetter(line, lineLetter.length);
            return this.parseFacesIndicesLine(line, facesType);            
        }
        return null;
    }
    
    //v1/vt1/vn1 v2/vt2/vn2 v3/vt3/vn3
    private parseFacesIndicesLine(line: String, type: FacesType): number[] {
        var elements: string[] = line.split(/[ ,/]+/);
        var result: number[] = new Array();
        for (var i = 0; i != elements.length; i++) {
            if (type == FacesType.VERTEX_INDICES) {
                if (i == 0 || i == 3 || i == 6) {
                    result.push(parseInt(elements[i]));
                }
            }
            if (type == FacesType.TEXTURE_INDICES) {
                if (i == 1 || i == 4 || i == 7) {
                    result.push(parseInt(elements[i]));
                }
            }
            if (type == FacesType.NORMAL_INDICES) {
                if (i == 2 || i == 5 || i == 8) {
                    result.push(parseInt(elements[i]));
                }
            }
        }
        return result;
    }

    private removeLineLetter(line: string, startIndex: number): string {
        return line.substr(startIndex, line.length).trim();
    }

}