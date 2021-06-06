import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';
import { UpdatePasswordRequest } from 'src/app/models/requests/user/update-password.request';
import { AuthService } from 'src/app/services/auth.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { ServerErrorsService } from 'src/app/services/server-errors.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-owner-password-dialog',
  templateUrl: './change-owner-password-dialog.component.html'
})
export class ChangeOwnerPasswordDialogComponent {

  private _matcher = new SubmitErrorStateMatcher();
  private _form = new FormGroup({
    currentPassword: new FormControl(),
    newPassword: new FormControl(),
    passwordConfirmation: new FormControl()
  });

  private _inProcess = false;

  public hideCurrentPassword = true;
  public hideNewPassword = true;
  public hidePasswordConfirmation = true;

  public constructor(
    private userService: UserService,
    private serverErrorService: ServerErrorsService,
    private authService: AuthService,
    private dialogService: DefaultDialogsService,
    private dialogRef: MatDialogRef<ChangeOwnerPasswordDialogComponent>
  ) { }

  public get newPasswordErrorMessage(): string {
    if (this.newPasswordControl.hasError('required')) {
      return 'Введите новый пароль';
    }

    if (this.newPasswordControl.hasError('minlength')) {
      return 'Пароль должен содержать не менее 6 символов';
    }

    if (this.newPasswordControl.hasError('pattern')) {
      return 'Пароль должен содержать как минимум одну английскую букву в нижнем регистре, одну - в верхнем и одну цифру';
    }

    return '';
  }

  public get matcher(): SubmitErrorStateMatcher {
    return this._matcher;
  }

  public get form(): FormGroup {
    return this._form;
  }

  public get currentPasswordControl(): AbstractControl {
    return this.form.get('currentPassword');
  }

  public get newPasswordControl(): AbstractControl {
    return this.form.get('newPassword');
  }

  public get passwordConfirmationControl(): AbstractControl {
    return this.form.get('passwordConfirmation');
  }

  public get inProcess(): boolean {
    return this._inProcess;
  }

  public change(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.newPasswordControl.value != this.passwordConfirmationControl.value) {
      this.passwordConfirmationControl.setErrors({ mismatch: true });
      return;
    }

    this._inProcess = true;
    let request: UpdatePasswordRequest = {
      currentPassword: this.currentPasswordControl.value,
      newPassword: this.newPasswordControl.value,
      passwordConfirmation: this.passwordConfirmationControl.value
    };
    this.userService.updatePassword(request).subscribe(
      () => {
        this.dialogRef.close();
        this.dialogService.openSuccessMessageDialog('Пароль изменен', `Пароль был успешно изменен.`);
      },
      (errorResponse: HttpErrorResponse) => {
        this._inProcess = false;
        switch (errorResponse.status) {
          case 400:
            this.serverErrorService.setFormErrors(this.form, errorResponse);
            return;
          case 401:
            this.authService.logout(true);
            this.dialogService.openWarningMessageDialog('Ошибка изменения пароля', 'Вы должны быть авторизированы для того, чтобы изменить пароль учетной записи.');
            break;
          case 404:
            this.authService.logout(true);
            this.dialogService.openWarningMessageDialog('Ошибка изменения пароля', `Учетная запись не найдена. Возможно, она была удалена.`);
            break;
          case 405:
            this.authService.logout(true);
            this.dialogService.openBlockReasonDialog(errorResponse.error.blockReason);
            break;
          default:
            this.dialogService.openWarningMessageDialog('Ошибка изменения пароля', 'Что-то пошло не так во время изменения пароля. Попытайтесь снова..');
            break;
        }

        this.dialogRef.close();
      });
  }
}
