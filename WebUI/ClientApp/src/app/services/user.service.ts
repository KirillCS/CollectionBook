import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserProfileDto } from 'src/app/models/dtos/user.dto';
import { API_URL } from 'src/app/app-injection-tokens';
import { UpdateProfileRequest } from 'src/app/models/requests/user/update-profile.request';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public getProfile(login: string): Observable<UserProfileDto> {
    return this.httpClient.get<UserProfileDto>(`${this.apiUrl}api/user/profile/${login ?? ''}`);
  }

  public updateProfile(request: UpdateProfileRequest): Observable<UserProfileDto> {
    return this.httpClient.put<UserProfileDto>(`${this.apiUrl}api/user/setprofile`, { request });
  }
}
