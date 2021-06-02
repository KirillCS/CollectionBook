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
  templateUrl: './change-owner-password-dialog.component.html',
  styleUrls: ['./change-owner-password-dialog.component.css']
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
      return 'You must enter new password';
    }

    if (this.newPasswordControl.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }

    if (this.newPasswordControl.hasError('pattern')) {
      return 'Password must contain at least one lowercase english letter, one uppercase english letter and one number';
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
        this.dialogService.openSuccessMessageDialog('Password successfully changed', `Owner password was successfully changed .`);
      },
      (errorResponse: HttpErrorResponse) => {
        this._inProcess = false;
        switch (errorResponse.status) {
          case 400:
            this.serverErrorService.setFormErrors(this.form, errorResponse);
            return;
          case 401:
            this.authService.logout(true);
            this.dialogService.openWarningMessageDialog('Not authenticated', 'You must be authenticated to change owner password.');
            break;
          case 404:
            this.authService.logout(true);
            this.dialogService.openWarningMessageDialog('User not found', `User was not found`);
            break;
          case 405:
            this.authService.logout(true);
            this.dialogService.openBlockReasonDialog(errorResponse.error.blockReason);
            break;
          default:
            this.dialogService.openWarningMessageDialog('Something went wrong', 'Something went wrong while changing the owner password.');
            break;
        }

        this.dialogRef.close();
      });
  }
}
