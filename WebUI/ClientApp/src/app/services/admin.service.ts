import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '../app-injection-tokens';
import { DashboardReportDto } from '../models/dtos/report/dashboard-report.dto';
import { DashboardUserDto } from '../models/dtos/user/dashboard-user.dto';
import { PaginatedListRequest } from '../models/requests/paginated-list.request';
import { SearchPaginatedListRequest } from '../models/requests/search-paginated-list.request';
import { PaginatedListResponse } from '../models/responses/paginated-list.response';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public getDashboardUsers(request: SearchPaginatedListRequest): Observable<PaginatedListResponse<DashboardUserDto>> {
    let params = new HttpParams({
      fromObject: {
        searchString: request.searchString,
        pageIndex: request.pageIndex.toString(),
        pageSize: request.pageSize.toString()
      }
    });

    return this.httpClient.get<PaginatedListResponse<DashboardUserDto>>(`${this.apiUrl}api/admin/users`, { params });
  }

  public getDashboardReports(request: PaginatedListRequest, from: Date, to: Date): Observable<PaginatedListResponse<DashboardReportDto>> {
    let params = new HttpParams({
      fromObject: {
        pageIndex: request.pageIndex.toString(),
        pageSize: request.pageSize.toString(),
        from: from ? from.toDateString() : '',
        to: to ? to.toDateString() : ''
      }
    });

    return this.httpClient.get<PaginatedListResponse<DashboardReportDto>>(`${this.apiUrl}api/admin/reports`, { params });
  }

  public toggleUserRole(userId: string): Observable<string> {
    return this.httpClient.post<string>(`${this.apiUrl}api/admin/role`, { id: userId }, { responseType: 'text' as 'json' });
  }

  public changeUserBlockStatus(id: string, newBlockStatus: boolean, blockReason: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}api/admin/block`, { id, newBlockStatus, blockReason });
  }
}
