import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { EmailConfirmationService } from 'src/app/services/email-confirmation.service';
import { FieldDialogComponent } from 'src/app/components/dialogs/field-dialog/field-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss', '../email-components.styles.scss']
})
export class EmailConfirmationComponent implements OnInit {
  private _id = '';

  public email = '';
  public sendLinkEnable = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private emailService: EmailConfirmationService,
    private dialogService: DefaultDialogsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this._id = params.get('id');
      this.email = params.get('email');
    })
  }

  public sendEmail(): void {
    if (!this.sendLinkEnable) {
      this.dialogService.openWarningMessageDialog('Message already sent', `Verification email has already sent to ${this.email}. Wait 1 minute to send a new one.`);

      return;
    }

    this.sendLinkEnable = false;
    this.emailService.sendConfirmationMessage(this._id).subscribe(() => {
      this.dialogService.openSuccessMessageDialog('Message was sent', `Verification message was sent to ${this.email}. Check your email and confirm it.`);

    }, (errorResponse: HttpErrorResponse) => {
      this.sendLinkEnable = true;
      if (errorResponse.status == 404) {
        this.router.navigate(['']);
        this.dialogService.openWarningMessageDialog('User not found', 'User was not found. Maybe it was deleted');

        return;
      }

      this.dialogService.openWarningMessageDialog('Failed to send message', `Something went wrong while sending a verification message to ${this.email}: ${errorResponse.message}`);

    }, () => {
      setTimeout(() => {
        this.sendLinkEnable = true;
      }, 60000);
    });
  }

  public changeEmail(): void {
    let dialogRef = this.openChangingEmailDialog();
    let submitSubscription = dialogRef.componentInstance.submitEmitter.subscribe((formControl: FormControl) => {
      if (formControl.invalid) {
        return;
      }

      let newEmail = formControl.value;
      if (newEmail == this.email) {
        formControl.setErrors({ using: true });

        return;
      }

      this.emailService.changeUnconfirmedEmail({ id: this._id, email: newEmail }).subscribe(() => {
        this.email = newEmail;
        dialogRef.close();
        this.dialogService.openSuccessMessageDialog('Email updated successfully', `Account email changed to ${this.email}. Verification message has sent. Check email and confirm it.`);

      }, errorResponse => {
        if (errorResponse.status == 400) {
          formControl.setErrors({ exists: true });

          return;
        }

        dialogRef.close();
        if (errorResponse.status == 404) {
          this.router.navigate(['']);
          this.dialogService.openWarningMessageDialog('User not found', 'User was not found. Maybe it was deleted');

          return;
        }

        this.dialogService.openWarningMessageDialog('Failed to update email', `Something went wrong: ${errorResponse.message}`);
      });
    });

    dialogRef.afterClosed().subscribe(() => submitSubscription.unsubscribe());
  }

  private openChangingEmailDialog(): MatDialogRef<FieldDialogComponent, any> {
    return this.dialog.open(FieldDialogComponent, {
      width: '550px',
      position: { top: '30vh' },
      data: {
        header: 'Changing email',
        message: `Enter a new email (current email: ${this.email})`,
        inputLabel: 'New email',
        inputType: 'email',
        formControl: new FormControl('', [Validators.email, Validators.required]),
        inputErrors: [
          { errorCode: 'required', errorMessage: 'Email is a required field' },
          { errorCode: 'email', errorMessage: 'Not valid' },
          { errorCode: 'using', errorMessage: 'You are already using this email' },
          { errorCode: 'exists', errorMessage: 'This email is already taken' }
        ],
        closeButtonName: 'Cancel',
        submitButtonName: 'Save'
      }
    });
  }
}
