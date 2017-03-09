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

export class ObjFileControl {        
    
    private objFileContent: any;
    private object3D: object3d.Object3D;  
    private _loaded3DObj: object3d.Object3D;
    private dbCtrl = new databaseControl.DatabaseControlNameSpace.DBControl();

    constructor() {
        //NOP...
    }

    public objFileParser(fileContent: any): string {        
        this.objFileContent = fileContent;
        this.object3D = new object3d.Object3D();
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
            
            resultMsg = this.save3DObject();

            if (resultMsg == null || resultMsg == '0') {
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

    private save3DObject(): string {
        var resultMsg = null;
        var self = this;            //így kell, hogy a async lássa az objektum "külső" változóit https://www.codementor.io/codeforgeek/manage-async-nodejs-callback-example-code-du107q1pn
        try {
            async.series({
                save: function (callback) {                    
                    var db = new databaseControl.DatabaseControlNameSpace.DBControl();
                    resultMsg += db.saveObject3D(self.object3D, callback);                    
                    callback();
                }
            }, function (err) {
                    
                }                
            );
        } catch (error) {            
            resultMsg += appcons.AppConstans.OBJECT_3D_SAVE_ERROR + ' ' + error.message;
        }                
        return resultMsg;              
    }

    public get3DObject(objectID): object3d.Object3D {        
        return this.load3DObject(objectID);        
    }

    public getLoaded3DObject(): object3d.Object3D {
        if (this._loaded3DObj == null)
            return new object3d.Object3D();
        return this._loaded3DObj;
    }

    private load3DObject(objectID: number): object3d.Object3D {        
        var self = this;
        self._loaded3DObj = new object3d.Object3D();
        try {
            //https://prog.hu/tudastar/192946/node-js-async-muveletek-sorrendisege            
            console.log('@1');            
            async.series({
                load: function (callback) {
                    console.log('@2');
                    self.dbCtrl.loadObject3D(function getCallback(err, result) {
                        if (err) {
                            console.log('@6 ' + err.message);
                        } else {
                            console.log('@6');
                            if (result.length > 0) {
                                self._loaded3DObj = result[0];
                                //console.log(result[0].geomteryVertices);
                                //loadedObject3D.id = result[0].id;
                                //loadedObject3D.geomteryVertices = result[0].geomteryVertices;
                                //return self._loaded3DObj;
                            }
                        }
                        callback(err, result);
                    }, objectID);                    
                }                
            }, function asyncParallalResulthandler(err, results) {
                if (err) {
                    console.log('@7 ' + err.message);
                } else {
                    //console.log('@7' + results.load);
                    if (results.load[0] != null) {
                        //loadedObject3D = results.load[0];
                        //loadedObject3D.id = results.load[0].id;
                        //loadedObject3D.geomteryVertices = results.load[0].geomteryVertices;
                    }
                    console.log('@7 betoltve' + self._loaded3DObj.geomteryVertices);
                    return self._loaded3DObj;                                       
                }
            });
            console.log('@8');
        } catch (error) {            
            console.log(appcons.AppConstans.OBJECT_3D_LOAD_ERROR + ' ' + error.message);
        }    
        console.log('@10 kilep loadedObject3D');    
        return self._loaded3DObj;
    }    

}