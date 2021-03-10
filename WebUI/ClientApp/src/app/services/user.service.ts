import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserProfileDto } from 'src/app/models/dtos/user-profile.dto';
import { API_URL } from 'src/app/app-injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public getProfile(login: string) : Observable<UserProfileDto> {
    return this.httpClient.get<UserProfileDto>(`${this.apiUrl}api/user/profile/${login ?? ''}`);
  }
}
