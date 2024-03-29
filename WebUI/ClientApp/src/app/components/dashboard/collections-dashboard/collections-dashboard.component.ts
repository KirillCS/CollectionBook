import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { DashboardCollectionDto } from 'src/app/models/dtos/collection/dashboard-collection.dto';
import { AdminService } from 'src/app/services/admin.service';
import { AuthTokenService, TokenSettingType } from 'src/app/services/auth-token.service';
import { AuthService } from 'src/app/services/auth.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { SearchBaseComponent } from 'src/app/components/search/search-base.component';
import { PageEvent } from '@angular/material/paginator';
import { SearchPaginatedListRequest } from 'src/app/models/requests/search-paginated-list.request';
import { HttpErrorResponse } from '@angular/common/http';
import { FieldDialogComponent } from '../../dialogs/field-dialog/field-dialog.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-collections-dashboard',
  templateUrl: './collections-dashboard.component.html',
  styleUrls: ['../dashboard.component.scss', './collections-dashboard.component.scss']
})
export class CollectionsDashboardComponent extends SearchBaseComponent implements OnInit {

  private _displayedColumns = ['id', 'name', 'userLogin', 'delete'];

  private _collectionsLoaded = false;
  private _collections = new Array<DashboardCollectionDto>();

  public constructor(
    private _adminService: AdminService,
    private _dialogsService: DefaultDialogsService,
    private _dialog: MatDialog,
    private _router: Router,
    private _authService: AuthService,
    private _authTokenService: AuthTokenService
  ) {
    super();
    this._pageSize = 30;
  }

  public get displayedColumns(): string[] {
    return this._displayedColumns;
  }

  public get collectionsLoaded(): boolean {
    return this._collectionsLoaded;
  }

  public get collections(): DashboardCollectionDto[] {
    return this._collections;
  }

  public ngOnInit(): void {
    this._updateCollections();
  }

  public searchInputChangedHandler(searchString: string): void {
    this._pageIndex = 0;
    this._searchString = searchString;

    this._updateCollections();
  }

  public refreshButtonClickedHandler(): void {
    if (this.collectionsLoaded) {
      this._updateCollections();
    }
  }

  public deleteButtonClickedHandler(collection: DashboardCollectionDto): void {
    let ref = this._dialog.open(FieldDialogComponent, {
      width: '550px',
      position: { top: '25vh' },
      data: {
        header: 'Collection deletion',
        message: `Вы уверены, что хотите удалить коллекцию "${collection.name}"? Введите причину удаления коллекции и нажмите на кнопку "Удалить".`,
        inputLabel: 'Причина',
        inputType: 'textarea',
        formControl: new FormControl('', Validators.required),
        inputErrors: [{ errorCode: 'required', errorMessage: 'Введите причину' }],
        closeButtonName: 'Отмена',
        submitButtonName: 'Удалить'
      }
    });

    let submitSubscription = ref.componentInstance.submitEmitter.subscribe((formControl: FormControl) => {
      if (formControl.invalid) {
        return;
      }

      ref.close();
      this._deleteCollection(collection.id, formControl.value);
    });

    ref.afterClosed().subscribe(() => submitSubscription.unsubscribe());
  }

  public pageChangedHandler(event: PageEvent): void {
    this._pageIndex = event.pageIndex;
    this._pageSize = event.pageSize;

    this._updateCollections();
  }

  private _updateCollections(): void {
    this._collectionsLoaded = false;

    let request: SearchPaginatedListRequest = {
      searchString: this.searchString,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    };

    this._adminService.getDashboardCollections(request).subscribe(
      list => {
        this._collections = list.items;
        this._totalCount = list.totalCount;
      },
      (errorResponse: HttpErrorResponse) => {
        switch (errorResponse.status) {
          case 401:
            this._authService.logout(true);
            this._dialogsService.openWarningMessageDialog('Ошибка выборки коллекций', 'В ходе выборки коллекций произошла ошибка: вы не авторизованы You must be authorized to get dashboard collections.');
          case 403:
            let updatedToken = errorResponse.error.accessToken;
            let tokenSettingType = this._authTokenService.isConstant;
            if (updatedToken && tokenSettingType !== TokenSettingType.NotSet) {
              this._authTokenService.setToken(updatedToken, tokenSettingType == TokenSettingType.Constant);
            }

            this._router.navigateByUrl('/');
            this._dialogsService.openWarningMessageDialog('Ошибка выборки коллекций', 'В ходе выборки коллекций произошла ошибка: вы не имеете доступа к панеле управления коллекциями.');
            break;
          case 404:
            this._authService.logout(true);
            this._dialogsService.openWarningMessageDialog('Ошибка выборки коллекций', 'В ходе выборки коллекций произошла ошибка: ваша учетная запись не найдена.');
            break;
          case 405:
            this._authService.logout(true);
            this._dialogsService.openBlockReasonDialog(errorResponse.error.blockReason);
            break;
          default:
            this._dialogsService.openWarningMessageDialog('Ошибка выборки коллекций', `В ходе выборки коллекций произошла неизвестная ошибка.`);
            break;
        }
      },
      () => this._collectionsLoaded = true);
  }

  private _deleteCollection(id: number, reason: string): void {
    this._adminService.deleteCollection(id, reason).subscribe(
      () => this._updateCollections(),
      (errorResponse: HttpErrorResponse) => {
        switch (errorResponse.status) {
          case 401:
            this._authService.logout(true);
            this._dialogsService.openWarningMessageDialog('Ошибка удаления коллекции', 'В ходе удаления коллекции произошла ошибка: вы не авторизованы.');
          case 403:
            let updatedToken = errorResponse.error.accessToken;
            let tokenSettingType = this._authTokenService.isConstant;
            if (updatedToken && tokenSettingType !== TokenSettingType.NotSet) {
              this._authTokenService.setToken(updatedToken, tokenSettingType == TokenSettingType.Constant);
            }

            this._router.navigateByUrl('/');
            this._dialogsService.openWarningMessageDialog('Ошибка удаления коллекции', 'В ходе удаления коллекции произошла ошибка: вы не имеете достаточно прав для удаления коллекций.');
            break;
          case 404:
            this._authService.logout(true);
            this._dialogsService.openWarningMessageDialog('Ошибка удаления коллекции', 'В ходе удаления коллекции произошла ошибка: ваша учетная запись не найдена.');
            break;
          case 405:
            this._authService.logout(true);
            this._dialogsService.openBlockReasonDialog(errorResponse.error.blockReason);
            break;
          default:
            this._dialogsService.openWarningMessageDialog('Ошибка удаления коллекции', `В ходе удаления коллекции произошла неизвестная ошибка.`);
            break;
        }
      }
    );
  }
}
