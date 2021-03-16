import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserDto } from 'src/app/models/dtos/user.dto';
import { API_URL } from 'src/app/app-injection-tokens';
import { UpdateProfileRequest } from 'src/app/models/requests/user/update-profile.request';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public getUser(login: string): Observable<UserDto> {
    return this.httpClient.get<UserDto>(`${this.apiUrl}api/user/${login ?? ''}`);
  }

  public updateProfile(request: UpdateProfileRequest): Observable<UserDto> {
    return this.httpClient.put<UserDto>(`${this.apiUrl}api/user/setprofile`, request);
  }
}
