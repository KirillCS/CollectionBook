import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MessageDialogComponent, MessageDialogData, MessageDialogType } from 'src/app/components/dialogs/message-dialog/message-dialog.component';
import { DialogComponent, DialogData } from 'src/app/components/dialogs/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DefaultDialogsService {

  constructor(private dialog: MatDialog) { }

  public openYesNoDialog(header: string, message: string): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, {
      width: '500px',
      position: { top: '30vh' },
      data: new DialogData(header, message, 'Да', 'Нет')
    })
  }

  public openSuccessMessageDialog(header: string, message: string): MatDialogRef<MessageDialogComponent> {
    return this.dialog.open(MessageDialogComponent, {
      width: '500px',
      position: { top: '30vh'},
      data: new MessageDialogData(MessageDialogType.Success, header, message, 'OK')
    });
  }

  public openInfoMessageDialog(header: string, message: string): MatDialogRef<MessageDialogComponent> {
    return this.dialog.open(MessageDialogComponent, {
      width: '500px',
      position: { top: '30vh'},
      data: new MessageDialogData(MessageDialogType.Info, header, message, 'OK')
    });
  }

  public openWarningMessageDialog(header: string, message: string): MatDialogRef<MessageDialogComponent> {
    return this.dialog.open(MessageDialogComponent, {
      width: '500px',
      position: { top: '30vh'},
      data: new MessageDialogData(MessageDialogType.Warning, header, message, 'Закрыть')
    });
  }

  public openBlockReasonDialog(blockReason: string): MatDialogRef<MessageDialogComponent> {
    return this.openWarningMessageDialog('Вы заблокированы', `Ваша учетная запись была заблокирована администрацией портала. Причина:\n"${blockReason}"`);
  }
}
