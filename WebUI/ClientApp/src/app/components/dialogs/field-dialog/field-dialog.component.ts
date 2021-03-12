import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DefaultErrorStateMatcher } from 'src/app/error-state-matchers/default-error-state-mathcer';

@Component({
  selector: 'app-field-dialog',
  templateUrl: './field-dialog.component.html',
  styleUrls: ['./field-dialog.component.scss']
})
export class FieldDialogComponent implements OnInit {
  public matcher = new DefaultErrorStateMatcher();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      header: string,
      message: string,
      inputLabel: string,
      inputType: string,
      formControl: FormControl,
      closeButtonName: string,
      submitButtonName: string
    }
  ) { }

  ngOnInit(): void { }
}
