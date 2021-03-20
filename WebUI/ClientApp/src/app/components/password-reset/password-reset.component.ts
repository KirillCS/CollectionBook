import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';
import { ResetPasswordRequest } from 'src/app/models/requests/user/reset-password.request';
import { ServerErrorsService } from 'src/app/services/server-errors.service';
import { UserService } from 'src/app/services/user.service';
import { MessageDialogComponent, MessageDialogType } from '../dialogs/message-dialog/message-dialog.component';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  private id: string;
  private token: string;

  public form = new FormGroup({
    password: new FormControl(),
    passwordConfirmation: new FormControl()
  });
  public matcher = new SubmitErrorStateMatcher();

  public hidePassword = true;
  public hidePasswordConfirmation = true;

  public inProcess = false;

  public get password(): AbstractControl {
    return this.form.get('password');
  }

  public get passwordConfirmation(): AbstractControl {
    return this.form.get("passwordConfirmation");
  }


  public get passwordErrorMessage(): string {
    if (this.password.hasError('required')) {
      return 'Password is a required field';
    }

    if (this.password.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }

    if (this.password.hasError('pattern')) {
      return 'Password must contain at least one lowercase english letter, one uppercase english letter and one number';
    }

    return '';
  }


  public get passwordConfirmationErrorMessage(): string {
    if (this.passwordConfirmation.hasError('required')) {
      return 'Confirm password';
    }

    if (this.passwordConfirmation.hasError('mismatch')) {
      return 'Password mismatch';
    }

    return '';
  }


  public constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private serverErrorsService: ServerErrorsService,
    private dialog: MatDialog
  ) { }

  public ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.id = params.get('id');
      this.token = params.get('token');
    })
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.passwordConfirmation.value != this.password.value) {
      this.passwordConfirmation.setErrors({ mismatch: true });

      return;
    }

    this.inProcess = true;
    let request: ResetPasswordRequest = {
      id: this.id,
      token: this.token,
      password: this.password.value,
      passwordConfirmation: this.passwordConfirmation.value
    }
    this.userService.resetPassword(request).subscribe(() => { }, (errorResponse: HttpErrorResponse) => {
      this.inProcess = false;
      if (errorResponse.status == 400) {
        this.serverErrorsService.setFormErrors(this.form, errorResponse);

        return;
      }

      if (errorResponse.status == 404) {
        this.router.navigate(['']);
        this.dialog.open(MessageDialogComponent, {
          width: '400px',
          position: {top: '30vh'},
          data: {
            type: MessageDialogType.Warning,
            header: 'Failed to reset password',
            message: 'User was not found. Maybe link was broken or user was deleted.',
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
          header: 'Failed to reset password',
          message: 'Token is invalid.',
          buttonName: 'Close'
        }
      });

    }, () => {
      this.router.navigate(['']);
      this.dialog.open(MessageDialogComponent, {
        width: '400px',
        position: {top: '30vh'},
        data: {
          type: MessageDialogType.Success,
          header: 'Password reset successfully',
          message: 'Password has reseted successfully',
          buttonName: 'OK'
        }
      });
    })
  }
}
