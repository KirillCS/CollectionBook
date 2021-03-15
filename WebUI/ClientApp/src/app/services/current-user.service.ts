import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { UserLoginDto } from 'src/app/models/dtos/user-login.dto';
import { AuthService } from 'src/app/services/auth.service';
import { AuthTokenService } from 'src/app/services/auth-token.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  constructor(
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
    private tokenService: AuthTokenService
  ) { }

  public get currentUser(): UserLoginDto {
    if (!this.authService.isAuthenticated()) {
      return null;
    }

    let token = this.jwtHelper.decodeToken(this.tokenService.getToken());

    return {
      id: token.sub,
      login: token.unique_name
    };
  }
}
