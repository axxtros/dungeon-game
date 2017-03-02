

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