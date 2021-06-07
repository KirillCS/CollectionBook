import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';
import { UpdatePasswordRequest } from 'src/app/models/requests/user/update-password.request';
import { ServerErrorsService } from 'src/app/services/server-errors.service';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html'
})
export class SecuritySettingsComponent implements OnInit {

  private email: string;

  public matcher = new SubmitErrorStateMatcher();
  public form = new FormGroup({
    currentPassword: new FormControl(),
    newPassword: new FormControl(),
    passwordConfirmation: new FormControl()
  });

  public hideCurrentPassword = true;
  public hideNewPassword = true;
  public hidePasswordConfirmation = true;

  public inProcess = false;

  public get newPasswordErrorMessage(): string {
    if (this.newPassword.hasError('required')) {
      return 'Введите новый пароль';
    }

    if (this.newPassword.hasError('minlength')) {
      return 'Пароль должен содержать не менее 6 символов';
    }

    if (this.newPassword.hasError('pattern')) {
      return 'Пароль должен содержать как минимум одну английскую букву в нижнем регистре, одну - в верхнем и одну цифру';
    }

    return '';
  }

  public get currentPassword(): AbstractControl {
    return this.form.get('currentPassword');
  }

  public get newPassword(): AbstractControl {
    return this.form.get('newPassword');
  }

  public get passwordConfirmation(): AbstractControl {
    return this.form.get('passwordConfirmation');
  }

  public constructor(
    private settingsService: SettingsService,
    private userService: UserService,
    private serverErrorService: ServerErrorsService,
    private authService: AuthService,
    private dialogService: DefaultDialogsService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.settingsService.user$.subscribe(user => {
      this.email = user.email;
    })
  }

  public ngOnInit(): void {
    this.settingsService.updateFromServer();
  }

  public submit(ngForm: NgForm): void {
    if (this.form.invalid) {
      return;
    }

    if (this.newPassword.value != this.passwordConfirmation.value) {
      this.passwordConfirmation.setErrors({ mismatch: true });

      return;
    }

    this.inProcess = true;
    let request: UpdatePasswordRequest = {
      currentPassword: this.currentPassword.value,
      newPassword: this.newPassword.value,
      passwordConfirmation: this.passwordConfirmation.value
    };
    this.userService.updatePassword(request).subscribe(
      () => { },
      (errorResponse: HttpErrorResponse) => {
        this.inProcess = false;
        switch (errorResponse.status) {
          case 400:
            this.serverErrorService.setFormErrors(this.form, errorResponse);
            break;
          case 401:
            this.authService.logout(true);
            this.dialogService.openWarningMessageDialog('Ошибка изменения пароля', 'В ходе изменения пароля произошла ошибка: вы не авторизованы.');
            break;
          case 404:
            this.authService.logout(true);
            this.dialogService.openWarningMessageDialog('Ошибка изменения пароля', `В ходе изменения пароля произошла ошибка: ваша учетная запись не найдена.`);
            break;
          case 405:
            this.authService.logout(true);
            this.dialogService.openBlockReasonDialog(errorResponse.error.blockReason);
            break;
          default:
            this.dialogService.openWarningMessageDialog('Ошибка изменения пароля', 'В ходе изменения пароля произошла неизвестная ошибка.');
            break;
        }
      },
      () => {
        ngForm.resetForm();
        this.inProcess = false;
        this.snackBar.open('Пароль успешно изменен', 'OK', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3500 });
      })
  }

  public forgotPasswordButtonClicked() {
    this.inProcess = true;
    this.userService.sendPasswordResetConfirmation({ email: this.email }).subscribe(() => { }, (errorResponse: HttpErrorResponse) => {
      this.inProcess = false;
      switch (errorResponse.status) {
        case 400:
          this.dialogService.openWarningMessageDialog('Ошибка отправки письма', 'В ходе отправки электронного письма произошла ошибка: адрес электронной почты вашей учетной записи не прошел валидацию. Обновите страницу и попробуйтеснова.');
          break;
        case 404:
          this.authService.logout(true);
          this.dialogService.openWarningMessageDialog('Ошибка отправки письма', `В ходе отправки электронного письма произошла ошибка: пользователь не найден.`);
          break;
        default:
          this.dialogService.openWarningMessageDialog('Ошибка отправки письма', 'В ходе отправки электронного письма произошла неизвестная ошибка.');
          break;
      }
    }, () => {
      this.inProcess = false;
      this.dialogService.openSuccessMessageDialog('Письмо отправлено', 'Электронное письмо для сброса пароля отправлено на почту, прикрепленную к вашей учетной записи.');
    });
  }
}
