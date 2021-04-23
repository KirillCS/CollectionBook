import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { API_URL, DEFAULT_AVATAR, DEFAULT_COLLECTION_COVER } from 'src/app/app-injection-tokens';
import { CollectionDto } from 'src/app/models/dtos/collection.dto';
import { FullCollectionDto } from 'src/app/models/dtos/full-collection.dto';
import { AuthService } from 'src/app/services/auth.service';
import { CollectionService } from 'src/app/services/collection.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { DeleteFieldDialogComponent } from '../dialogs/delete-field-dialog/delete-field-dialog.component';
import { FieldDialogComponent } from '../dialogs/field-dialog/field-dialog.component';
import { StarChangedEvent } from '../ui/star/star.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  private collectionId: number;
  private collectionDto: FullCollectionDto;

  public constructor(
    route: ActivatedRoute,
    private collectionService: CollectionService,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DefaultDialogsService,
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_AVATAR) private defaultAvatar: string,
    @Inject(DEFAULT_COLLECTION_COVER) private defaultCover: string
  ) {
    route.paramMap.subscribe(params => this.collectionId = parseInt(params.get("id")));
  }

  public get collection(): CollectionDto {
    return this.collectionDto?.collection;
  }

  public get collectionCover(): string {
    if (!this.collection?.coverPath) {
      return this.defaultCover;
    }

    return this.apiUrl + this.collection.coverPath;
  }

  public get starred(): boolean {
    return this.collection?.stars.some(s => s.userId === this.currentUserService.currentUser?.id)
  }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public get showMenuButton(): boolean {
    return this.currentUserService.currentUser?.login == this.collection?.user?.login;
  }

  public ngOnInit(): void {
    this.getCollection();
  }

  public starStatusChanged(event: StarChangedEvent): void {
    if (event.newStatus && !this.starred) {
      this.collection.stars.push({ userId: this.currentUserService.currentUser?.id });
      return;
    }

    this.collection.stars = this.collection.stars.filter(s => s.userId == this.currentUserService.currentUser?.id);
  }

  public editNameButtonClicked(): void {
    let control = new FormControl('', [Validators.required, Validators.maxLength(256)]);
    control.setValue(this.collection.name);

    let ref = this.dialog.open(FieldDialogComponent, {
      width: '500px',
      position: { top: '30vh' },
      data: {
        header: 'Collection name editing',
        message: `Edit the collection name and click "Save".`,
        inputLabel: 'Collection name',
        inputType: 'text',
        formControl: control,
        inputErrors: [
          { errorCode: 'required', errorMessage: 'Collection name cannot be empty' },
          { errorCode: 'maxlength', errorMessage: 'Maximum length of the collection name is 256' }
        ],
        closeButtonName: 'Cancel',
        submitButtonName: 'Save'
      }
    });

    let submitSubscription = ref.componentInstance.submitEmitter.subscribe((formControl: FormControl) => {
      if (formControl.invalid) {
        return;
      }

      ref.close();

      let newName = formControl.value;
      if (newName == this.collection.name) {
        return;
      }

      this.changeCollectionName(newName);
    });

    ref.afterClosed().subscribe(() => submitSubscription.unsubscribe());
  }

  public editDescriptionButtonClicked(): void {
    let control = new FormControl('', Validators.maxLength(4096));
    control.setValue(this.collection.description);

    let ref = this.dialog.open(FieldDialogComponent, {
      width: '550px',
      position: { top: '25vh' },
      data: {
        header: 'Collection description editing',
        message: `Edit the collection description and click "Save".`,
        inputLabel: 'Collection description',
        inputType: 'textarea',
        formControl: control,
        inputErrors: [{ errorCode: 'maxlength', errorMessage: 'Maximum length of the collection description is 4096' }],
        closeButtonName: 'Cancel',
        submitButtonName: 'Save'
      }
    });

    let submitSubscription = ref.componentInstance.submitEmitter.subscribe((formControl: FormControl) => {
      if (formControl.invalid) {
        return;
      }

      ref.close();

      let newDescription = formControl.value;
      if (newDescription == this.collection.description) {
        return;
      }

      this.changeCollectionDescription(newDescription);
    });

    ref.afterClosed().subscribe(() => submitSubscription.unsubscribe());
  }

  public deleteButtonClicked(): void {
    let ref = this.dialog.open(DeleteFieldDialogComponent, {
      width: '500px',
      position: { top: '30vh' },
      data: {
        header: 'Are you sure?',
        message: `Are you sure you want to DELETE your collection "${this.collection.name}"? If you do this, the items of the collection will also be DELETED. This action cannot be undone. Please type your login to confirm.`,
        label: 'Your login',
        expectedString: this.collection.user.login,
        deleteButtonLabel: 'DELETE'
      }
    });

    ref.afterClosed().subscribe((agree: Boolean) => {
      if (agree) {
        this.deleteCollection();
      }
    });
  }

  private changeCollectionName(newName: string): void {
    this.collectionService.changeName(this.collection.id, newName).subscribe(() => { },
      (errorResponse: HttpErrorResponse) => this.proccessErrorStatuses(
        errorResponse.status,
        'To change the collection name you must be authenticated.',
        `To change the collection name you must be its owner.`,
        `Something went wrong while changing the collection name.`
      ), () => this.collection.name = newName);
  }

  private changeCollectionDescription(newDescription: string): void {
    this.collectionService.changeDescription(this.collection.id, newDescription).subscribe(() => { },
      (errorResponse: HttpErrorResponse) => this.proccessErrorStatuses(
        errorResponse.status,
        'To change the collection description you must be authenticated.',
        `To change the collection description you must be its owner.`,
        `Something went wrong while changing the collection description.`
      ), () => this.collection.description = newDescription);
  }

  private deleteCollection(): void {
    this.collectionService.delete(this.collection.id).subscribe(() => { },
      (errorResponse: HttpErrorResponse) => this.proccessErrorStatuses(
        errorResponse.status,
        'To delete the collection you must be authenticated.',
        `To delete the collection "${this.collection.name}" you must be its owner.`,
        `Something went wrong while deleting the collection.`
      ), () => this.router.navigate(['/profile', this.collection.user.login, 'collections']));
  }

  private proccessErrorStatuses(status: number, notAuthMessage: string, accessErrorMessage: string, errorMessage: string): void {
    switch (status) {
      case 400:
        break;
      case 401:
        this.dialogService.openWarningMessageDialog('You are not authenticated', notAuthMessage);
        break;
      case 403:
        this.dialogService.openWarningMessageDialog('You don\'t have access', accessErrorMessage);
        break;
      case 404:
        this.dialogService.openWarningMessageDialog('Collection not found', `Collection was not found. Maybe it was deleted.`);
        this.router.navigate(['/profile', this.collection.user.login, 'collections']);
        break;
      default:
        this.dialogService.openWarningMessageDialog('Something went wrong', errorMessage);
        break;
    }
  }

  private getCollection(): void {
    this.collectionService.getFullCollection(this.collectionId).subscribe(collection => this.collectionDto = collection)
  }
}
