import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';

@Component({
  selector: 'app-field-dialog',
  templateUrl: './field-dialog.component.html',
  styleUrls: ['./field-dialog.component.scss']
})
export class FieldDialogComponent {
  @Output() public submitEmitter = new EventEmitter<FormControl>();
  public matcher = new SubmitErrorStateMatcher();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      header: string,
      message: string,
      inputLabel: string,
      inputType: string,
      formControl: FormControl,
      inputErrors: { errorCode: string, errorMessage: string }[],
      closeButtonName: string,
      submitButtonName: string
    }
  ) { }

  public submit(): void {
    this.submitEmitter.emit(this.data.formControl);
  }
}
