import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher'
import { UserDto } from 'src/app/models/dtos/user.dto';
import { AuthTokenService } from 'src/app/services/auth-token.service';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from 'src/app/components/dialogs/dialog/dialog.component';
import { ServerErrorsService } from 'src/app/services/server-errors.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageDialogComponent, MessageDialogType } from 'src/app/components/dialogs/message-dialog/message-dialog.component';
import { EmailConfirmationService } from 'src/app/services/email-confirmation.service';
import { LoginResponse } from 'src/app/models/responses/auth/login.response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';

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
    private dialog: MatDialog
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

    const dialogRef = this.dialogService.openYesNoDialog('Are you sure?', `Are you sure you want to change login from ${this.user.login} to ${control.value}? Links to your profile will be broken.`);

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result == 'No') {
        return;
      }

      this.isChangingLoginInProcess = true;
      this.userService.updateLogin({ login: control.value }).subscribe((response: LoginResponse) => {
        this.authTokenService.setToken(response.accessToken);
        this.user.login = control.value;
        this.settingsService.update(this.user);

      }, (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 400) {
          this.serverErrorService.setFormErrors(this.loginForm, errorResponse);
          this.isChangingLoginInProcess = false;

          return;
        }

        if (errorResponse.status == 401) {
          this.authService.logout();
          this.dialogService.openWarningMessageDialog('Not authenticated', `You must be authenticated to change account login.`);
          
          return;
        }
        
        if (errorResponse.status == 404) {
          this.authService.logout();
          this.dialogService.openWarningMessageDialog('User not found', `User was not found. Maybe it was deleted.`);
          
          return;
        }
        
        this.dialogService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server. Maybe page updating will be able to help.');
        this.isChangingLoginInProcess = false;
      }, () => {
        form.resetForm();
        this.isChangingLoginInProcess = false;
        this.snackBar.open('Login was updated', 'OK', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3500 });
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
    this.emailService.updateEmail({ email: control.value }).subscribe(() => {
      this.dialogService.openInfoMessageDialog('Confirm email', `We've sent confirmation message to email address ${control.value}. You must confirm it to update account email.`);
    }, (errorResponse: HttpErrorResponse) => {
      this.isChangingEmailInProcess = false;
      if (errorResponse.status == 400) {
        this.serverErrorService.setFormErrors(this.emailForm, errorResponse);

        return;
      }

      if (errorResponse.status == 401) {
        this.authService.logout();
        this.dialogService.openWarningMessageDialog('Not authenticated', `You must be authenticated to change account email.`);

        return;
      }

      if (errorResponse.status == 404) {
        this.authService.logout();
        this.dialogService.openWarningMessageDialog('User not found', `User was not found. Maybe it was deleted.`);
        
        return;
      }
      
      this.dialogService.openWarningMessageDialog('Something went wrong', `Something went wrong while updating email.`);
    }, () => {
      form.reset();
      this.isChangingEmailInProcess = false;
    });
  }
}
