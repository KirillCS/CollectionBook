import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ENTER, SPACE, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';

import { TagsService } from 'src/app/services/tags.service';
import { CollectionService } from 'src/app/services/collection.service';
import { CollectionCreatingRequest } from 'src/app/models/requests/collection/collection-creating.request';
import { HttpErrorResponse } from '@angular/common/http';

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

  public image: File;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  public separatorKeysCodes = [ENTER, SPACE, COMMA];
  public filteredTags: Observable<string[]>;
  public tags: string[] = [];

  public inProcess = false;

  public constructor(private tagsService: TagsService, private collectionService: CollectionService) { }

  public imageChanged(image: File) {
    this.image = image;
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

  public submit(): void {
    if (this.nameFormGroup.invalid || this.descriptionFormGroup.invalid) {
      return;
    }

    this.inProcess = true;
    let request: CollectionCreatingRequest = {
      name: this.nameFormGroup.get('name').value,
      description: this.descriptionFormGroup.get('description').value,
      cover: null,
      tags: this.tags
    };

    this.collectionService.create(request).subscribe(() => { }, (errorResponse: HttpErrorResponse) => { }, () => { this.inProcess = false; });
  }
}
