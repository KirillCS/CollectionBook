import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { EmailConfirmationService } from 'src/app/services/email-confirmation.service';
import { MessageDialogComponent, MessageDialogType } from 'src/app/components/dialogs/message-dialog/message-dialog.component';
import { FieldDialogComponent } from 'src/app/components/dialogs/field-dialog/field-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {
  private _id = '';

  public email = '';
  public sendLinkEnable = true;

  constructor(private route: ActivatedRoute, private emailService: EmailConfirmationService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this._id = params.get('id');
      this.email = params.get('email');
    })
  }

  public sendEmail(): void {
    if (!this.sendLinkEnable) {
      this.openSendingEmailDisabledDialog();

      return;
    }

    this.sendLinkEnable = false;
    this.emailService.sendConfirmationMessage(this._id).subscribe(() => {
      this.openMessageWasSentDialog();
    }, errorResponse => {
      this.openErrorSendingMessageDialog(`Something went wrong while sending a confirmation email ${this.email}: ${errorResponse.message}`);
      this.sendLinkEnable = true;
    }, () => {
      setTimeout(() => {
        this.sendLinkEnable = true;
      }, 60000);
    });
  }

  public changeEmail(): void {
    let dialogRef = this.openChangingEmailDialog();
    let submitSubscription = this.subscribeToSubmitEmitter(dialogRef);
    dialogRef.afterClosed().subscribe(() => submitSubscription.unsubscribe())
  }

  private openMessageWasSentDialog(): MatDialogRef<MessageDialogComponent, any> {
    return this.dialog.open(MessageDialogComponent, {
      width: '500px',
      position: { top: '30vh' },
      data: {
        type: MessageDialogType.Success,
        header: 'Message was sent',
        message: `Message was sent to the email ${this.email}. Check your email and confirm it.`,
        buttonName: 'OK'
      }
    });
  }

  private openSendingEmailDisabledDialog(): MatDialogRef<MessageDialogComponent, any> {
    return this.dialog.open(MessageDialogComponent, {
      width: '500px',
      position: { top: '30vh' },
      data: {
        type: MessageDialogType.Warning,
        header: 'You\'ve already sent a message',
        message: `Confirmation message already was sent to the email ${this.email}. Wait 1 minute to send a new one.`,
        buttonName: 'Close'
      }
    });
  }

  private openErrorSendingMessageDialog(message: string): MatDialogRef<MessageDialogComponent, any> {
    return this.dialog.open(MessageDialogComponent, {
      width: '500px',
      position: { top: '30vh' },
      data: {
        type: MessageDialogType.Warning,
        header: 'Error sending confirmation',
        message: message,
        buttonName: 'OK'
      }
    });
  }

  private openChangingEmailDialog(): MatDialogRef<FieldDialogComponent, any> {
    return this.dialog.open(FieldDialogComponent, {
      width: '450px',
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

  private subscribeToSubmitEmitter(dialogRef: MatDialogRef<FieldDialogComponent, any>): Subscription {
    return dialogRef.componentInstance.submitEmitter.subscribe((formControl: FormControl) => {
      if (formControl.invalid) {
        return;
      }

      let newEmail = formControl.value;
      if (newEmail == this.email) {
        formControl.setErrors({ using: true });

        return;
      }

      this.emailService.updateEmail({ id: this._id, email: newEmail }).subscribe(response => {
        this.email = response.newEmail;
        dialogRef.close();
        this.openUpdatingEmailSuccessDialog();

      }, errorResponse => {
        if (errorResponse.status == 400) {
          formControl.setErrors({ exists: true });

          return;
        }

        dialogRef.close();
        if (errorResponse.status == 404) {
          this.openUpdatingEmailFailedDialog('User with your id was not found. Update the page');

          return;
        }

        this.openUpdatingEmailFailedDialog(`Something went wrong: ${errorResponse.message}`);
      });
    });
  }

  private openUpdatingEmailSuccessDialog(): MatDialogRef<MessageDialogComponent, any> {
    return this.dialog.open(MessageDialogComponent, {
      width: '500px',
      position: { top: '30vh' },
      data: {
        type: MessageDialogType.Success,
        header: 'Email update completed successfully',
        message: `Your email changed to ${this.email} and we've sent to it email confrimation. Check email and confirm it`,
        buttonName: 'OK'
      }
    });
  }

  private openUpdatingEmailFailedDialog(message: string): MatDialogRef<MessageDialogComponent, any> {
    return this.dialog.open(MessageDialogComponent, {
      width: '500px',
      position: { top: '30vh' },
      data: {
        type: MessageDialogType.Warning,
        header: 'Failed to update email',
        message: message,
        buttonName: 'Close'
      }
    });
  }
}
