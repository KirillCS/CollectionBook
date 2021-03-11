import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, resolveForwardRef } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoginRequest } from 'src/app/models/requests/login.request';
import { LoginResponse } from 'src/app/models/responses/login.response';
import { RegisterRequest } from 'src/app/models/requests/register.request';
import { API_URL } from 'src/app/app-injection-tokens';
import { AuthTokenService } from 'src/app/services/auth-token.service';
import { RegisterResponse } from 'src/app/models/responses/register.response';

export const ACCESS_TOKEN_KEY = 'collectionbook_access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private tokenService: AuthTokenService,
    private router: Router
  ) { }

  public login(request: LoginRequest, rememberMe: boolean): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}api/auth/login`, request)
      .pipe(tap(response => {
        this.tokenService.setToken(response.accessToken, rememberMe);
      }));
  }

  public register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.httpClient.post<RegisterResponse>(`${this.apiUrl}api/auth/register`, request)
      .pipe(tap(response => {
        let queryParams: Params = { id: response.id, email: response.email };
        this.router.navigate(['emailconfirmation'], { queryParams });
      }));
  }

  public isAuthenticated(): boolean {
    return this.tokenService.getToken() != null;
  }

  public logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['']);
  }
}
