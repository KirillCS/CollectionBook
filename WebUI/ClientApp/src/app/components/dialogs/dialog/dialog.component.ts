import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export class DialogData {
  public header = 'Sure?';
  public message = 'Are you sure?';
  public positiveButtonName = 'Yes';
  public negativeButtonName = 'No';
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['../dialogs-icons.scss']
})
export class DialogComponent {

  public constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

}
