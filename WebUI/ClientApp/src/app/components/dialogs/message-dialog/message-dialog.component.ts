import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export enum MessageDialogType {
  Info = 0,
  Success = 1,
  Warning = 2
}

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      type: MessageDialogType,
      header: string,
      message: string,
      buttonName: string
    }
  ) { }

  ngOnInit(): void { }
}
