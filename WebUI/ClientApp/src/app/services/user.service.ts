import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserDto } from 'src/app/models/dtos/user.dto';
import { API_URL } from 'src/app/app-injection-tokens';
import { UpdateProfileRequest } from 'src/app/models/requests/user/update-profile.request';
import { UpdateLoginRequest } from 'src/app/models/requests/user/update-login.request';
import { LoginResponse } from 'src/app/models/responses/auth/login.response';
import { UpdatePasswordRequest } from 'src/app/models/requests/user/update-password.request';
import { sendPasswordResetConfirmation } from 'src/app/models/requests/user/send-password-reset-confirmation.request';
import { ResetPasswordRequest } from '../models/requests/user/reset-password.request';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public getUser(login: string): Observable<UserDto> {
    return this.httpClient.get<UserDto>(`${this.apiUrl}api/user/${login ?? ''}`);
  }

  public updateAvatar(avatar: File): Observable<void> {
    let formData = new FormData();
    formData.append('avatar', avatar, avatar.name);
    return this.httpClient.post<void>(`${this.apiUrl}api/user/avatar/update`, formData);
  }

  public resetAvatar(): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}api/user/avatar/reset`);
  }

  public updateProfile(request: UpdateProfileRequest): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}api/user/profile/update`, request);
  }

  public updateLogin(request: UpdateLoginRequest): Observable<LoginResponse> {
    return this.httpClient.put<LoginResponse>(`${this.apiUrl}api/user/login/update`, request);
  }

  public updatePassword(request: UpdatePasswordRequest): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}api/user/password/update`, request);
  }

  public sendPasswordResetConfirmation(request: sendPasswordResetConfirmation): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}api/user/password/sendresetconfirmation`, request);
  }

  public resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}api/user/password/reset`, request);
  }
}
