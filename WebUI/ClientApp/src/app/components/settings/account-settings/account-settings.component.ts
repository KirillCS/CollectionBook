import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher'
import { UserDto } from 'src/app/models/dtos/user/user.dto';
import { AuthTokenService, TokenSettingType } from 'src/app/services/auth-token.service';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { ServerErrorsService } from 'src/app/services/server-errors.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmailConfirmationService } from 'src/app/services/email-confirmation.service';
import { LoginResponse } from 'src/app/models/responses/auth/login.response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html'
})
export class AccountSettingsComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  public loginForm = new FormGroup({ login: new FormControl() });
  public emailForm = new FormGroup({ email: new FormControl('', Validators.email) });
  public matcher = new SubmitErrorStateMatcher();

  public user: UserDto;

  public isChangingLoginInProcess = false;
  public isChangingEmailInProcess = false;

  constructor(
    private settingsService: SettingsService,
    private userService: UserService,
    private authTokenService: AuthTokenService,
    private serverErrorService: ServerErrorsService,
    private emailService: EmailConfirmationService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogService: DefaultDialogsService,
    private router: Router
  ) {
    this.subscription = settingsService.user$.subscribe(user => {
      this.user = user;
    })
  }

  ngOnInit(): void {
    this.settingsService.updateFromServer();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public loginSubmit(form: NgForm): void {
    if (this.loginForm.invalid) {
      return;
    }

    let control = this.loginForm.get('login');
    if (control.value == this.user.login) {
      control.setErrors({ using: true });

      return;
    }

    const dialogRef = this.dialogService.openYesNoDialog('Изменить логин?', `Вы уверены, что хотите изменить логин? Существующие ссылки на ваш профиль перестанут работать.`);

    dialogRef.afterClosed().subscribe((yes: boolean) => {
      if (!yes) {
        return;
      }

      this.isChangingLoginInProcess = true;
      this.userService.updateLogin({ login: control.value }).subscribe(
        (response: LoginResponse) => {
          this.authTokenService.setToken(response.accessToken);
          this.user.login = control.value;
          this.settingsService.update(this.user);
        },
        (errorResponse: HttpErrorResponse) => {
          this.isChangingLoginInProcess = false;
          switch (errorResponse.status) {
            case 400:
              this.serverErrorService.setFormErrors(this.loginForm, errorResponse);
              break;
            case 401:
              this.authService.logout(true);
              this.dialogService.openWarningMessageDialog('Ошибка изменения логина', `В ходе изменения логина произошла ошибка: вы не авторизованы.`);
              break;
            case 404:
              this.authService.logout(true);
              this.dialogService.openWarningMessageDialog('Ошибка изменения логина', `В ходе изменения логина произошла ошибка: ваша учетная запись не найдена.`);
              break;
            case 405:
              this.authService.logout(true);
              this.dialogService.openBlockReasonDialog(errorResponse.error.blockReason);
              break;
            default:
              this.dialogService.openWarningMessageDialog('Ошибка изменения логина', 'В ходе изменения логина произошла неизвестная ошибка.');
              break;
          }
        },
        () => {
          form.resetForm();
          this.isChangingLoginInProcess = false;
          this.snackBar.open('Логин успешно изменен', 'OK', { horizontalPosition: 'left', verticalPosition: 'bottom', duration: 3500 });
        });
    });
  }

  public emailSubmit(form: NgForm): void {
    if (this.emailForm.invalid) {
      return;
    }

    let control = this.emailForm.get('email');
    if (control.value == this.user.email) {
      control.setErrors({ using: true });

      return;
    }

    this.isChangingEmailInProcess = true;
    this.emailService.updateEmail({ email: control.value }).subscribe(
      () => {
        this.dialogService.openInfoMessageDialog('Подтвердите почту', `На почту ${control.value} было отправлено верификационное письмо. Перейдите по ссылке в нем для завершения изменения адреса электронной почты учетной записи.`);
      },
      (errorResponse: HttpErrorResponse) => {
        this.isChangingEmailInProcess = false;
        switch (errorResponse.status) {
          case 400:
            this.serverErrorService.setFormErrors(this.emailForm, errorResponse);
            break;
          case 401:
            this.authService.logout(true);
            this.dialogService.openWarningMessageDialog('Ошибка изменения почты', `В ходе изменения адреса электронной почты произошла ошибка: вы не авторизованы.`);
            break;
          case 404:
            this.authService.logout();
            this.router.navigateByUrl('/');
            this.dialogService.openWarningMessageDialog('Ошибка изменения почты', `В ходе изменения адреса электронной почты произошла ошибка: ваша учетная запись не найдена.`);
            break;
          case 403:
            let updatedToken = errorResponse.error.accessToken;
            let tokenSettingType = this.authTokenService.isConstant;
            if (updatedToken && tokenSettingType !== TokenSettingType.NotSet) {
              this.authTokenService.setToken(updatedToken, tokenSettingType == TokenSettingType.Constant);
            }

            this.router.navigateByUrl('/');
            this.dialogService.openWarningMessageDialog('Ошибка изменения почты', 'В ходе изменения адреса электронной почты произошла ошибка: роль вашей учетной записи не позволяет выполнить данную операцию.');
            break;
          case 405:
            this.authService.logout(true);
            this.dialogService.openBlockReasonDialog(errorResponse.error.blockReason);
            break;
          default:
            this.dialogService.openWarningMessageDialog('Ошибка изменения почты', `В ходе изменения адреса электронной почты произошла неизвестная ошибка.`);
            break;
        }
      },
      () => {
        form.reset();
        this.isChangingEmailInProcess = false;
      });
  }
}
