//adatbázis számára fenntartott 3d-s objektum struktúra tárolására szolgáló entitás

export class Object3D {

    private _id: number;
    private _objectname: string;
    private _groupname: string;
    private _geomteryVertices: string;           //v
    private _vertexNormals: string;              //vn
    private _textureCoords: string;              //vt
    private _vertexIndices: string;              //f
    private _vertexTextureIndices: string;       //f
    private _vertexNormalIndices: string;        //f
    private _geometryVerticesNumber: number;
    private _vertexNormalsNumber: number;
    private _textureCoordsNumber: number;
    private _facesNumber: number;        

    constructor() {
        this._id = null;
        this._objectname = "";
        this._groupname = "";
        this._geomteryVertices = "";
        this._vertexNormals = "";
        this._textureCoords = "";
        this._vertexIndices = "";
        this._vertexTextureIndices = "";
        this._vertexNormalIndices = "";
        this._geometryVerticesNumber = 0;
        this._vertexNormalsNumber = 0;
        this._textureCoordsNumber = 0;
        this._facesNumber = 0;
        var v = new Float32Array(10);
    }    

    get id(): number {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
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

    get geomteryVertices(): string {
        return this._geomteryVertices;
    }

    set geomteryVertices(geomteryVertices: string) {
        this._geomteryVertices = geomteryVertices;
    }

    get vertexNormals(): string {
        return this._vertexNormals;
    }

    set vertexNormals(vertexNormals: string) {
        this._vertexNormals = vertexNormals;
    }

    get textureCoords(): string {
        return this._textureCoords;
    }

    set textureCoords(textureCoords: string) {
        this._textureCoords = textureCoords;
    }

    get vertexIndices(): string {
        return this._vertexIndices;
    }

    set vertexIndices(vertexIndices: string) {
        this._vertexIndices = vertexIndices;
    }

    get vertexTextureIndices(): string {
        return this._vertexTextureIndices;
    }

    set vertexTextureIndices(vertexTextureIndices: string) {
        this._vertexTextureIndices = vertexTextureIndices;
    }

    get vertexNormalIndices(): string {
        return this._vertexNormalIndices;
    }

    set vertexNormalIndices(vertexNormalIndices: string) {
        this._vertexNormalIndices = vertexNormalIndices;
    }

    get geometryVerticesNumber(): number {
        return this._geometryVerticesNumber;
    }

    set geometryVerticesNumber(geometryVerticesNumber: number) {
        this._geometryVerticesNumber = geometryVerticesNumber;
    }

    get vertexNormalsNumber(): number {
        return this._vertexNormalsNumber;
    }

    set vertexNormalsNumber(vertexNormalsNumber: number) {
        this._vertexNormalsNumber = vertexNormalsNumber;
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