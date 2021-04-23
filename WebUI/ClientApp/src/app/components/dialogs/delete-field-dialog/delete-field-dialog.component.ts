import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export class DeleteFieldDialogData {
  public header: string;
  public message: string;
  public label: string;
  public expectedString: string;
  public deleteButtonLabel: string;
}

@Component({
  selector: 'app-delete-field-dialog',
  templateUrl: './delete-field-dialog.component.html'
})
export class DeleteFieldDialogComponent {

  public inputString = '';

  public constructor(@Inject(MAT_DIALOG_DATA) private data: DeleteFieldDialogData) { }

  public get dialogData() : DeleteFieldDialogData {
    return this.data;
  }
  
  public get submitButtonDisabled() : boolean {
    return this.inputString !== this.data.expectedString;
  }
  
  public submit(): void {

  }
}
