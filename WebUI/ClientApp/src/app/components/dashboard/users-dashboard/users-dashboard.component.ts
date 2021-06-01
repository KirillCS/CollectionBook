import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';

import { DashboardUserDto } from 'src/app/models/dtos/user/dashboard-user.dto';
import { SearchPaginatedListRequest } from 'src/app/models/requests/search-paginated-list.request';
import { AdminService } from 'src/app/services/admin.service';
import { SearchBaseComponent } from '../../search/search-base.component';

@Component({
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.scss']
})
export class UsersDashboardComponent extends SearchBaseComponent implements OnInit {
  private _displayedColumns: string[] = ['id', 'login', 'role', 'isBlocked'];

  private _usersLoaded = false;
  private _dataSource = new MatTableDataSource<DashboardUserDto>();

  @ViewChild(MatPaginator) private _paginator: MatPaginator;

  public constructor(private _adminService: AdminService) {
    super();
    this._pageSize = 30;
  }

  public get displayedColumns(): string[] {
    return this._displayedColumns;
  }

  public get usersLoaded(): boolean {
    return this._usersLoaded;
  }

  public get dataSource(): MatTableDataSource<DashboardUserDto> {
    return this._dataSource;
  }

  public ngOnInit(): void {
    this.dataSource.paginator = this._paginator;
    this.updateUsers();
  }

  public searchInputChangedHandler(searchString: string): void {
    this._pageIndex = 0;
    this._searchString = searchString;

    this.updateUsers();
  }

  public pageChangedHandler(event: PageEvent): void {
    this._pageIndex = event.pageIndex;
    this._pageSize = event.pageSize;

    this.updateUsers();
  }

  public blockButtonClickedHandler(user: DashboardUserDto): void {
    user.isBlocked = !user.isBlocked;
  }

  private updateUsers(): void {
    this._usersLoaded = false;

    setTimeout(() => {
      let request: SearchPaginatedListRequest = {
        searchString: this.searchString,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };

      this._adminService.getDashboardUsers(request).subscribe(list => {
        this.dataSource.data = list.items;
        this._totalCount = list.totalCount;
        this._usersLoaded = true;
      }, (errorResponse: HttpErrorResponse) => {

      }, () => {
      });
    }, 1000);
  }
}