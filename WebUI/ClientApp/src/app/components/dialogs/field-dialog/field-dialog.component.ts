import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';

export class FieldDialogData {
  public header: string;
  public message: string;
  public inputLabel: string;
  public inputType: string;
  public formControl: FormControl;
  public inputErrors: { errorCode: string, errorMessage: string }[];
  public closeButtonName: string;
  public submitButtonName: string;
}

@Component({
  selector: 'app-field-dialog',
  templateUrl: './field-dialog.component.html',
  styleUrls: ['../dialogs-icons.scss']
})
export class FieldDialogComponent {

  private matcher = new SubmitErrorStateMatcher();

  @Output() public submitEmitter = new EventEmitter<FormControl>();

  constructor(@Inject(MAT_DIALOG_DATA) private data: FieldDialogData) { }

  public get dialogData() : FieldDialogData {
    return this.data;
  }
  
  public get stateMatcher() : ErrorStateMatcher {
    return this.matcher;
  }
  
  public submit(): void {
    this.submitEmitter.emit(this.data.formControl);
  }
}
