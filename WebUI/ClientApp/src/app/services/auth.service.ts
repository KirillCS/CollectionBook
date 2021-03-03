import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoginRequest } from 'src/app/models/requests/loginRequest';
import { LoginResponce } from 'src/app/models/responces/loginResponce';
import { RegistrateRequest } from '../models/requests/registrateRequest';
import { API_URL } from 'src/app/app-injection-tokens';

export const ACCESS_TOKEN_KEY = 'collectionbook_access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) { }

  public login(request: LoginRequest): Observable<LoginResponce> {
    return this.httpClient.post<LoginResponce>(`${this.apiUrl}api/auth/login`, request)
      .pipe(tap(response => {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
      }));
  }

  public register(request: RegistrateRequest): Observable<LoginResponce> {
    return this.httpClient.post<LoginResponce>(`${this.apiUrl}api/auth/register`, request);
  }

  public isAuthenticated(): boolean {
    let token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token == null ? false : !this.jwtHelper.isTokenExpired(token);
  }

  public logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.router.navigate(['']);
  }
}
