export class UserLoginDto {
  private _id: string;
  private _login: string;
  private _role: string;

  constructor(id: string, login: string, role: string) {
    if (!id) {
      throw new Error("id cannot be null or empty");
    }

    if (!login) {
      throw new Error("login cannot be null or empty");
    }

    this._id = id;
    this._login = login;
    this._role = role;
  }

  public get id(): string {
    return this._id;
  }

  public get login(): string {
    return this._login;
  }

  public get role(): string {
    return this._role;
  }
}