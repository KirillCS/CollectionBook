import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ENTER, SPACE, COMMA } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';

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

  public separatorKeysCodes = [ENTER, SPACE, COMMA];
  public tags: { label: string }[] = [];

  public constructor() { }

  public ngOnInit(): void {
  }

  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const values = event.value.split(/[ ,]/);
    
    values.forEach(value => {
      if ((value || '').trim() && !this.tags.some(t => t.label === value)) {
        this.tags.push({ label: value.trim() });
      }
    })

    if (input) {
      input.value = '';
    }
  }

  public remove(tag: {label: string}): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
}
