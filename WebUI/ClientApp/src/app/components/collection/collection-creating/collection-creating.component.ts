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
import { ServerErrorsService } from 'src/app/services/server-errors.service';
import { AuthService } from 'src/app/services/auth.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DefaultErrorStateMatcher } from 'src/app/error-state-matchers/default-error-state-mathcer';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'app-collection-creating',
  templateUrl: './collection-creating.component.html',
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class CollectionCreatingComponent {

  private searchTagsCount = 5;

  public matcher = new DefaultErrorStateMatcher();

  public nameFormGroup = new FormGroup({ name: new FormControl() });
  public descriptionFormGroup = new FormGroup({ description: new FormControl() });

  public image: File;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  public separatorKeysCodes = [ENTER, SPACE, COMMA];
  public filteredTags: Observable<string[]>;
  public tags: string[] = [];

  public inProcess = false;

  public constructor(
    private tagsService: TagsService,
    private collectionService: CollectionService,
    private serverErrorsService: ServerErrorsService,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private dialogService: DefaultDialogsService,
    private router: Router,
    private previousRouteService: PreviousRouteService,
    private snackBar: MatSnackBar
  ) { }

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

  public goBack(): void {
    this.router.navigateByUrl(this.previousRouteService.getPreviousUrl());
  }

  public submit(): void {
    if (this.nameFormGroup.invalid || this.descriptionFormGroup.invalid) {
      return;
    }

    this.inProcess = true;
    let request: CollectionCreatingRequest = {
      name: this.nameFormGroup.get('name').value,
      description: this.descriptionFormGroup.get('description').value,
      cover: this.image,
      tags: this.tags
    };

    this.collectionService.create(request).subscribe(() => { }, (errorResponse: HttpErrorResponse) => {
      this.inProcess = false;
      if (errorResponse.status == 400) {
        this.serverErrorsService.setFormErrors(this.nameFormGroup, errorResponse);
        this.serverErrorsService.setFormErrors(this.descriptionFormGroup, errorResponse);

        return;
      }

      if (errorResponse.status == 401) {
        this.authService.logout();
        this.dialogService.openWarningMessageDialog('You must be authenticated', 'You must be authenticated to create a new collection.');

        return;
      }

      this.dialogService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server while adding a collection.');
    }, () => {
      this.inProcess = false;
      this.router.navigate(['/profile', this.currentUserService?.currentUser?.login, 'collections']);
      this.snackBar.open('Collection was added', 'OK', { horizontalPosition: 'left', verticalPosition: 'bottom', duration: 3500 });
    });
  }
}
