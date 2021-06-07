import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { DashboardUserDto } from 'src/app/models/dtos/user/dashboard-user.dto';
import { SearchPaginatedListRequest } from 'src/app/models/requests/search-paginated-list.request';
import { Roles } from 'src/app/models/roles';
import { AdminService } from 'src/app/services/admin.service';
import { AuthTokenService, TokenSettingType } from 'src/app/services/auth-token.service';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { FieldDialogComponent } from '../../dialogs/field-dialog/field-dialog.component';
import { SearchBaseComponent } from '../../search/search-base.component';

@Component({
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['../dashboard.component.scss', './users-dashboard.component.scss']
})
export class UsersDashboardComponent extends SearchBaseComponent implements OnInit {
  private _displayedColumns: string[];

  private _usersLoaded = false;
  private _users = new Array<DashboardUserDto>();

  public constructor(
    private _adminService: AdminService,
    private _dialogsService: DefaultDialogsService,
    private _dialog: MatDialog,
    private _router: Router,
    private _authService: AuthService,
    private _authTokenService: AuthTokenService,
    private _currentUserService: CurrentUserService
  ) {
    super();
    this._pageSize = 30;

    this.setTableColumns();
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

  public refreshButtonClickedHandler(): void {
    if (this.usersLoaded) {
      this.updateUsers();
    }
  }

  public pageChangedHandler(event: PageEvent): void {
    this._pageIndex = event.pageIndex;
    this._pageSize = event.pageSize;

    this.updateUsers();
  }

  public changeRoleButtonClickedHandler(user: DashboardUserDto): void {
    let dialogRef = this._dialogsService.openYesNoDialog('Вы уверены?', `Сменить роль пользователя "${user.login}" с "${user.role}" на "${user.role == Roles.User ? Roles.Admin : Roles.User}"?`);

    dialogRef.afterClosed().subscribe((yes: boolean) => {
      if (!yes) {
        return;
      }

      this._adminService.toggleUserRole(user.id).subscribe(
        (newRole: string) => user.role = newRole,
        (errorResponse: HttpErrorResponse) => {
          switch (errorResponse.status) {
            case 401:
              this._authService.logout(true);
              this._dialogsService.openWarningMessageDialog('Ошибка смены роли', 'В ходе изменения роли пользователя произошла ошибка: вы должны быть авторизованы для изменения ролей пользователей.');
            case 403:
              let updatedToken = errorResponse.error.accessToken;
              let tokenSettingType = this._authTokenService.isConstant;
              if (updatedToken && tokenSettingType !== TokenSettingType.NotSet) {
                this._authTokenService.setToken(updatedToken, tokenSettingType == TokenSettingType.Constant);
              }

              this._router.navigateByUrl('/');
              this._dialogsService.openWarningMessageDialog('Ошибка смены роли', 'В ходе изменения роли пользователя произошла ошибка: роль вашей учетной записи не позволяет изменять роли пользователей.');
              break;
            case 404:
              this._authService.logout(true);
              this._dialogsService.openWarningMessageDialog('Ошибка смены роли', 'В ходе изменения роли пользователя произошла ошибка: ваша учетная запись не найдена.');
              break;
            case 405:
              this._authService.logout(true);
              this._dialogsService.openBlockReasonDialog(errorResponse.error.blockReason);
              break;
            default:
              this._dialogsService.openWarningMessageDialog('Ошибка смены роли', `В ходе изменения роли пользователя произошла неизвестная ошибка.`);
              break;
          }
        });
    });
  }

  public blockButtonClickedHandler(user: DashboardUserDto): void {
    if (user.isBlocked) {
      let dialogRef = this._dialogsService.openYesNoDialog('Вы уверены?', `Вы уверены, что хотите разблокировать пользователя "${user.login}"?`);
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
          header: 'Блокировка пользователя',
          message: 'Введите причину блокировки и нажмите кнопку "Заблокировать"',
          inputLabel: 'Причина блокировки',
          inputType: 'textarea',
          formControl: new FormControl('', [Validators.required, Validators.maxLength(256)]),
          inputErrors: [
            { errorCode: 'required', errorMessage: 'Введите причину блокировки' },
            { errorCode: 'maxlength', errorMessage: 'Длина причины не может превышать 256 символов' }
          ],
          closeButtonName: 'Отмена',
          submitButtonName: 'Заблокировать'
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

  private setTableColumns(): void {
    let currentUser = this._currentUserService.currentUser;
    switch (true) {
      case !currentUser:
        this._authService.logout(true);
        break;
      case currentUser.role == Roles.Owner:
        this._displayedColumns = ['id', 'login', 'role', 'isBlocked'];
        break;
      case currentUser.role == Roles.Admin:
        this._displayedColumns = ['id', 'login', 'isBlocked'];
        break;
      default:
        this._authService.logout(true);
        break;
    }
  }

  private updateUsers(): void {
    this._usersLoaded = false;

    let request: SearchPaginatedListRequest = {
      searchString: this.searchString,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    };

    this._adminService.getDashboardUsers(request).subscribe(
      list => {
        this._users = list.items;
        this._totalCount = list.totalCount;
      },
      (errorResponse: HttpErrorResponse) => {
        switch (errorResponse.status) {
          case 401:
            this._authService.logout(true);
            this._dialogsService.openWarningMessageDialog('Ошибка выборки пользователей', 'В ходе выборки пользователей произошла ошибка: вы не авторизованы.');
          case 403:
            let updatedToken = errorResponse.error.accessToken;
            let tokenSettingType = this._authTokenService.isConstant;
            if (updatedToken && tokenSettingType !== TokenSettingType.NotSet) {
              this._authTokenService.setToken(updatedToken, tokenSettingType == TokenSettingType.Constant);
            }

            this._router.navigateByUrl('/');
            this._dialogsService.openWarningMessageDialog('Ошибка выборки пользователей', 'В ходе выборки пользователей произошла ошибка: вы не имеете доступа к панеле управления пользователями.');
            break;
          case 404:
            this._authService.logout(true);
            this._dialogsService.openWarningMessageDialog('Ошибка выборки пользователей', 'В ходе выборки пользователей произошла ошибка: ваша учетная запись не найдена.');
            break;
          case 405:
            this._authService.logout(true);
            this._dialogsService.openBlockReasonDialog(errorResponse.error.blockReason);
            break;
          default:
            this._dialogsService.openWarningMessageDialog('Ошибка выборки пользователей', `В ходе выборки пользователей произошла неизвестная ошибка.`);
            break;
        }
      },
      () => this._usersLoaded = true);
  }

  private changeBlockStatus(user: DashboardUserDto, blockReason: string): void {
    this._adminService.changeUserBlockStatus(user.id, !user.isBlocked, blockReason).subscribe(
      () => user.isBlocked = !user.isBlocked,
      (errorResponse: HttpErrorResponse) => {
        switch (errorResponse.status) {
          case 400:
            this._dialogsService.openWarningMessageDialog('Ошибка блокировки пользователя', `В ходе блокировки пользователя произошла ошибка: вы должны указать причину блокировки пользователя "${user.login}".`);
            break;
          case 401:
            this._authService.logout(true);
            this._dialogsService.openWarningMessageDialog(`Ошибка ${blockReason ? 'блокировки' : 'разблокировки'} пользователя`, `В ходе ${blockReason ? 'блокировки' : 'разблокировки'} пользователя произошла ошибка: вы не авторизованы.`);
          case 403:
            let updatedToken = errorResponse.error.accessToken;
            let tokenSettingType = this._authTokenService.isConstant;
            if (updatedToken && tokenSettingType !== TokenSettingType.NotSet) {
              this._authTokenService.setToken(updatedToken, tokenSettingType === TokenSettingType.Constant);
            }

            this._router.navigateByUrl('/');
            this._dialogsService.openWarningMessageDialog(`Ошибка ${blockReason ? 'блокировки' : 'разблокировки'} пользователя`, `В ходе ${blockReason ? 'блокировки' : 'разблокировки'} пользователя произошла ошибка: роль вашей учетной записи не позволяет блокировать и разблокировать пользователей.`);
            break;
          case 404:
            this._authService.logout(true);
            this._dialogsService.openWarningMessageDialog(`Ошибка ${blockReason ? 'блокировки' : 'разблокировки'} пользователя`, `В ходе ${blockReason ? 'блокировки' : 'разблокировки'} пользователя произошла ошибка: ваша учетная запись не найдена.`);
            break;
          case 405:
            this._authService.logout(true);
            this._dialogsService.openBlockReasonDialog(errorResponse.error.blockReason);
            break;
          case 406:
            if (!user.isBlocked) {
              this._dialogsService.openInfoMessageDialog('Уже заблокирован', `Пользователь "${user.login}" уже был заблокирован.`);
            }

            user.isBlocked = !user.isBlocked;
            break;
          default:
            this._dialogsService.openWarningMessageDialog(`Ошибка ${blockReason ? 'блокировки' : 'разблокировки'} пользователя`, `В ходе ${blockReason ? 'блокировки' : 'разблокировки'} пользователя произошла неизвестная ошибка.`);
            break;
        }
      }
    );
  }
}