import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { UserDto } from 'src/app/models/dtos/user.dto';
import { ACCESS_TOKEN_KEY, AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  constructor(private authService: AuthService, private jwtHelper: JwtHelperService) { }

  public get currentUser() : UserDto {
    if (!this.authService.isAuthenticated()) {
      return null;
    }

    let token = this.jwtHelper.decodeToken(sessionStorage.getItem(ACCESS_TOKEN_KEY));

    return {
      id: token.sub,
      login: token.unique_name
    };
  }
}
