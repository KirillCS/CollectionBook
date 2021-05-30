import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '../app-injection-tokens';
import { UserCoverDto } from '../models/dtos/user/user-cover.dto';
import { SearchPaginatedListRequest } from '../models/requests/search-paginated-list.request';
import { PaginatedListResponse } from '../models/responses/paginated-list.response';

@Injectable({
  providedIn: 'root'
})
export class StarService {

  public constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public getUsers(collectionId: number, request: SearchPaginatedListRequest): Observable<PaginatedListResponse<UserCoverDto>> {

    let params = new HttpParams({
      fromObject: {
        collectionId: collectionId.toString(),
        searchString: request.searchString,
        pageSize: request.pageSize.toString(),
        pageIndex: request.pageIndex.toString()
      }
    });

    return this.httpClient.get<PaginatedListResponse<UserCoverDto>>(`${this.apiUrl}api/star/users`, { params });
  }

  public toggle(collectionId: number): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}api/star`, { collectionId });
  }
}
