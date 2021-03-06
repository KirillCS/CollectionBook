import { LoginUserDto } from "../dtos/login-user-dto";

export class LoginResponse {
  public user: LoginUserDto;
  public accessToken: string;
}