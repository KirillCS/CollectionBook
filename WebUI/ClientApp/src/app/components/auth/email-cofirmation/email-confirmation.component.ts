import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { EmailConfirmationService } from 'src/app/services/email-confirmation.service';
import { MessageDialogComponent, MessageDialogType } from 'src/app/components/dialogs/message-dialog/message-dialog.component';
import { FieldDialogComponent } from 'src/app/components/dialogs/field-dialog/field-dialog.component';
import { FormControl, Validators } from '@angular/forms';

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
      this.dialog.open(MessageDialogComponent, {
        width: '500px',
        position: { top: '30vh' },
        data: {
          type: MessageDialogType.Warning,
          header: 'You\'ve already sent a message',
          message: `Confirmation message already was sent to the email ${this.email}. Wait 1 minute to send a new one.`,
          buttonName: 'Close'
        }
      });

      return;
    }

    this.sendLinkEnable = false;
    this.emailService.sendConfirmationMessage(this._id).subscribe(() => {
      this.dialog.open(MessageDialogComponent, {
        width: '500px',
        position: { top: '30vh' },
        data: {
          type: MessageDialogType.Success,
          header: 'Message was sent',
          message: `Message was sent to the email ${this.email}. Check your email and confirm it.`,
          buttonName: 'OK'
        }
      });
    }, error => {
      this.dialog.open(MessageDialogComponent, {
        width: '500px',
        position: { top: '30vh' },
        data: {
          type: MessageDialogType.Warning,
          header: 'Error sending confirmation',
          message: `Something went wrong while sending a confirmation email ${this.email}: ${error.message}`,
          buttonName: 'OK'
        }
      });
      this.sendLinkEnable = true;
    }, () => {
      setTimeout(() => {
        this.sendLinkEnable = true;
      }, 60000);
    });
  }

  public changeEmail(): void {
    let dialogRef = this.dialog.open(FieldDialogComponent, {
      width: '450px',
      position: { top: '30vh' },
      data: {
        header: 'Changing email',
        message: `Enter a new email (current email: ${this.email})`,
        inputLabel: 'New email',
        inputType: 'email',
        formControl: new FormControl('', [Validators.email, Validators.required]),
        closeButtonName: 'Cancel',
        submitButtonName: 'Save'
      }
    });

    dialogRef.afterClosed().subscribe((newEmail: string) => {
      console.log(newEmail);

      if (!newEmail) {
        return;
      }

      if (newEmail == this.email) {
        this.dialog.open(MessageDialogComponent, {
          width: '500px',
          position: { top: '30vh' },
          data: {
            type: MessageDialogType.Warning,
            header: 'Failed to update email',
            message: `Your new email address is the same as your old one`,
            buttonName: 'Close'
          }
        });

        return;
      }

      this.emailService.updateEmail(this._id, newEmail).subscribe(response => {
        this.email = response.newEmail;
        this.dialog.open(MessageDialogComponent, {
          width: '500px',
          position: { top: '30vh' },
          data: {
            type: MessageDialogType.Success,
            header: 'Email update completed successfully',
            message: `Your email changed to ${response.newEmail} and we've sent to it email confrimation. Check email and confirm it`,
            buttonName: 'OK'
          }
        });
      }, error => {
        console.log(error);

        if (error.status == 400) {
          this.dialog.open(MessageDialogComponent, {
            width: '500px',
            position: { top: '30vh' },
            data: {
              type: MessageDialogType.Warning,
              header: 'Failed to update email',
              message: `User with email ${newEmail} already exists`,
              buttonName: 'Close'
            }
          });

          return;
        }

        if (error.status == 404) {
          this.dialog.open(MessageDialogComponent, {
            width: '500px',
            position: { top: '30vh' },
            data: {
              type: MessageDialogType.Warning,
              header: 'Failed to update email',
              message: 'User with your id was not found. Update page',
              buttonName: 'Close'
            }
          });

          return;
        }

        this.dialog.open(MessageDialogComponent, {
          width: '500px',
          position: { top: '30vh' },
          data: {
            type: MessageDialogType.Warning,
            header: 'Failed to update email',
            message: `Something went wrong: ${error.message}`,
            buttonName: 'Close'
          }
        });
      })
    })
  }
}
