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
import { AuthService } from 'src/app/services/auth.service';

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
    private authService: AuthService,
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
      this.itemService.get(id).subscribe(
        item => {
          this._item = item;
          this._pathNodes = [
            new PathNode(item.user.login, `/profile/${item.user.login}`),
            new PathNode(item.collection.name, `/collection/${item.collection.id}`),
            new PathNode(item.name)
          ]
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 404) {
            this.router.navigateByUrl('**', { skipLocationChange: true });
            return;
          }
        },
        () => this._contentLoaded = true);
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
        header: 'Изменение названия элемента',
        message: `Измените название элемента и нажмите на кнопку "Сохранить".`,
        inputLabel: 'Название элемента',
        inputType: 'text',
        formControl: control,
        inputErrors: [
          { errorCode: 'required', errorMessage: 'Введите название элемента' },
          { errorCode: 'maxlength', errorMessage: 'Длина названия элемента не может превышать 256 символов' }
        ],
        closeButtonName: 'Отмена',
        submitButtonName: 'Сохранить'
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
        header: 'Изменение информации об элементе',
        message: `Измените информацию об элементе и нажмите на кнопку "Сохранить".`,
        inputLabel: 'Информация',
        inputType: 'textarea',
        formControl: control,
        inputErrors: [{ errorCode: 'maxlength', errorMessage: 'Максимальное количество символов - 4096' }],
        closeButtonName: 'Отмена',
        submitButtonName: 'Сохранить'
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
        header: 'Изменение тегов элемента',
        message: `Добавьте или удалите теги и нажмите на кнопку "Сохранить".`,
        inputLabel: 'Теги элемента',
        tags: this.item.tags.map(t => t.label),
        closeButtonName: 'Отмена',
        submitButtonName: 'Сохранить'
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
      this.dialogService.openInfoMessageDialog('Неподдерживаемый формат', 'Формат выбранного вами файла не поддерживается порталом.');
      return;
    }

    let dialogRef = this.dialog.open(ImageCropperDialogComponent, {
      width: '600px',
      data: new ImageCropperDialogData(file, false, 1, 0, false, 'Обржьте изображение элемента, если это необходимо', 'Добавить')
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
    let dialogRef = this.dialogService.openYesNoDialog('Удалить изображение?', 'Вы уверены, что хотите удалить изображение элемента?');

    dialogRef.afterClosed().subscribe((yes: boolean) => {
      if (!yes) {
        return;
      }

      this.removeImage(imageId);
    });
  }

  public deleteItemButtonWasClicked(): void {
    let dialogRef = this.dialogService.openYesNoDialog('Удалить элемент коллекции?', `Вы уверены, что хотите УДАЛИТЬ элемент коллекции "${this.item.name}"? Данное действие не возвратимо.`);

    dialogRef.afterClosed().subscribe((yes: boolean) => {
      if (!yes) {
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
    this.itemService.changeName(this.item.id, newName).subscribe(
      () => { },
      (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse,
        'Для изменения названия элемента вы должны быть авторизованы.',
        `Для изменения названия элемента вы должны быть владельцем данной коллекции.`,
        `В процессе изменения названия элемента произошла неизвестная ошибка`
      ),
      () => this.item.name = newName);
  }

  private changeInfo(newInfo: string): void {
    this.itemService.changeInfo(this.item.id, newInfo).subscribe(
      () => { },
      (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse,
        'Для изменения информации об элементе вы должны быть авторизованы.',
        `Для изменения информации об элементе вы должны быть владельцем данной коллекции.`,
        `В процессе изменения информации об элементе произошла неизвестная ошибка`
      ),
      () => this.item.information = newInfo);
  }

  private changeTags(tags: string[]): void {
    this.itemService.changeTags(this.item.id, tags).subscribe(
      tags => this.item.tags = tags,
      (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse,
        'Для изменения тегов данного элемента вы должны быть авторизованы.',
        `Для изменения тегов данного элемента вы должны быть владельцем данной коллекции.`,
        `В процессе изменения тего данного элемента произошла неизвестная ошибка`
      ));
  }

  private addImage(image: File): void {
    this.itemService.addImage(this.item.id, image).subscribe(
      image => {
        this.item.images.push(image);
        this.reinitCarousel();
      }, (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse,
        'Для добавления изображения элемента вы должны быть авторизованы.',
        `Для добавления изображения элемента вы должны быть владельцем данной коллекции.`,
        `В процессе добавления изображения элемента произошла неизвестная ошибка.`
      ));
  }

  private removeImage(imageId: number): void {
    this.itemService.removeImage(imageId).subscribe(
      () => { },
      (errorResponse: HttpErrorResponse) =>
        this.handleErrorStatuses(
          errorResponse,
          'Для удаления изображения элемента вы должны быть авторизованы.',
          `Для удаления изображения элемента вы должны быть владельцем данной коллекции.`,
          `В процессе удаления изображения элемента произошла неизвестная ошибка.`
        ),
      () => {
        this.item.images = this.item.images.filter(i => i.id !== imageId);
        this.reinitCarousel();
      });
  }

  private deleteItem(): void {
    this.itemService.delete(this.item.id).subscribe(
      () => { },
      (errorResponse: HttpErrorResponse) =>
        this.handleErrorStatuses(
          errorResponse,
          'Для удаления элемента вы должны быть авторизованы.',
          `Для удаления элемента вы должны быть владельцем данной коллекции.`,
          `В процессе удаления элемента произошла неизвестная ошибка.`
        ),
      () => this.router.navigate(['/collection', this.item.collection.id]));
  }

  private handleErrorStatuses(errorResponse: HttpErrorResponse, notAuthMessage: string, accessErrorMessage: string, errorMessage: string): void {
    switch (errorResponse.status) {
      case 400:
        break;
      case 401:
        this.authService.logout();
        this.dialogService.openWarningMessageDialog('Не авторизованы', notAuthMessage);
        break;
      case 403:
        this.dialogService.openWarningMessageDialog('Нет доступа', accessErrorMessage);
        break;
      case 404:
        if (errorResponse.error?.entityType == 'User') {
          this.authService.logout();
          this.dialogService.openWarningMessageDialog('Учетная запись не найдена', 'User was not found. Try to log in again.');
          break;
        }

        this.router.navigateByUrl('**', { skipLocationChange: true });
        break;
      case 405:
        this.authService.logout();
        this.dialogService.openBlockReasonDialog(errorResponse.error.blockReason);
        break;
      default:
        this.dialogService.openWarningMessageDialog('Неизвестная ошибка', errorMessage);
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
