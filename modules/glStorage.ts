//webgl server side storage class

import * as glObject3D from "../modules/GLObject3D";

export class GLStorage {

    public static glObjectStorage: Array<glObject3D.GLObject3D> = new Array();

    public static addGLObjectToStorage(glObject: glObject3D.GLObject3D) {
        var isExists = false;
        if (glObject != null && this.glObjectStorage != null && this.glObjectStorage.length > 0) {
            for (var i = 0; i != this.glObjectStorage.length; i++) {
                if (this.glObjectStorage[i].id == glObject.id) {
                    isExists = true;
                    break;
                }
            }
        }
        if (!isExists) {
            this.glObjectStorage.push(glObject);
        }
    }

    public static getObjectFromStorage(objectID: number): glObject3D.GLObject3D {        
        if (this.glObjectStorage != null && this.glObjectStorage.length > 0) {
            for (var i = 0; i != this.glObjectStorage.length; i++) {
                if (this.glObjectStorage[i].id == objectID) {
                    return this.glObjectStorage[i];
                }
            }
        }
        return null;
    }

}