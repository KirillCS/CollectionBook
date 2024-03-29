export class PathNode {
  private _name: string;
  private _path: string;

  constructor(name: string, path: string = null) {
    if (name == null) {
      throw new Error("name cannot be null");
    }

    this._name = name;
    this._path = path;
  }

  public get name() : string {
    return this._name
  }
  
  public get path() : string {
    return this._path
  }
}