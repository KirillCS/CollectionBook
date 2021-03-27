import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ENTER, SPACE, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';

import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'app-collection-creating',
  templateUrl: './collection-creating.component.html',
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class CollectionCreatingComponent {

  private searchTagsCount = 5;

  public nameFormGroup = new FormGroup({ name: new FormControl() });
  public descriptionFormGroup = new FormGroup({ description: new FormControl() });

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  public separatorKeysCodes = [ENTER, SPACE, COMMA];
  public filteredTags: Observable<string[]>;
  public tags: string[] = [];

  public constructor(private tagsService: TagsService) { }

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

  public tagsInputChanged(): void {
    let value = this.tagInput.nativeElement.value;
    
    this.filteredTags = this.tagsService.searchTags(value, this.searchTagsCount);
  }

  public tagSelected(event: MatAutocompleteSelectedEvent): void {
    let value = event.option.viewValue
    if (!this.tags.some(tag => tag === value)) {
      this.tags.push(value);
    }

    this.tagInput.nativeElement.value = '';
  }
}
