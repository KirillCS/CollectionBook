import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { DashboardUserDto } from 'src/app/models/dtos/user/dashboard-user.dto';
import { SearchPaginatedListRequest } from 'src/app/models/requests/search-paginated-list.request';
import { Roles } from 'src/app/models/roles';
import { AdminService } from 'src/app/services/admin.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { FieldDialogComponent } from '../../dialogs/field-dialog/field-dialog.component';
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

  public constructor(
    private _adminService: AdminService,
    private _dialogsService: DefaultDialogsService,
    private _dialog: MatDialog
  ) {
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

  public changeRoleButtonClickedHandler(user: DashboardUserDto): void {
    let dialogRef = this._dialogsService.openYesNoDialog('Are you sure?', `Change a role of the user "${user.login}" from "${user.role}" to "${user.role == Roles.User ? Roles.Admin : Roles.User}"?`);

    dialogRef.afterClosed().subscribe((yes: boolean) => {
      if (!yes) {
        return;
      }

      this._adminService.toggleUserRole(user.id).subscribe(
        (newRole: string) => user.role = newRole,
        (errorResponse: HttpErrorResponse) => {
          switch (errorResponse.status) {
            case 401:
              this._dialogsService.openWarningMessageDialog('Not authorized', 'You must be authorized to change user role.');
              break;
            case 404:
              this.updateUsers();
              break;
            default:
              this._dialogsService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server.');
              break;
          }
        });
    });
  }

  public blockButtonClickedHandler(user: DashboardUserDto): void {
    if (user.isBlocked) {
      let dialogRef = this._dialogsService.openYesNoDialog('Are you sure?', `Are you sure you want to unblock user "${user.login}"?`);
      dialogRef.afterClosed().subscribe((yes: boolean) => {
        if (yes) {
          this.changeBlockStatus(user, null);
        }
      });
    }
    else {
      let dialogRef = this._dialog.open(FieldDialogComponent, {
        width: '550px',
        position: { top: '25vh' },
        data: {
          header: 'Block reason',
          message: 'Write the block reason and click the block button',
          inputLabel: 'Block reason',
          inputType: 'textarea',
          formControl: new FormControl('', [Validators.required, Validators.maxLength(256)]),
          inputErrors: [
            { errorCode: 'required', errorMessage: 'Write the block reason' },
            { errorCode: 'maxlength', errorMessage: 'Maximum length of the block reason is 256' }
          ],
          closeButtonName: 'Cancel',
          submitButtonName: 'Block'
        }
      });

      let submitSubscription = dialogRef.componentInstance.submitEmitter.subscribe((formControl: FormControl) => {
        if (formControl.invalid) {
          return;
        }

        dialogRef.close();
        this.changeBlockStatus(user, formControl.value);
      });

      dialogRef.afterClosed().subscribe(() => submitSubscription.unsubscribe());
    }
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

  private changeBlockStatus(user: DashboardUserDto, blockReason: string): void {
    this._adminService.changeUserBlockStatus(user.id, !user.isBlocked, blockReason).subscribe(
      () => user.isBlocked = !user.isBlocked,
      (errorResponse: HttpErrorResponse) => {
        switch (errorResponse.status) {
          case 400:
            this._dialogsService.openWarningMessageDialog('Block reason is required', `You must write a block reason to block user "${user.login}".`);
            break;
          case 401:
            this._dialogsService.openWarningMessageDialog('Not authorized', 'You must be authorized to block or unblock user');
          case 404:
            this.updateUsers();
          case 406:
            if (!user.isBlocked) {
              this._dialogsService.openInfoMessageDialog('Already blocked', `The user "${user.login}" is already blocked.`);
            }

            user.isBlocked = !user.isBlocked;
          default:
            break;
        }
      }
    );
  }
}