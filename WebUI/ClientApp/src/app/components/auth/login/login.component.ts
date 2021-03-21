import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Params, Router } from '@angular/router';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';
import { AuthService } from 'src/app/services/auth.service';
import { FieldDialogComponent } from 'src/app/components/dialogs/field-dialog/field-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageDialogComponent, MessageDialogType } from '../../dialogs/message-dialog/message-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnDestroy {

  public matcher = new SubmitErrorStateMatcher();
  public form = new FormGroup({
    login: new FormControl(),
    password: new FormControl(),
    rememberMe: new FormControl()
  });

  public hidePassword = true;
  public inProcess = false;
  public invalid = false;
  public unknownError = false;

  public get login(): AbstractControl {
    return this.form.get('login');
  }

  public get password(): AbstractControl {
    return this.form.get('password');
  }


  public get rememberMe(): AbstractControl {
    return this.form.get('rememberMe');
  }

  public constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService
  ) { }

  public ngOnDestroy(): void {
    this.form.reset();
  }

  public formChanged(): void {
    this.invalid = false;
    this.unknownError = false;
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.inProcess = true;
    this.authService.login({ login: this.login.value, password: this.password.value }, this.rememberMe.value ?? false)
      .subscribe(() => { }, errorResponse => {
        this.inProcess = false;
        if (errorResponse?.status == 401) {
          this.invalid = true;
          return;
        }

        if (errorResponse?.status == 403) {
          let queryParams: Params = { id: errorResponse.error.id, email: errorResponse.error.email };
          this.router.navigate(['emailconfirmation'], { queryParams });

          return;
        }

        this.unknownError = true;
      }, () => {
        this.inProcess = false;
        this.router.navigate(['']);
      });
  }

  public forgotPasswordButtonClicked(): void {
    let dialogRef = this.dialog.open(FieldDialogComponent, {
      width: '550px',
      position: { top: '30vh' },
      data: {
        header: 'Reset password',
        message: `Enter account email and we will send a confirmation email.`,
        inputLabel: 'Account email',
        inputType: 'email',
        formControl: new FormControl('', [Validators.email, Validators.required]),
        inputErrors: [
          { errorCode: 'required', errorMessage: 'Enter account email' },
          { errorCode: 'email', errorMessage: 'Not valid' },
          { errorCode: 'notfound', errorMessage: 'Account with this email was not found' }
        ],
        closeButtonName: 'Cancel',
        submitButtonName: 'Send confirmation'
      }
    });

    let submitSubscription = dialogRef.componentInstance.submitEmitter.subscribe((formControl: FormControl) => {
      if (formControl.invalid) {
        return;
      }

      this.userService.sendPasswordResetConfirmation({ email: formControl.value }).subscribe(() => {}, (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 404) {
          formControl.setErrors({ notfound: true });

          return;
        }

        dialogRef.close();
        this.dialog.open(MessageDialogComponent, {
          width: '500px',
          position: {top: '30vh'},
          data: {
            type: MessageDialogType.Warning,
            header: 'Failed to send confirmation',
            message: 'Something went wrong while sending confirmation. You can try to reset your password again',
            buttonName: 'Close'
          }
        });

      }, () => {
        dialogRef.close();
        this.dialog.open(MessageDialogComponent, {
          width: '500px',
          position: {top: '30vh'},
          data: {
            type: MessageDialogType.Success,
            header: 'Confirmation has sent',
            message: 'Password reset confirmation has sent. Check your email and follow the link to reset account password.',
            buttonName: 'OK'
          }
        });
      });
    });

    dialogRef.afterClosed().subscribe(() => submitSubscription.unsubscribe());
  }
}
