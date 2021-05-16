import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserDto } from 'src/app/models/dtos/user/user.dto';
import { API_URL } from 'src/app/app-injection-tokens';
import { UpdateProfileRequest } from 'src/app/models/requests/user/update-profile.request';
import { UpdateLoginRequest } from 'src/app/models/requests/user/update-login.request';
import { LoginResponse } from 'src/app/models/responses/auth/login.response';
import { UpdatePasswordRequest } from 'src/app/models/requests/user/update-password.request';
import { sendPasswordResetConfirmation } from 'src/app/models/requests/user/send-password-reset-confirmation.request';
import { ResetPasswordRequest } from '../models/requests/user/reset-password.request';
import { SearchPaginatedListRequest } from '../models/requests/search-paginated-list.request';
import { PaginatedListResponse } from '../models/responses/paginated-list.response';
import { CollectionDto } from '../models/dtos/collection/collection.dto';
import { CollectionNameDto } from '../models/dtos/collection/collection-name.dto';
import { StarNotificationDto } from '../models/dtos/star/star-notification.dto';
import { PaginatedListRequest } from '../models/requests/paginated-list.request';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public get(login: string): Observable<UserDto> {
    return this.httpClient.get<UserDto>(`${this.apiUrl}api/user/${login ?? ''}`);
  }

  public getCollections(login: string, request: SearchPaginatedListRequest): Observable<PaginatedListResponse<CollectionDto>> {
    let params = new HttpParams({
      fromObject: {
        login: login,
        searchString: request.searchString,
        pageSize: request.pageSize.toString(),
        pageIndex: request.pageIndex.toString()
      }
    });

    return this.httpClient.get<PaginatedListResponse<CollectionDto>>(`${this.apiUrl}api/user/collections`, { params });
  }

  public getStarredCollections(login: string, request: SearchPaginatedListRequest): Observable<PaginatedListResponse<CollectionDto>> {
    let params = new HttpParams({
      fromObject: {
        login: login,
        searchString: request.searchString,
        pageSize: request.pageSize.toString(),
        pageIndex: request.pageIndex.toString()
      }
    });

    return this.httpClient.get<PaginatedListResponse<CollectionDto>>(`${this.apiUrl}api/user/stars`, { params });
  }

  public getCollectionsNames(login: string, request: SearchPaginatedListRequest): Observable<PaginatedListResponse<CollectionNameDto>> {
    let params = new HttpParams({
      fromObject: {
        login: login,
        searchString: request.searchString,
        pageSize: request.pageSize.toString(),
        pageIndex: request.pageIndex.toString()
      }
    });

    return this.httpClient.get<PaginatedListResponse<CollectionDto>>(`${this.apiUrl}api/user/collections/names`, { params });
  }

  public getStarsNotifications(login: string, request: PaginatedListRequest): Observable<PaginatedListResponse<StarNotificationDto>> {
    let params = new HttpParams({
      fromObject: {
        login: login,
        pageSize: request.pageSize.toString(),
        pageIndex: request.pageIndex.toString()
      }
    });

    return this.httpClient.get<PaginatedListResponse<StarNotificationDto>>(`${this.apiUrl}api/user/stars/notifications`, { params });
  }

  public updateAvatar(avatar: File): Observable<string> {
    let formData = new FormData();
    if (avatar) {
      formData.append('avatar', avatar, avatar.name);
    }

    return this.httpClient.post<string>(`${this.apiUrl}api/user/avatar/update`, formData, { responseType: 'text' as 'json' });
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
