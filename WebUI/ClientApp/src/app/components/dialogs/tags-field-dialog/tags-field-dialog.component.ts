import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export class TagsFieldDialogData {
  public header: string;
  public message: string;
  public inputLabel: string;
  public tags: string[];
  public closeButtonName: string;
  public submitButtonName: string;
}

@Component({
  selector: 'app-tags-field-dialog',
  templateUrl: './tags-field-dialog.component.html'
})
export class TagsFieldDialogComponent {

  @Output() public submitEmitter = new EventEmitter<string[]>();

  constructor(@Inject(MAT_DIALOG_DATA) private data: TagsFieldDialogData) {
    if (data.tags == null) {
      data.tags = new Array<string>();
    }
  }

  public get dialogData() : TagsFieldDialogData {
    return this.data;
  }

  public submit(): void {
    this.submitEmitter.emit(this.data.tags);
  }
}
