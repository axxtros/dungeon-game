

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

    constructor() {
        this._objectname = "";
        this._groupname = "";
        this._geomteryVertices = "";
        this._vertexNormals = "";
        this._textureCoords = "";
        this._vertexIndices = "";
        this._vertexTextureIndices = "";
        this._vertexNormalIndices = "";
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
}