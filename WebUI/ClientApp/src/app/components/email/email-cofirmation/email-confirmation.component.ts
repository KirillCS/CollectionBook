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
  styleUrls: ['../email-components.styles.scss']
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
      this.dialogService.openWarningMessageDialog('Письмо уже отправлено', `Верификационное письмо уже отправлено на почту ${this.email}. Подождите минуту для отправки повторного письма.`);
      return;
    }

    this.sendLinkEnable = false;
    this.emailService.sendConfirmationMessage(this._id).subscribe(() => {
      this.dialogService.openSuccessMessageDialog('Письмо отправлено', `Верификационное письмо успешно отправлено на адрес ${this.email}.`);

    }, (errorResponse: HttpErrorResponse) => {
      this.sendLinkEnable = true;
      if (errorResponse.status == 404) {
        this.router.navigate(['']);
        this.dialogService.openWarningMessageDialog('Ошибка отправки письма', `При отправки верификационного письма произошла ошибка: пользователь не найден.`);

        return;
      }

      this.dialogService.openWarningMessageDialog('Ошибка отправки письма', `Что-то пошло не так при отправки письма на почту ${this.email}: ${errorResponse.message}`);

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
        this.dialogService.openSuccessMessageDialog('Почта обновлена', `Адрес электронной почты успешно обновлен на ${this.email}. Верификационной письмо уже отправлено на данную почту.`);

      }, errorResponse => {
        if (errorResponse.status == 400) {
          formControl.setErrors({ exists: true });

          return;
        }

        dialogRef.close();
        if (errorResponse.status == 404) {
          this.router.navigate(['']);
          this.dialogService.openWarningMessageDialog('Ошибка обновления почты', `При изменении адреса электронной почты учетной записи произошла ошибка: пользователь не найден.`);

          return;
        }

        this.dialogService.openWarningMessageDialog('Ошибка обновления почты', `При изменении адреса электронной почты учетной записи произошла ошибка: ${errorResponse.message}.`);
      });
    });

    dialogRef.afterClosed().subscribe(() => submitSubscription.unsubscribe());
  }

  private openChangingEmailDialog(): MatDialogRef<FieldDialogComponent, any> {
    return this.dialog.open(FieldDialogComponent, {
      width: '550px',
      position: { top: '30vh' },
      data: {
        header: 'Изменение адреса электронной почты',
        message: `Введите другой адрес электронной почты и нажмите кнопку "Сохранить" (текущий адрес: ${this.email})`,
        inputLabel: 'Новый адрес',
        inputType: 'email',
        formControl: new FormControl('', [Validators.email, Validators.required]),
        inputErrors: [
          { errorCode: 'required', errorMessage: 'Введите адрес электронной почты' },
          { errorCode: 'email', errorMessage: 'Введенный адрес электронной почты не валиден' },
          { errorCode: 'using', errorMessage: 'Данный адрес совпадает с используемым' },
          { errorCode: 'exists', errorMessage: 'Данный адрес уже используется' }
        ],
        closeButtonName: 'Отмена',
        submitButtonName: 'Сохранить'
      }
    });
  }
}
