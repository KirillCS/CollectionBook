import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

export const ACCESS_TOKEN_KEY = 'collectionbook_access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  constructor(private jwtHelper: JwtHelperService) { }

  public getToken(): string {
    let token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    }
    
    return token && this.jwtHelper.isTokenExpired(token) ? null : token;
  }

  public setToken(token: string, isConstant = false): void {
    if (isConstant) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      return;
    }

    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  public removeToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}
