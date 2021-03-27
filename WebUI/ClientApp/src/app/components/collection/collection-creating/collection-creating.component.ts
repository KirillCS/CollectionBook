import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ENTER, SPACE, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-collection-creating',
  templateUrl: './collection-creating.component.html',
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class CollectionCreatingComponent implements OnInit {

  public nameFormGroup = new FormGroup({ name: new FormControl() });
  public descriptionFormGroup = new FormGroup({ description: new FormControl() });

  public tagsControl = new FormControl();
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('tagAutocomplete') tagAutocomplete: MatAutocomplete;
  public separatorKeysCodes = [ENTER, SPACE, COMMA];
  public allTags = [
    'Tag1',
    'Tag2',
    'SomeTag',
    'ThebestTag'
  ]
  public filteredTags: Observable<string[]>;
  public tags: string[] = [];

  public constructor() { 
    this.filteredTags = this.tagsControl.valueChanges.pipe(
      map((searchTag: string) => {
        if (!searchTag) {
          return;
        }

        searchTag = searchTag.toLowerCase();

        return this.allTags.filter(tag => tag.toLowerCase().indexOf(searchTag) === 0);
      })
    );
  }

  public ngOnInit(): void {
  }

  public addTag(event: MatChipInputEvent): void {
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
  }

  public removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  public tagSelected(event: MatAutocompleteSelectedEvent): void {
    let value = event.option.viewValue
    if (!this.tags.some(tag => tag === value)) {
      this.tags.push(value);
    }

    this.tagInput.nativeElement.value = '';
    this.tagsControl.setValue(null);
  }
}
