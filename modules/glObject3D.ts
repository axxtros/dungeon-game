//kliens számára átadható webGL-es 3D objektum entitás

import * as utilModul from "../modules/util";
import * as object3d from "../modules/Object3D";

export class GLObject3D {

    private _id: number;
    private _name: string;
    private _group: string;
    private _vertices: Float32Array;
    private _vertexIndices: Uint8Array;
    private _verticesNumber: number;
    private _normals: Float32Array;
    private _normalIndices: Uint8Array;
    private _normalNumber: number;
    private _textureCoords: Float32Array;    
    private _textureIndices: Uint8Array;
    private _textureCoordsNumber: number;    
    private _facesNumber: number;

    constructor(dbObject3d?: object3d.Object3D) {
        if (typeof dbObject3d === "object" && dbObject3d != null) {
            this.initValues(dbObject3d);
        } else {
            this.initEmpty();
        }
    }

    private initValues(dbObject3d: object3d.Object3D): void {
        this.id = dbObject3d.id != null ? dbObject3d.id : 0;
        this.name = dbObject3d.objectname != null ? dbObject3d.objectname : "";
        this.group = dbObject3d.groupname != null ? dbObject3d.groupname : "";
        this.vertices = utilModul.Util.convertStringToFloat32Array(dbObject3d.geomteryVertices);
        this.vertexIndices = utilModul.Util.convertStringToUint8Array(dbObject3d.vertexIndices);
        this.verticesNumber = dbObject3d.geometryVerticesNumber;
        this.normals = utilModul.Util.convertStringToFloat32Array(dbObject3d.vertexNormals);
        this.normalIndices = utilModul.Util.convertStringToUint8Array(dbObject3d.vertexNormalIndices);
        this.normalNumber = dbObject3d.vertexNormalsNumber;
        this.textureCoords = utilModul.Util.convertStringToFloat32Array(dbObject3d.textureCoords);
        this.textureIndices = utilModul.Util.convertStringToUint8Array(dbObject3d.vertexTextureIndices);
        this.textureCoordsNumber = dbObject3d.textureCoordsNumber;
        this.facesNumber = dbObject3d.facesNumber;
    }

    private initEmpty(): void {
        this.id = 0;
        this.name = "";
        this.group = "";
        this.vertices = new Float32Array(0);
        this.vertexIndices = new Uint8Array(0);
        this.verticesNumber = 0;
        this.normals = new Float32Array(0);
        this.normalIndices = new Uint8Array(0);
        this.normalNumber = 0;
        this.textureCoords = new Float32Array(0);
        this.textureIndices = new Uint8Array(0);
        this.textureCoordsNumber = 0;
        this.facesNumber = 0;
    }
    
    get id(): number {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }

    get name(): string {
        return this._name;
    }
    set name(name: string) {
        this._name = name;
    }

    get group(): string {
        return this._group;
    }
    set group(group: string) {
        this._group = group;
    }

    get vertices(): Float32Array {
        return this._vertices;
    }

    set vertices(vertices: Float32Array) {
        this._vertices = vertices;
    }

    get vertexIndices(): Uint8Array {
        return this._vertexIndices;
    }

    set vertexIndices(vertexIndices: Uint8Array) {
        this._vertexIndices = vertexIndices;
    }

    get verticesNumber(): number {
        return this._verticesNumber;
    }

    set verticesNumber(verticesNumber: number) {
        this._verticesNumber = verticesNumber;
    }

    get normals(): Float32Array {
        return this._normals;
    }

    set normals(normals: Float32Array) {
        this._normals = normals;
    }

    get normalIndices(): Uint8Array {
        return this._normalIndices;
    }

    set normalIndices(normalIndices: Uint8Array) {
        this._normalIndices = normalIndices;
    }

    get normalNumber(): number {
        return this._normalNumber;
    }

    set normalNumber(normalNumber: number) {
        this._normalNumber = normalNumber;
    }

    get textureCoords(): Float32Array {
        return this._textureCoords;
    }

    set textureCoords(textureCoords: Float32Array) {
        this._textureCoords = textureCoords;
    }

    get textureIndices(): Uint8Array {
        return this._textureIndices;
    }

    set textureIndices(textureIndices: Uint8Array) {
        this._textureIndices = textureIndices;
    }

    get textureCoordsNumber(): number {
        return this._textureCoordsNumber;
    }

    set textureCoordsNumber(textureCoordsNumber: number) {
        this._textureCoordsNumber = textureCoordsNumber;
    }

    get facesNumber(): number {
        return this._facesNumber;
    }

    set facesNumber(facesNumber: number) {
        this._facesNumber = facesNumber;
    }
}