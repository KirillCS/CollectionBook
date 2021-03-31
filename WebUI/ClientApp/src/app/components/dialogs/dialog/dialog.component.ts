import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export class DialogData {

  constructor(
    public header: string,
    public message: string,
    public positiveButtonName: string,
    public negativeButtonName: string
  ) { }
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['../dialogs-icons.scss']
})
export class DialogComponent {

  public constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

}
