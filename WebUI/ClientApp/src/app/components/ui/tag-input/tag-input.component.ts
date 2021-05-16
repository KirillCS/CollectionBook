import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';

import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html'
})
export class TagInputComponent {

  private _separatorKeysCodes = [ENTER, SPACE];
  private _filteredTags: Observable<string[]>;

  @Input() public label = '';
  @Input() public placeholder = 'Ex. coins';
  @Input() public searchTagsCount = 5;
  @Input() public tags: string[] = []

  @Output() public changed = new EventEmitter<string[]>();

  @ViewChild('tagInput') public tagInput: ElementRef<HTMLInputElement>;
  
  constructor(private tagsService: TagsService) { }

  public get separatorKeysCodes() : number[] {
    return this._separatorKeysCodes
  }
  
  public get filteredTags() : Observable<string[]> {
    return this._filteredTags;
  }
  
  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const values = event.value.split(/[ ,]/);

    values.forEach(value => {
      if ((value || '').trim() && !this.tags.some(tag => tag === value)) {
        this.tags.push(value.trim());
      }
    })

    if (input) {
      input.value = '';
    }

    this.changedEventEmit();
  }

  public remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }

    this.changedEventEmit();
  }

  public inputChanged(): void {
    let value = this.tagInput.nativeElement.value;
    this._filteredTags = this.tagsService.find(value, this.searchTagsCount);
  }

  public tagSelected(event: MatAutocompleteSelectedEvent): void {
    let value = event.option.viewValue
    if (!this.tags.some(tag => tag === value)) {
      this.tags.push(value);
    }

    this.tagInput.nativeElement.value = '';

    this.changedEventEmit();
  }

  private changedEventEmit(): void {
    this.changed.emit(this.tags);
  }
}
