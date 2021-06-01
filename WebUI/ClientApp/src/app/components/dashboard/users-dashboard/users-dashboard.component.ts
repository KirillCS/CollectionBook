import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { DashboardUserDto } from 'src/app/models/dtos/user/dashboard-user.dto';
import { SearchPaginatedListRequest } from 'src/app/models/requests/search-paginated-list.request';
import { Roles } from 'src/app/models/roles';
import { AdminService } from 'src/app/services/admin.service';
import { SearchBaseComponent } from '../../search/search-base.component';

@Component({
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['../dashboard.component.css', './users-dashboard.component.scss']
})
export class UsersDashboardComponent extends SearchBaseComponent implements OnInit {
  private _displayedColumns: string[] = ['id', 'login', 'role', 'isBlocked'];

  private _usersLoaded = false;
  private _users = new Array<DashboardUserDto>();

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

  public get users(): DashboardUserDto[] {
    return this._users;
  }

  public get userRole(): string {
    return Roles.User;
  }

  public get adminRole(): string {
    return Roles.Admin;
  }

  public ngOnInit(): void {
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

  public changeAdminButtonClickedHandler(user: DashboardUserDto): void {

  }

  public blockButtonClickedHandler(user: DashboardUserDto): void {
    user.isBlocked = !user.isBlocked;
  }

  private updateUsers(): void {
    this._usersLoaded = false;

    let request: SearchPaginatedListRequest = {
      searchString: this.searchString,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    };

    this._adminService.getDashboardUsers(request).subscribe(list => {
      this._users = list.items;
      this._totalCount = list.totalCount;
    }, (errorResponse: HttpErrorResponse) => {
      
    }, () => this._usersLoaded = true);
  }
}