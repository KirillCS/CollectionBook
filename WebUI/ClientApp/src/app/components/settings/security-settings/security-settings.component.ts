import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';
import { UpdatePasswordRequest } from 'src/app/models/requests/user/update-password.request';
import { ServerErrorsService } from 'src/app/services/server-errors.service';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { MessageDialogComponent, MessageDialogType } from 'src/app/components/dialogs/message-dialog/message-dialog.component';
import { AuthService } from 'src/app/services/auth.service';

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
      return 'You must enter new password';
    }

    if (this.newPassword.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }

    if (this.newPassword.hasError('pattern')) {
      return 'Password must contain at least one lowercase english letter, one uppercase english letter and one number';
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
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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
    this.userService.updatePassword(request).subscribe(() => { }, (errorResponse: HttpErrorResponse) => {
      this.inProcess = false;
      if (errorResponse.status == 400) {
        this.serverErrorService.setFormErrors(this.form, errorResponse);

        return;
      }

      if (errorResponse.status == 401) {
        this.authService.logout();
        this.dialog.open(MessageDialogComponent, {
          width: '400px',
          position: { top: '30vh' },
          data: {
            type: MessageDialogType.Warning,
            header: 'Not authenticated',
            message: `You must be authenticated to change account email.`,
            buttonName: 'Close'
          }
        });

        return;
      }

      if (errorResponse.status == 404) {
        this.authService.logout();
        this.dialog.open(MessageDialogComponent, {
          width: '400px',
          position: { top: '30vh' },
          data: {
            type: MessageDialogType.Warning,
            header: 'User not found',
            message: `User was not found. Maybe it was deleted.`,
            buttonName: 'Close'
          }
        });

        return;
      }

      this.dialog.open(MessageDialogComponent, { width: '400px', position: { top: '30vh' } });
    }, () => {
      ngForm.resetForm();
      this.inProcess = false;
      this.snackBar.open('Password was updated', 'OK', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3500 });
    })
  }

  public forgotPasswordButtonClicked() {
    this.inProcess = true;
    this.userService.sendPasswordResetConfirmation({ email: this.email }).subscribe(() => {}, (errorResponse: HttpErrorResponse) => {
      this.inProcess = false;
      if (errorResponse.status == 400) {
        this.dialog.open(MessageDialogComponent, { 
          width: '400px',
          position: {top: '30vh'},
          data: {
            type: MessageDialogType.Warning,
            header: 'Failed to send email',
            message: 'Your account email address has not passed validation. Refresh this page and click this button again.',
            buttonName: 'Close'
          }
        });

        return;
      }

      if (errorResponse.status == 404) {
        this.authService.logout();
        this.dialog.open(MessageDialogComponent, { 
          width: '400px',
          position: {top: '30vh'},
          data: {
            type: MessageDialogType.Warning,
            header: 'User not found',
            message: 'User was not found. Maybe it was deleted.',
            buttonName: 'Close'
          }
        });

        return;
      }

      this.dialog.open(MessageDialogComponent, { 
        width: '400px',
        position: {top: '30vh'},
        data: {
          type: MessageDialogType.Warning,
          header: 'Failed to send email',
          message: 'Something went wrong on the server.',
          buttonName: 'Close'
        }
      });

    }, () => {
      this.inProcess = false;
      this.dialog.open(MessageDialogComponent, { 
        width: '400px',
        position: {top: '30vh'},
        data: {
          type: MessageDialogType.Success,
          header: 'Email has sent',
          message: 'Reset password confirmation has sent to your account email address. Check it and follow the link in it.',
          buttonName: 'OK'
        }
      });
    });
  }
}
