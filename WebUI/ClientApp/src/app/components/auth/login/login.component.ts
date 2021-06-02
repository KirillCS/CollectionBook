import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Params, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';
import { AuthService } from 'src/app/services/auth.service';
import { FieldDialogComponent } from 'src/app/components/dialogs/field-dialog/field-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { ServerErrorsService } from 'src/app/services/server-errors.service';

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
    private dialogsService: DefaultDialogsService,
    private userService: UserService,
    private previousRouteService: PreviousRouteService,
    private serverErrorsService: ServerErrorsService
  ) { }

  public ngOnDestroy(): void {
    this.form.reset();
  }

  public formChanged(): void {
    this.invalid = false;
    this.unknownError = false;
  }

  public submit(loginForm: NgForm): void {
    if (this.form.invalid) {
      return;
    }

    this.inProcess = true;
    this.authService.login({ login: this.login.value, password: this.password.value }, this.rememberMe.value ?? false)
      .subscribe(
        () => {
          let url = this.previousRouteService.getPreviousUrl();
          this.router.navigateByUrl(url === this.router.url ? '/' : url);
        },
        (errorResponse: HttpErrorResponse) => {
          this.inProcess = false;
          switch (errorResponse.status) {
            case 400:
              this.serverErrorsService.setFormErrors(this.form, errorResponse)
              break;
            case 401:
              this.invalid = true;
              break;
            case 403:
              let queryParams: Params = { id: errorResponse.error.id, email: errorResponse.error.email };
              this.router.navigate(['emailconfirmation'], { queryParams });
              break;
            case 405:
              loginForm.resetForm();
              this.dialogsService.openBlockReasonDialog(errorResponse.error.blockReason);
              break;
            default:
              this.unknownError = true;
              break;
          }
        },
        () => this.inProcess = false);
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

      this.userService.sendPasswordResetConfirmation({ email: formControl.value }).subscribe(
        () => { },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 404) {
            formControl.setErrors({ notfound: true });
            return;
          }

          dialogRef.close();
          this.dialogsService.openWarningMessageDialog('Failed to send confirmation', 'Something went wrong while sending confirmation. You can try to reset your password again');

        }, () => {
          dialogRef.close();
          this.dialogsService.openSuccessMessageDialog('Confirmation has sent', 'Password reset confirmation has sent. Check your email and follow the link to reset account password.');
        });
    });

    dialogRef.afterClosed().subscribe(() => submitSubscription.unsubscribe());
  }
}
