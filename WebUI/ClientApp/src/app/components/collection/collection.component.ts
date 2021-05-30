import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { API_URL, DEFAULT_COLLECTION_COVER, SEARCH_BY_KEY, SEARCH_STRING_KEY, SUPPORTED_IMAGES_TYPES } from 'src/app/app-injection-tokens';
import { CollectionDto } from 'src/app/models/dtos/collection/collection.dto';
import { AuthService } from 'src/app/services/auth.service';
import { CollectionService } from 'src/app/services/collection.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { ItemService } from 'src/app/services/item.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { DeleteFieldDialogComponent } from '../dialogs/delete-field-dialog/delete-field-dialog.component';
import { FieldDialogComponent } from '../dialogs/field-dialog/field-dialog.component';
import { ImageCropperDialogComponent, ImageCropperDialogData } from '../dialogs/image-cropper-dialog/image-cropper-dialog.component';
import { TagsFieldDialogComponent } from '../dialogs/tags-field-dialog/tags-field-dialog.component';
import { SearchCriteriaInStringFormat, SearchCriterion } from '../search/search-criterion';
import { PathNode } from '../ui/path/path-node';
import { StarToggledEventArgs } from '../ui/star/star.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  private _collectionId: number;
  private _collection: CollectionDto;
  private _pathNodes: Array<PathNode>;
  private _contentLoaded: boolean;
  private _acceptImagesTypes: string;

  public constructor(
    route: ActivatedRoute,
    private collectionService: CollectionService,
    private itemService: ItemService,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private router: Router,
    private previousRouteService: PreviousRouteService,
    private dialog: MatDialog,
    private dialogService: DefaultDialogsService,
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_COLLECTION_COVER) private defaultCover: string,
    @Inject(SEARCH_STRING_KEY) private searchStringKey: string,
    @Inject(SEARCH_BY_KEY) private searchByKey: string,
    @Inject(SUPPORTED_IMAGES_TYPES) private supportedImageTypes: string[]
  ) {
    this._acceptImagesTypes = supportedImageTypes.join(',');
    route.paramMap.subscribe(params => this._collectionId = parseInt(params.get("id")));
  }

  public get collectionId(): number {
    return this._collectionId;
  }

  public get collection(): CollectionDto {
    return this._collection;
  }

  public get pathNodes(): Array<PathNode> {
    return this._pathNodes;
  }

  public get collectionCover(): string {
    if (!this.collection?.coverPath) {
      return this.defaultCover;
    }

    return this.apiUrl + this.collection.coverPath;
  }

  public get acceptImagesTypes(): string {
    return this._acceptImagesTypes;
  }

  public get starred(): boolean {
    return this.collection?.stars.some(s => s.userId === this.currentUserService.currentUser?.id)
  }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public get isOwner(): boolean {
    return this.currentUserService.currentUser?.login == this.collection?.user?.login;
  }

  public get resetCoverButtonEnabled(): boolean {
    return this.collection?.coverPath?.length > 0;
  }

  public get contentLoaded(): boolean {
    return this._contentLoaded;
  }

  public ngOnInit(): void {
    this.collectionService.get(this._collectionId).subscribe(collection => {
      this._collection = collection;
      this.setPath();
    }, (errorResponse: HttpErrorResponse) => {
      if (errorResponse.status == 404) {
        this.router.navigateByUrl('**', { skipLocationChange: true });
      } else {
        this.dialogService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server.');
      }
    }, () => this._contentLoaded = true);
  }

  public addItemButtonClicked(): void {

    let ref = this.dialog.open(FieldDialogComponent, {
      width: '500px',
      position: { top: '30vh' },
      data: {
        header: 'Item creating',
        message: `Enter a name of a new collection item.`,
        inputLabel: 'Item name',
        inputType: 'text',
        formControl: new FormControl('', Validators.required),
        inputErrors: [{ errorCode: 'required', errorMessage: 'Item name cannot be empty' }],
        closeButtonName: 'Cancel',
        submitButtonName: 'Create'
      }
    });

    let submitSubscription = ref.componentInstance.submitEmitter.subscribe((formControl: FormControl) => {
      if (formControl.invalid) {
        return;
      }

      ref.close();

      let itemName = formControl.value;
      this.createItem(itemName);
    });

    ref.afterClosed().subscribe(() => submitSubscription.unsubscribe());
  }

  public starToggledHandler(args: StarToggledEventArgs): void {
    if (args.newStatus && !this.starred) {
      this.collection.stars.push({ userId: this.currentUserService.currentUser?.id });
      return;
    }
    
    this.collection.stars = this.collection.stars.filter(s => s.userId != this.currentUserService.currentUser?.id);
  }

  public coverSelected(files: File[]): void {
    if (!files.length) {
      return;
    }

    let file = files[0];
    if (!this.supportedImageTypes.includes(file.type)) {
      this.dialogService.openInfoMessageDialog('Not supported format', 'File has not supported format. It must be image.');
      return;
    }

    let dialogRef = this.dialog.open(ImageCropperDialogComponent, {
      width: '600px',
      data: new ImageCropperDialogData(file, false, 1, 0, false, 'Crop a collection cover', 'Upload')
    });

    let sub = dialogRef.afterClosed().subscribe((blob: Blob) => {

      if (!blob) {
        return;
      }

      let cover: any = blob;
      cover.name = file.name;

      this.collectionService.changeCover(this.collection.id, <File>cover).subscribe(newCoverPath => {
        this.collection.coverPath = newCoverPath;
      }, (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse.status,
        'To change the collection cover you must be authenticated.',
        `To change the collection cover you must be its owner.`,
        `Something went wrong while changing the collection cover.`
      ));
    });

    dialogRef.afterClosed().subscribe(() => sub.unsubscribe());
  }

  public resetCover(): void {
    let dialogRef = this.dialogService.openYesNoDialog('Reset the collection cover?', 'Are you sure you want to reset the collection cover?');

    dialogRef.afterClosed().subscribe((answer: string) => {
      if (answer !== 'Yes') {
        return;
      }

      this.collectionService.changeCover(this.collection.id, null).subscribe(() => {
        this.collection.coverPath = null;
      }, (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse.status,
        'To reset the collection cover you must be authenticated.',
        `To reset the collection cover you must be its owner.`,
        `Something went wrong while reseting the collection cover.`
      ));
    });
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

  public editTagsButtonClicked(): void {
    let ref = this.dialog.open(TagsFieldDialogComponent, {
      width: '600px',
      position: { top: '25vh' },
      data: {
        header: 'Collection tags editing',
        message: `Add or remove tags and click "Save".`,
        inputLabel: 'Collection tags',
        tags: this.collection.tags.map(t => t.label),
        closeButtonName: 'Cancel',
        submitButtonName: 'Save'
      }
    });

    let submitSubscription = ref.componentInstance.submitEmitter.subscribe((tags: string[]) => {
      ref.close();
      this.changeCollectionTags(tags);
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
  
  public getTagQueryParams(tag: string): Params {
    return {
      [this.searchStringKey]: tag,
      [this.searchByKey]: SearchCriteriaInStringFormat.get(SearchCriterion.Tags)
    }
  }

  private createItem(name: string): void {
    this.itemService.create(name, this.collection.id).subscribe(itemId => {
      this.router.navigate(['/item', itemId]);
    }, (errorResponse: HttpErrorResponse) => {
      switch (true) {
        case errorResponse.status == 400:
          this.dialogService.openWarningMessageDialog('Item name cannot be empty', 'You must enter a name of a new item.');
          break;
        case errorResponse.status == 401:
          this.dialogService.openWarningMessageDialog('You are not authenticated', 'You must be authenticated to create a new item.');
          break;
        case errorResponse.status == 403:
          this.dialogService.openWarningMessageDialog('You don\'t have access', 'You must be the the owner of this collection to create a new item.');
          break;
        case errorResponse.status == 404 && errorResponse.error.entityType == 'Collection':
          this.router.navigateByUrl(this.previousRouteService.getPreviousUrl());
          this.dialogService.openWarningMessageDialog('Collection not found', `Collection ${this.collection.name} was not found. Maybe it was deleted.`);
          break;
        case errorResponse.status == 404 && errorResponse.error.entityType == 'User':
          this.dialogService.openWarningMessageDialog('User not found', 'Your account was not found. Maybe it was deleted.');
          break;
        default:
          this.dialogService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server while creating a new item.');
          break;
      }
    })
  }

  private changeCollectionName(newName: string): void {
    this.collectionService.changeName(this.collection.id, newName).subscribe(() => { },
      (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse.status,
        'To change the collection name you must be authenticated.',
        `To change the collection name you must be its owner.`,
        `Something went wrong while changing the collection name.`
      ), () => this.collection.name = newName);
  }

  private changeCollectionDescription(newDescription: string): void {
    this.collectionService.changeDescription(this.collection.id, newDescription).subscribe(() => { },
      (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse.status,
        'To change the collection description you must be authenticated.',
        `To change the collection description you must be its owner.`,
        `Something went wrong while changing the collection description.`
      ), () => this.collection.description = newDescription);
  }

  private changeCollectionTags(tags: string[]): void {
    this.collectionService.changeTags(this.collection.id, tags).subscribe(tags => this.collection.tags = tags,
      (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse.status,
        'To change the collection tags you must be authenticated.',
        `To change the collection tags you must be its owner.`,
        `Something went wrong while changing the collection tags.`
      ));
  }

  private deleteCollection(): void {
    this.collectionService.delete(this.collection.id).subscribe(() => { },
      (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse.status,
        'To delete the collection you must be authenticated.',
        `To delete the collection "${this.collection.name}" you must be its owner.`,
        `Something went wrong while deleting the collection.`
      ), () => this.router.navigate(['/profile', this.collection.user.login, 'collections']));
  }

  private handleErrorStatuses(status: number, notAuthMessage: string, accessErrorMessage: string, errorMessage: string): void {
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

  private setPath(): void {
    this._pathNodes = [
      new PathNode(this.collection.user.login, `/profile/${this.collection.user.login}`),
      new PathNode(this.collection.name),
    ]
  }
}
