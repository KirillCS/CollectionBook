import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { API_URL, DEFAULT_COLLECTION_COVER, SEARCH_BY_KEY, SEARCH_STRING_KEY, SUPPORTED_IMAGES_TYPES } from 'src/app/app-injection-tokens';
import { CollectionDto } from 'src/app/models/dtos/collection/collection.dto';
import { Roles } from 'src/app/models/roles';
import { AuthTokenService, TokenSettingType } from 'src/app/services/auth-token.service';
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
    private authTokenService: AuthTokenService,
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

  public get isCurrentUserInRoleOwner(): boolean {
    return this.currentUserService.currentUser?.role == Roles.Owner;
  }

  public get isCurrentUserInRoleUser(): boolean {
    return this.currentUserService.currentUser?.role == Roles.User;
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
    this.collectionService.get(this._collectionId).subscribe(
      collection => {
        this._collection = collection;
        this.setPath();
      },
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 404) {
          this.router.navigateByUrl('**', { skipLocationChange: true });
          return;
        }

        this.dialogService.openWarningMessageDialog('Ошибка выборки коллекции', 'В процессе получения коллекции произошла неизвестная ошибка на сервере.');
      },
      () => this._contentLoaded = true);
  }

  public addItemButtonClicked(): void {

    let ref = this.dialog.open(FieldDialogComponent, {
      width: '500px',
      position: { top: '30vh' },
      data: {
        header: 'Создание элемента коллекции',
        message: `Введите название создаваемого элемента коллекции и нажмите кнопку "Создать".`,
        inputLabel: 'Название элемента',
        inputType: 'text',
        formControl: new FormControl('', Validators.required),
        inputErrors: [{ errorCode: 'required', errorMessage: 'Введите название' }],
        closeButtonName: 'Отмена',
        submitButtonName: 'Создать'
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

  public reportButtonClickHandler(): void {

    let ref = this.dialog.open(FieldDialogComponent, {
      width: '550px',
      position: { top: '25vh' },
      data: {
        header: 'Создание жалобы',
        message: `Введите причину жалобы и нажите на кнопку "Отправить".`,
        inputLabel: 'Причина',
        inputType: 'textarea',
        formControl: new FormControl('', [Validators.required, Validators.maxLength(1028)]),
        inputErrors: [
          { errorCode: 'required', errorMessage: 'Введите причину жалобы' },
          { errorCode: 'maxlength', errorMessage: 'Причина жалобы не может быть более 1028 символов' }
        ],
        closeButtonName: 'Отмена',
        submitButtonName: 'Отправить'
      }
    });

    let submitSubscription = ref.componentInstance.submitEmitter.subscribe((formControl: FormControl) => {
      if (formControl.invalid) {
        return;
      }

      ref.close();
      this.collectionService.report(this.collectionId, formControl.value).subscribe(
        () => this.dialogService.openSuccessMessageDialog('Жалоба отправлена', 'Ваша жалоба успшено отправлена адмистрации портала.'),
        (errorResponse: HttpErrorResponse) => {
          switch (errorResponse.status) {
            case 400:
              this.dialogService.openWarningMessageDialog('Ошибка валидации жалобы', 'Жалоба не прошла валидацию: максимальная длина - 1028 символов.');
              break;
            case 401:
              this.authService.logout();
              this.dialogService.openWarningMessageDialog('Ошибка отправки жалобы', 'Для отправки жалобы вы должны быть авторизированы.');
              break;
            case 403:
              let updatedToken = errorResponse.error?.accessToken;
              let tokenSettingType = this.authTokenService.isConstant;
              if (updatedToken && tokenSettingType !== TokenSettingType.NotSet) {
                this.authTokenService.setToken(updatedToken, tokenSettingType == TokenSettingType.Constant);
              }

              this.dialogService.openWarningMessageDialog('Ошибка отправки жалобы', 'У вас недостаточно прав для отправки жалоб: только пользователи могут это делать.');
              break;
            case 404:
              if (errorResponse.error.entityType == 'User') {
                this.authService.logout();
                this.dialogService.openWarningMessageDialog('Ошибка отправки жалобы', 'В процессе отправки жалобы произошла ошибка: пользователь не найден. Попытайтесь войти в учетную запись и отправить свою жалобу снова.');
                break;
              }

              this.router.navigateByUrl('**', { skipLocationChange: true });
              this.dialogService.openInfoMessageDialog('Ошибка отправки жалобы', 'Данная коллекция не найдена: возможно, она уже удалена.');
              break;
            case 405:
              this.authService.logout();
              this.dialogService.openBlockReasonDialog(errorResponse.error.blockReason);
              break;
            default:
              this.dialogService.openWarningMessageDialog('Ошибка отправки жалобы', 'На сервере произошла неизвестная ошибка в процессе отправки жалобы.');
              break;
          }
        }
      );
    });

    ref.afterClosed().subscribe(() => submitSubscription.unsubscribe());
  }

  public coverSelected(files: File[]): void {
    if (!files.length) {
      return;
    }

    let file = files[0];
    if (!this.supportedImageTypes.includes(file.type)) {
      this.dialogService.openInfoMessageDialog('Не поддерживаемый формат', 'Данный формат изображения не поддерживается.');
      return;
    }

    let dialogRef = this.dialog.open(ImageCropperDialogComponent, {
      width: '600px',
      data: new ImageCropperDialogData(file, false, 1, 0, false, 'Обрезка обложки коллекции', 'Загрузить')
    });

    let sub = dialogRef.afterClosed().subscribe((blob: Blob) => {

      if (!blob) {
        return;
      }

      let cover: any = blob;
      cover.name = file.name;

      this.collectionService.changeCover(this.collection.id, <File>cover).subscribe(
        newCoverPath => this.collection.coverPath = newCoverPath,
        (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
          errorResponse,
          'Чтобы изменить обложку коллекции, вы должны быть авторизированы. Войдите в систему и попробуйте снова.',
          `Чтобы изменить обложку коллекции, вы должны быть владельцем данной коллекции.`,
          `В процессе загрузки обложки коллекции произошла неизвестная ошибка.`
        ));
    });

    dialogRef.afterClosed().subscribe(() => sub.unsubscribe());
  }

  public resetCover(): void {
    let dialogRef = this.dialogService.openYesNoDialog('Сбросить обложку коллекции?', 'Вы уверены, что хотите сбросить обложку коллекции?');

    dialogRef.afterClosed().subscribe((yes: boolean) => {
      if (!yes) {
        return;
      }

      this.collectionService.changeCover(this.collection.id, null).subscribe(() => {
        this.collection.coverPath = null;
      }, (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse,
        'Чтобы сбросить обложку коллекции, вы должны быть авторизированы. Войдите в систему и попробуйте снова.',
        `Чтобы сбросить обложку коллекции, вы должны быть владельцем данной коллекции.`,
        `В процессе изменения обложки коллекции произошла неизвестная ошибка.`
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
        header: 'Изменение названия коллекции',
        message: `Измените название коллекции и нажмите на кнопку "Сохранить".`,
        inputLabel: 'Название коллекции',
        inputType: 'text',
        formControl: control,
        inputErrors: [
          { errorCode: 'required', errorMessage: 'Введите название коллекции' },
          { errorCode: 'maxlength', errorMessage: 'Название коллекции не может быть больше 256 символов' }
        ],
        closeButtonName: 'Отмена',
        submitButtonName: 'Сохранить'
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
        header: 'Изменение описания коллекции',
        message: `Измените описание коллекции и нажмите кнопку на "Сохранить".`,
        inputLabel: 'Описание коллекции',
        inputType: 'textarea',
        formControl: control,
        inputErrors: [{ errorCode: 'maxlength', errorMessage: 'Описание коллекции не может быть больше 4096 символов' }],
        closeButtonName: 'Отмена',
        submitButtonName: 'Сохранить'
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
        header: 'Изменение тегов коллекции',
        message: `Добавьте или удалите теги и нажмите кнопку "Сохранить".`,
        inputLabel: 'Теги коллекции',
        tags: this.collection.tags.map(t => t.label),
        closeButtonName: 'Отмена',
        submitButtonName: 'Сохранить'
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
        header: 'Вы уверены?',
        message: `Вы уверены, что хотите УДАЛИТЬ коллекцию "${this.collection.name}"? Удаляя коллекцию, вы также удалите элементы данной коллекции. Это действие не возвратимо. Введите свой логин для подтверждения удаления.`,
        label: 'Логин',
        expectedString: this.collection.user.login,
        deleteButtonLabel: 'УДАЛИТЬ'
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
    this.itemService.create(name, this.collection.id).subscribe(
      itemId => this.router.navigate(['/item', itemId]),
      (errorResponse: HttpErrorResponse) => {
        switch (true) {
          case errorResponse.status == 400:
            this.dialogService.openWarningMessageDialog('Ошибка валидации', 'Название элемента коллекции не может быть пустым.');
            break;
          case errorResponse.status == 401:
            this.authService.logout();
            this.dialogService.openWarningMessageDialog('Ошибка создания элемента', 'Вы должны быть авторизированы, чтобы создать элемент коллекции.');
            break;
          case errorResponse.status == 403:
            let updatedToken = errorResponse.error?.accessToken;
            let tokenSettingType = this.authTokenService.isConstant;
            if (updatedToken && tokenSettingType !== TokenSettingType.NotSet) {
              this.authTokenService.setToken(updatedToken, tokenSettingType == TokenSettingType.Constant);
              this.dialogService.openWarningMessageDialog('Ошибка создания элемента', 'У вас недостаточно прав для создания элементов коллекций - только пользователи и администраторы могут это делать.');
              break;
            }

            this.dialogService.openWarningMessageDialog('Ошибка создания элемента', 'Вы должны быть владельцем данной коллекции, чтобы создать элемент данной коллекции.');
            break;
          case errorResponse.status == 404 && errorResponse.error.entityType == 'Collection':
            this.router.navigate(['**'], {skipLocationChange: true});
            break;
          case errorResponse.status == 404 && errorResponse.error.entityType == 'User':
            this.authService.logout();
            this.dialogService.openWarningMessageDialog('Ошибка создания элемента', 'В процессе создания элемента коллекции произошла ошибка: ваша учетная запись не найдена.');
            break;
          case errorResponse.status == 405:
            this.authService.logout();
            this.dialogService.openBlockReasonDialog(errorResponse.error.blockReason);
            break;
          default:
            this.dialogService.openWarningMessageDialog('Ошибка создания элемента', 'Что-то пошло не так во время создания элемента коллекции.');
            break;
        }
      })
  }

  private changeCollectionName(newName: string): void {
    this.collectionService.changeName(this.collection.id, newName).subscribe(
      () => { },
      (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse,
        'Чтобы изменить название коллекции вы должны быть авторизованы.',
        `Только владелец может изменить название коллекции.`,
        `В процессе изменения названия коллекции произошла неизвестная ошибка.`
      ),
      () => this.collection.name = newName);
  }

  private changeCollectionDescription(newDescription: string): void {
    this.collectionService.changeDescription(this.collection.id, newDescription).subscribe(
      () => { },
      (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse,
        'Чтобы изменить описание коллекции вы должны быть авторизованы.',
        `Только владелец может изменить описание коллекции.`,
        `В процессе изменения описания коллекции произошла неизвестная ошибка.`
      ),
      () => this.collection.description = newDescription);
  }

  private changeCollectionTags(tags: string[]): void {
    this.collectionService.changeTags(this.collection.id, tags).subscribe(
      tags => this.collection.tags = tags,
      (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse,
        'Чтобы изменить теги коллекции вы должны быть авторизованы.',
        `Только владелец может изменить теги коллекции.`,
        `В процессе изменения тегов коллекции произошла неизвестная ошибка.`
      ));
  }

  private deleteCollection(): void {
    this.collectionService.delete(this.collection.id).subscribe(
      () => { },
      (errorResponse: HttpErrorResponse) => this.handleErrorStatuses(
        errorResponse,
        'Чтобы удалить коллекцию вы должны быть авторизованы.',
        `Чтобы удалить данную коллекцию вы должны быть ее владельцем.`,
        `В процессе удаления коллекции произошла неизвестная ошибка.`
      ),
      () => this.router.navigate(['/profile', this.collection.user.login, 'collections']));
  }

  private handleErrorStatuses(errorResponse: HttpErrorResponse, notAuthMessage: string, accessErrorMessage: string, errorMessage: string): void {
    switch (errorResponse.status) {
      case 400:
        break;
      case 401:
        this.authService.logout();
        this.dialogService.openWarningMessageDialog('Вы не авторизованы', notAuthMessage);
        break;
      case 403:
        this.dialogService.openWarningMessageDialog('Вы не имеете доступ', accessErrorMessage);
        break;
      case 404:
        if (errorResponse.error?.entityType == 'User') {
          this.authService.logout();
          this.dialogService.openWarningMessageDialog('Что-то пошло не так', 'Ваша учетная запись не была найдена.');
          break;
        }

        this.router.navigateByUrl('**', { skipLocationChange: true });
        break;
      case 405:
        this.authService.logout();
        this.dialogService.openBlockReasonDialog(errorResponse.error?.blockReason);
        break;
      default:
        this.dialogService.openWarningMessageDialog('Что-то пошло не так', errorMessage);
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
