import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { ItemService } from 'src/app/services/item.service';
import { FieldDialogComponent } from '../dialogs/field-dialog/field-dialog.component';
import { PathNode } from '../ui/path/path-node';
import { API_URL, DEFAULT_COLLECTION_COVER, SEARCH_BY_KEY, SEARCH_STRING_KEY, SUPPORTED_IMAGES_TYPES } from 'src/app/app-injection-tokens';
import { ItemDto } from 'src/app/models/dtos/item/item.dto';
import { TagsFieldDialogComponent } from '../dialogs/tags-field-dialog/tags-field-dialog.component';
import { ImageCropperDialogComponent, ImageCropperDialogData } from '../dialogs/image-cropper-dialog/image-cropper-dialog.component';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { SearchCriteriaInStringFormat, SearchCriterion } from '../search/search-criterion';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  private _item: ItemDto;
  private _pathNodes: Array<PathNode>;
  private _contentLoaded: boolean = false;
  private _showCarousel: boolean = true;
  private _acceptImagesTypes: string;

  public constructor(
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_COLLECTION_COVER) private defaul: string,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DefaultDialogsService,
    private currentUserService: CurrentUserService,
    @Inject(SEARCH_STRING_KEY) private searchStringKey: string,
    @Inject(SEARCH_BY_KEY) private searchByKey: string,
    @Inject(SUPPORTED_IMAGES_TYPES) private supportedImagesTypes: string[]
  ) {
    this._acceptImagesTypes = supportedImagesTypes.join(',');
  }

  public get pathNodes(): Array<PathNode> {
    return this._pathNodes;
  }

  public get item(): ItemDto {
    return this._item;
  }

  public get defaultImagePath(): string {
    return this.defaul;
  }

  public get acceptImagesTypes(): string {
    return this._acceptImagesTypes;
  }

  public get contentLoaded(): boolean {
    return this._contentLoaded;
  }

  public get showCarousel(): boolean {
    return this._showCarousel;
  }

  public get isOwner(): boolean {
    return this.currentUserService.currentUser && this.item && this.currentUserService.currentUser.id === this.item.user.id;
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let id = parseInt(params.get('id'));
      this.itemService.get(id).subscribe(item => {
        this._item = item;
        this._pathNodes = [
          new PathNode(item.user.login, `/profile/${item.user.login}`),
          new PathNode(item.collection.name, `/collection/${item.collection.id}`),
          new PathNode(item.name)
        ]
      }, (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 404) {
          this.router.navigateByUrl('**', { skipLocationChange: true });
        } else {
          this.dialogService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server.');
        }
      }, () => this._contentLoaded = true);
    });
  }

  public getFullImagePath(imagePath: string): string {
    return `${this.apiUrl}${imagePath}`
  }

  public editNameButtonWasClicked(): void {
    let control = new FormControl('', [Validators.required, Validators.maxLength(256)]);
    control.setValue(this.item.name);

    let dialogRef = this.dialog.open(FieldDialogComponent, {
      width: '500px',
      position: { top: '30vh' },
      data: {
        header: 'Item name editing',
        message: `Edit the item name and click "Save".`,
        inputLabel: 'Item name',
        inputType: 'text',
        formControl: control,
        inputErrors: [
          { errorCode: 'required', errorMessage: 'Item name cannot be empty' },
          { errorCode: 'maxlength', errorMessage: 'Maximum length of the item name is 256' }
        ],
        closeButtonName: 'Cancel',
        submitButtonName: 'Save'
      }
    });

    let submitSubscription = dialogRef.componentInstance.submitEmitter.subscribe((formControl: FormControl) => {
      if (formControl.invalid) {
        return;
      }

      dialogRef.close();

      let newName = formControl.value;
      if (newName == this.item.name) {
        return;
      }

      this.changeName(newName);
    });

    dialogRef.afterClosed().subscribe(() => submitSubscription.unsubscribe());
  }

  public editInfoButtonWasClicked(): void {
    let control = new FormControl('', Validators.maxLength(4096));
    control.setValue(this.item.information);

    let dialogRef = this.dialog.open(FieldDialogComponent, {
      width: '550px',
      position: { top: '25vh' },
      data: {
        header: 'Item information editing',
        message: `Edit the item information and click "Save".`,
        inputLabel: 'Item information',
        inputType: 'textarea',
        formControl: control,
        inputErrors: [{ errorCode: 'maxlength', errorMessage: 'Maximum length of the item information is 4096' }],
        closeButtonName: 'Cancel',
        submitButtonName: 'Save'
      }
    });

    let submitSubscription = dialogRef.componentInstance.submitEmitter.subscribe((formControl: FormControl) => {
      if (formControl.invalid) {
        return;
      }

      dialogRef.close();

      let newInfo = formControl.value;
      if (newInfo == this.item.information) {
        return;
      }

      this.changeInfo(newInfo);
    });

    dialogRef.afterClosed().subscribe(() => submitSubscription.unsubscribe());
  }

  public editTagsButtonWasClicked(): void {
    let dialogRef = this.dialog.open(TagsFieldDialogComponent, {
      width: '600px',
      position: { top: '25vh' },
      data: {
        header: 'Item tags editing',
        message: `Add or remove tags and click "Save".`,
        inputLabel: 'Item tags',
        tags: this.item.tags.map(t => t.label),
        closeButtonName: 'Cancel',
        submitButtonName: 'Save'
      }
    });

    let submitSubscription = dialogRef.componentInstance.submitEmitter.subscribe((tags: string[]) => {
      dialogRef.close();
      this.changeTags(tags);
    });

    dialogRef.afterClosed().subscribe(() => submitSubscription.unsubscribe());
  }

  public imageWasSelected(files: File[]): void {
    if (!files.length) {
      return;
    }

    let file = files[0];
    if (!this.supportedImagesTypes.includes(file.type)) {
      this.dialogService.openInfoMessageDialog('Not supported format', 'File has not supported format. It must be image.');
      return;
    }

    let dialogRef = this.dialog.open(ImageCropperDialogComponent, {
      width: '600px',
      data: new ImageCropperDialogData(file, false, 1, 0, false, 'Add')
    });

    let sub = dialogRef.afterClosed().subscribe((blob: Blob) => {

      if (!blob) {
        return;
      }

      let image: any = blob;
      image.name = file.name;

      this.addImage(<File>image);
    });

    dialogRef.afterClosed().subscribe(() => sub.unsubscribe());
  }

  public removeImageButtonWasClicked(imageId: number): void {
    let dialogRef = this.dialogService.openYesNoDialog('Remove an item image?', 'Are you sure you want to remove the current item image?');

    dialogRef.afterClosed().subscribe((answer: string) => {
      if (answer !== 'Yes') {
        return;
      }

      this.removeImage(imageId);
    });
  }

  public deleteItemButtonWasClicked(): void {
    let dialogRef = this.dialogService.openYesNoDialog('Are you sure?', `Are you sure you want to DELETE the collection item "${this.item.name}"? This action cannot be undone.`);

    dialogRef.afterClosed().subscribe((answer: string) => {
      if (answer !== 'Yes') {
        return;
      }

      this.deleteItem();
    });
  }

  public getTagQueryParams(tag: string): Params {
    return {
      [this.searchStringKey]: tag,
      [this.searchByKey]: SearchCriteriaInStringFormat.get(SearchCriterion.Tags)
    }
  }

  private changeName(newName: string): void {
    this.itemService.changeName(this.item.id, newName).subscribe(() => { },
      (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse.status,
        'To change the item name you must be authenticated.',
        `To change the item name you must be its owner.`,
        `Something went wrong while changing the item name.`
      ), () => this.item.name = newName);
  }

  private changeInfo(newInfo: string): void {
    this.itemService.changeInfo(this.item.id, newInfo).subscribe(() => { },
      (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse.status,
        'To change the item information you must be authenticated.',
        `To change the item information you must be its owner.`,
        `Something went wrong while changing the item information.`
      ), () => this.item.information = newInfo);
  }

  private changeTags(tags: string[]): void {
    this.itemService.changeTags(this.item.id, tags).subscribe(tags => this.item.tags = tags,
      (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse.status,
        'To change the item tags you must be authenticated.',
        `To change the item tags you must be its owner.`,
        `Something went wrong while changing the item tags.`
      ));
  }

  private addImage(image: File): void {
    this.itemService.addImage(this.item.id, image).subscribe(image => {
      this.item.images.push(image);
      this.reinitCarousel();
    }, (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
      errorResponse.status,
      'To add an item image you must be authenticated.',
      `To add an item image you must be its owner.`,
      `Something went wrong while adding an item image.`
    ));
  }

  private removeImage(imageId: number): void {
    this.itemService.removeImage(imageId).subscribe(() => { }, (errorResponse: HttpErrorResponse) =>
      this.handleErrorStatuses(
        errorResponse.status,
        'To remove an item image you must be authenticated.',
        `To remove an item image you must be its owner.`,
        `Something went wrong while removing an item image.`
      ), () => {
        this.item.images = this.item.images.filter(i => i.id !== imageId);
        this.reinitCarousel();
      });
  }

  private deleteItem(): void {
    this.itemService.delete(this.item.id).subscribe(() => { }, (errorResponse: HttpErrorResponse) =>
      this.handleErrorStatuses(
        errorResponse.status,
        'To delete the item you must be authenticated.',
        `To delete the item you must be its owner.`,
        `Something went wrong while deleting the item.`
      ), () => {
        this.router.navigate(['/collection', this.item.collection.id]);
      });
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
        this.dialogService.openWarningMessageDialog('Item not found', `Item was not found. Maybe it was deleted.`);
        this.router.navigate(['/profile', this.item.user.login, 'collections']);
        break;
      default:
        this.dialogService.openWarningMessageDialog('Something went wrong', errorMessage);
        break;
    }
  }

  private reinitCarousel(): void {
    this._showCarousel = false;
    setTimeout(() => {
      this._showCarousel = true;
    }, 10);
  }
}
