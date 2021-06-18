import { Component, Inject } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserLoginDto } from 'src/app/models/dtos/user/user-login.dto';
import { Params, PRIMARY_OUTLET, Router } from '@angular/router';
import { SEARCH_STRING_KEY } from 'src/app/app-injection-tokens';
import { Roles } from 'src/app/models/roles';
import { MatDialog } from '@angular/material/dialog';
import { FieldDialogComponent } from '../dialogs/field-dialog/field-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AuthTokenService } from 'src/app/services/auth-token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { ChangeOwnerPasswordDialogComponent } from '../dialogs/change-owner-password-dialog/change-owner-password-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  private _isInputVisible = false;

  public constructor(
    @Inject(SEARCH_STRING_KEY) private searchStringKey: string,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
    private authTokenService: AuthTokenService,
    private dialogsService: DefaultDialogsService
  ) { }

  public get isInputVisible(): boolean {
    return this._isInputVisible;
  }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public get currentUser(): UserLoginDto {
    return this.currentUserService.currentUser;
  }

  public get ownerRole(): string {
    return Roles.Owner;
  }

  public get adminRole(): string {
    return Roles.Admin;
  }

  public changeSearchInputVisibility(): void {
    this._isInputVisible = !this._isInputVisible;
  }

  public searchInputChanged(input: HTMLInputElement): void {
    let queryParams: Params = {
      [this.searchStringKey]: input.value
    };

    let urlTree = this.router.parseUrl(this.router.url);
    let urlGroup = urlTree.root.children[PRIMARY_OUTLET];
    let url = '/search/collections';
    if (urlGroup && urlGroup.segments[0].path === 'search') {
      url = `/${urlGroup.segments.join('/')}`;
    }

    this.router.navigate([url], { queryParams, queryParamsHandling: 'merge' });
    input.value = '';
    this._isInputVisible = false;
  }

  public changeLogin(): void {
    let dialogRef = this.dialog.open(FieldDialogComponent, {
      width: '550px',
      position: { top: '30vh' },
      data: {
        header: 'Изменение логина',
        message: `Введите новый логин и нажмите кнопку "Изменить". Текущий логин: ${this.currentUser.login}.`,
        inputLabel: 'Новый логин',
        inputType: 'text',
        formControl: new FormControl('', [Validators.required, Validators.maxLength(256), Validators.pattern('^[a-zA-Z0-9-_.]+$')]),
        inputErrors: [
          { errorCode: 'required', errorMessage: 'Введите новый логин' },
          { errorCode: 'maxlength', errorMessage: 'Логин не может быть длинее 256 символов' },
          { errorCode: 'pattern', errorMessage: 'Логин может содержать только английские буквы, цифры и символы: _ - .' },
          { errorCode: 'using', errorMessage: 'Введенный логин совпадает с используемым' },
          { errorCode: 'exists', errorMessage: 'Данный логин уже используется' }
        ],
        closeButtonName: 'Отмена',
        submitButtonName: 'Изменить'
      }
    });

    let sub = dialogRef.componentInstance.submitEmitter.subscribe((formControl: FormControl) => {
      if (formControl.invalid) {
        return;
      }

      let newLogin = formControl.value;
      if (newLogin == this.currentUser?.login) {
        formControl.setErrors({ using: true });
        return;
      }

      this.userService.updateLogin({ login: newLogin }).subscribe(
        response => {
          dialogRef.close();
          this.authTokenService.setToken(response.accessToken);
          this.dialogsService.openSuccessMessageDialog('Логин изменен', `Логин успешно изменен на ${newLogin}.`);
        },
        (errorResponse: HttpErrorResponse) => {
          switch (errorResponse.status) {
            case 400:
              formControl.setErrors({ exists: true });
              return;
            case 401:
              this.authService.logout(true);
              this.dialogsService.openWarningMessageDialog('Ошибка изменения логина', `Вы должны быть авторизированы для того, чтобы изменить логин учетной записи.`);
              break;
            case 404:
              this.authService.logout(true);
              this.dialogsService.openWarningMessageDialog('Ошибка изменения логина', `Учетная запись не найдена. Возможно, она была удалена.`);
              break;
            case 405:
              this.authService.logout(true);
              this.dialogsService.openBlockReasonDialog(errorResponse.error.blockReason);
              break;
            default:
              this.dialogsService.openWarningMessageDialog('Ошибка изменения логина', 'Что-то пошло не так во время изменения логина. Попытайтесь снова.');
              break;
          }

          dialogRef.close();
        });
    });

    dialogRef.afterClosed().subscribe(() => sub.unsubscribe());
  }

  public changePassword(): void {
    this.dialog.open(ChangeOwnerPasswordDialogComponent, { width: '700px', position: { top: '30vh' } });
  }

  public logout(): void {
    this.authService.logout(true);
  }
}
