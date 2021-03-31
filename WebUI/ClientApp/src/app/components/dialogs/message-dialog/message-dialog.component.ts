import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export enum MessageDialogType {
  Info = 0,
  Success = 1,
  Warning = 2
}

export class MessageDialogData {

  constructor(
    public type: MessageDialogType,
    public header: string,
    public message: string,
    public buttonName: string
  ) { }
}

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['../dialogs-icons.scss']
})
export class MessageDialogComponent {

  public get iconName(): string {
    switch (this.data.type) {
      case MessageDialogType.Info:
        return 'info';
      case MessageDialogType.Warning:
        return 'report_gmailerrorred';
      case MessageDialogType.Success:
        return 'done';
      default:
        return '';
    }
  }

  public get className(): string {
    switch (this.data.type) {
      case MessageDialogType.Info:
        return 'info';
      case MessageDialogType.Warning:
        return 'warning';
      case MessageDialogType.Success:
        return 'success';
      default:
        return '';
    }
  }

  public constructor(@Inject(MAT_DIALOG_DATA) public data: MessageDialogData) { }
}
