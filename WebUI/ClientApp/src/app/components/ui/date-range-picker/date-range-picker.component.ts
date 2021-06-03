import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateRange } from '@angular/material/datepicker';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html'
})
export class DateRangePickerComponent {
  private _rangeForm = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  @Input('label') private _label: string;
  @Output('changed') private _changed = new EventEmitter<DateRange<Date>>();

  public get label(): string {
    return this._label;
  }

  public get rangeForm(): FormGroup {
    return this._rangeForm;
  }

  public get disabledResetButton(): boolean {
    return !this._start && !this._end;
  }

  public dateChangedHandler(): void {
    this._changed.emit(new DateRange(this._start, this._end));
  }

  public resetButtonClickedHandler(): void {
    this.rangeForm.reset();
    this._changed.emit(new DateRange(null, null));
  }

  private get _start(): Date {
    return this.rangeForm.get('start').value;
  }

  private get _end(): Date {
    return this.rangeForm.get('end').value;
  }
}
