import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent {

  private searchTimeout: any;

  public searchString = '';

  @Input() public placeholder = '';
  @Input() public inputTimeout = 600;

  @Output() public changed = new EventEmitter<string>();

  public constructor() {}

  public inputChanged(): void {
    console.log(this.searchString);
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.changed.emit(this.searchString);
    }, this.inputTimeout);
  }

  public clearInput(): void {
    this.searchString = '';
    this.changed.emit('');
  }
}